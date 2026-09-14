'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { setCartFromCloud, getCleanUserId, CLIENT_SESSION_ID } from '@/redux/CartSlice';
import { socket } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export function useCartSync(userIdProp?: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUserId } = useSelector((state: RootState) => state.cart);
  const { userdata } = useSelector((state: RootState) => state.user);
  const { data: session, status: authStatus } = useSession();

  const rawUserId = userIdProp !== undefined 
    ? userIdProp 
    : (userdata?._id || (userdata as any)?.id || (session?.user as any)?._id || session?.user?.id || currentUserId);
  const cleanUserId = getCleanUserId(rawUserId);
  const lastFetchRef = useRef<number>(0);

  // Authoritative helper to format raw items from cloud/socket
  const formatItems = useCallback((items: any[]): any[] => {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item: any) => item && (item._id || item.product || item.name))
      .map((item: any) => {
        const prodId = item.product?._id ? String(item.product._id) : (item.product ? String(item.product) : String(item._id || ""));
        const weight = item.variation?.weight;
        const cKey = item.cartItemId || (weight ? `${prodId}-${weight}` : prodId);
        return {
          _id: prodId,
          cartItemId: cKey,
          name: item.name || item.product?.name || "Item",
          price: item.price ?? item.product?.price ?? 0,
          unit: item.unit || item.product?.unit || "kg",
          image: item.image || item.product?.image || "",
          quantity: Math.max(1, Number(item.quantity) || 1),
          stock: typeof (item.stock ?? item.product?.stock) === "number" ? (item.stock ?? item.product?.stock) : 50,
          category: item.category || item.product?.category || "Produce",
          variation: item.variation || undefined,
        };
      });
  }, []);

  // Fetch latest cart from MongoDB with stale-request tracking
  const fetchCloudCart = useCallback(async () => {
    const reqStartedAt = Date.now();
    lastFetchRef.current = reqStartedAt;

    try {
      const res = await axios.get(`/api/user/cart?_t=${reqStartedAt}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });

      if (res.data?.success && res.data?.cart) {
        const formatted = formatItems(res.data.cart.items || []);
        dispatch(
          setCartFromCloud({
            cartdata: formatted,
            couponCode: res.data.cart.couponCode || null,
            discountAmount: res.data.cart.discountAmount || 0,
            userId: cleanUserId,
            serverUpdatedAt: res.data.cart.updatedAt || res.data.serverTimestamp,
            requestStartedAt: reqStartedAt,
          })
        );
      }
    } catch (_) {
      // Gracefully ignore network hiccups
    }
  }, [dispatch, cleanUserId, formatItems]);

  useEffect(() => {
    // 1. Initial authoritative fetch on mount or user change
    fetchCloudCart();

    // 2. Real-time WebSocket synchronization across devices (Mobile <-> Laptop)
    const handleSocketCartUpdated = (data: any) => {
      try {
        if (!data || !data.cart) return;
        // 🛡️ SELF-ECHO SHIELD: Do not overwrite this tab with echoes of its own actions!
        if (data.clientId && data.clientId === CLIENT_SESSION_ID) return;

        const incomingCart = data.cart;
        const formatted = formatItems(incomingCart.items || []);
        const eventTimestamp = Number(data.timestamp) || Date.now();

        dispatch(
          setCartFromCloud({
            cartdata: formatted,
            couponCode: incomingCart.couponCode || null,
            discountAmount: incomingCart.discountAmount || 0,
            userId: cleanUserId,
            serverUpdatedAt: eventTimestamp,
            requestStartedAt: eventTimestamp,
          })
        );
      } catch (err) {
        console.error("Socket cart-updated error:", err);
      }
    };

    let targetSocketId = cleanUserId;
    if (!targetSocketId && typeof window !== "undefined") {
      targetSocketId = localStorage.getItem("subziquick_guest_id");
    }

    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }
      if (targetSocketId) {
        socket.emit("register-user", targetSocketId);
      }
      socket.on("cart-updated", handleSocketCartUpdated);
    }

    // 3. Multi-tab instant sync via BroadcastChannel (0ms delay across tabs on same device)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel("subziquick_cart_sync");
        channel.onmessage = (event) => {
          // 🛡️ SELF-ECHO SHIELD: Ignore messages posted by our own tab!
          if (event.data?.clientId === CLIENT_SESSION_ID) return;

          if (event.data?.type === "CART_MUTATED" && Array.isArray(event.data.cartdata)) {
            dispatch(
              setCartFromCloud({
                cartdata: event.data.cartdata,
                couponCode: event.data.couponCode,
                discountAmount: event.data.discountAmount,
                userId: cleanUserId,
                serverUpdatedAt: event.data.timestamp,
                requestStartedAt: event.data.timestamp,
              })
            );
          }
        };
      } catch (_) {}
    }

    // 4. Tab focus & visibility change listener (syncs when switching back from another device)
    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchCloudCart();
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // 5. Gentle 6-second heartbeat polling only while tab is active and visible
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchCloudCart();
      }
    }, 6000);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(interval);
      if (channel) channel.close();
      if (socket) {
        socket.off("cart-updated", handleSocketCartUpdated);
      }
    };
  }, [cleanUserId, fetchCloudCart, formatItems, dispatch]);
}
