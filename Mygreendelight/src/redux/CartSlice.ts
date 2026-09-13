import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

export interface IGrocery {
    _id: mongoose.Types.ObjectId | string;
    cartItemId?: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
    stock: number;
    category: string;
    variation?: { weight: string, price: number, stock: number };
    createdAt?: Date;
    updatedAt?: Date;
}

interface CartState {
    cartdata: IGrocery[];
    couponCode: string | null;
    discountAmount: number;
    currentUserId: string | null;
    lastLocalActionAt: number;
}

const getCleanUserId = (userId?: any): string | null => {
    if (!userId) return null;
    const raw = typeof userId === "object" ? (userId._id || userId.id || userId) : userId;
    const str = String(raw).trim();
    if (!str || str === "null" || str === "undefined" || str === "[object Object]") {
        return null;
    }
    return str;
};

const getCartStorageKey = (userId?: any) => {
    const cleanId = getCleanUserId(userId);
    return cleanId ? `subziquick_cart_user_${cleanId}` : "subziquick_cart_guest";
};

const getCouponStorageKey = (userId?: any) => {
    const cleanId = getCleanUserId(userId);
    return cleanId ? `subziquick_coupon_user_${cleanId}` : "subziquick_coupon_guest";
};

let syncTimer: any = null;
let isSyncingToBackend = false;
let lastLocalActionTimestamp = 0;

export const syncCartToBackend = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    if (typeof window === "undefined") return;

    if (syncTimer) clearTimeout(syncTimer);
    // Debounced sync to MongoDB cloud so multi-device updates save cleanly
    syncTimer = setTimeout(async () => {
        isSyncingToBackend = true;
        try {
            await fetch("/api/user/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartdata,
                    couponCode,
                    discountAmount,
                }),
            });
        } catch (e) {
            // Silently swallow network glitches
        } finally {
            isSyncingToBackend = false;
            syncTimer = null;
        }
    }, 250);
};

// Broadcast changes instantly across tabs on the same device
const broadcastCart = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number) => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
    try {
        const channel = new BroadcastChannel("subziquick_cart_sync");
        channel.postMessage({
            type: "CART_MUTATED",
            cartdata,
            couponCode,
            discountAmount,
            timestamp: Date.now(),
        });
        channel.close();
    } catch (_) {}
};

// Pure local storage update without network side effects
const saveCartToStorage = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    if (typeof window === "undefined") return;
    try {
        const cartKey = getCartStorageKey(userId);
        const couponKey = getCouponStorageKey(userId);
        localStorage.setItem(cartKey, JSON.stringify(cartdata));
        localStorage.setItem(couponKey, JSON.stringify({ couponCode, discountAmount }));
        localStorage.removeItem("mgd_cart_data");
        localStorage.removeItem("mgd_cart_coupon");
    } catch (e) {
        console.error("Cart storage save error:", e);
    }
};

// Full save: updates local storage, broadcasts to other tabs, and syncs to MongoDB
const saveCart = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    saveCartToStorage(cartdata, couponCode, discountAmount, userId);
    broadcastCart(cartdata, couponCode, discountAmount);
    syncCartToBackend(cartdata, couponCode, discountAmount, userId);
};

const getSavedCart = (userId?: any): { cartdata: IGrocery[]; couponCode: string | null; discountAmount: number } => {
    if (typeof window === "undefined") return { cartdata: [], couponCode: null, discountAmount: 0 };
    try {
        const cartKey = getCartStorageKey(userId);
        const couponKey = getCouponStorageKey(userId);
        const savedCart = localStorage.getItem(cartKey);
        const savedCoupon = localStorage.getItem(couponKey);

        let cartdata: IGrocery[] = [];
        let couponCode: string | null = null;
        let discountAmount = 0;

        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
                cartdata = parsed
                    .filter((item) => item && (item._id || item.name))
                    .map((item) => ({
                        ...item,
                        _id: item._id ? String(item._id) : "",
                        cartItemId: item.cartItemId || (item.variation ? `${item._id}-${item.variation.weight}` : String(item._id || "")),
                        name: String(item.name || "Item"),
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 1,
                        stock: typeof item.stock === "number" ? item.stock : 50,
                    }));
            }
        }
        if (savedCoupon) {
            const parsed = JSON.parse(savedCoupon);
            couponCode = parsed.couponCode || null;
            discountAmount = parsed.discountAmount || 0;
        }

        return { cartdata, couponCode, discountAmount };
    } catch (e) {
        return { cartdata: [], couponCode: null, discountAmount: 0 };
    }
};

const initialState: CartState = {
    cartdata: [],
    couponCode: null,
    discountAmount: 0,
    currentUserId: null,
    lastLocalActionAt: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        hydrateCart: (state, action: PayloadAction<{ userId?: any } | undefined>) => {
            if (typeof window === "undefined") return;
            try {
                const passedId = action.payload && typeof action.payload === "object" && "userId" in action.payload
                    ? action.payload.userId
                    : undefined;
                const cleanId = passedId !== undefined ? getCleanUserId(passedId) : state.currentUserId;
                state.currentUserId = cleanId;

                if (cleanId) {
                    const guestCart = getSavedCart(null);
                    const userCart = getSavedCart(cleanId);

                    let merged = [...userCart.cartdata];
                    if (guestCart.cartdata.length > 0) {
                        for (const gItem of guestCart.cartdata) {
                            const gKey = gItem.cartItemId || String(gItem._id);
                            const existing = merged.find(i => (i.cartItemId && i.cartItemId === gKey) || String(i._id) === String(gItem._id));
                            if (existing) {
                                const maxStock = existing.variation ? existing.variation.stock : existing.stock;
                                existing.quantity = Math.min(existing.quantity + gItem.quantity, maxStock);
                            } else {
                                merged.push(gItem);
                            }
                        }
                        // Clear guest cart once merged into user account
                        saveCartToStorage([], null, 0, null);
                        // Sync this explicit guest migration to backend
                        syncCartToBackend(merged, userCart.couponCode || guestCart.couponCode, userCart.discountAmount || guestCart.discountAmount, cleanId);
                    }
                    state.cartdata = merged;
                    state.couponCode = userCart.couponCode || guestCart.couponCode;
                    state.discountAmount = userCart.discountAmount || guestCart.discountAmount;
                    // Do NOT sync to backend on mere page load / hydration - only write local storage cache!
                    saveCartToStorage(state.cartdata, state.couponCode, state.discountAmount, cleanId);
                } else {
                    const guestCart = getSavedCart(null);
                    state.cartdata = guestCart.cartdata;
                    state.couponCode = guestCart.couponCode;
                    state.discountAmount = guestCart.discountAmount;
                }
            } catch (e) {
                console.error("Cart hydrate error:", e);
            }
        },

        addToCart: (state, action: PayloadAction<IGrocery>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            const newItem = action.payload;
            const targetKey = newItem.cartItemId || (newItem.variation ? `${newItem._id}-${newItem.variation.weight}` : String(newItem._id));

            const existingItem = state.cartdata.find(
                i => (i.cartItemId && i.cartItemId === targetKey) ||
                     (!i.cartItemId && String(i._id) === String(newItem._id))
            );
            
            const currentStock = newItem.variation ? newItem.variation.stock : (newItem.stock || 50);

            if (existingItem) {
                if (existingItem.quantity + (newItem.quantity || 1) <= currentStock) {
                    existingItem.quantity += (newItem.quantity || 1);
                } else {
                    existingItem.quantity = currentStock;
                }
            } else {
                const q = Math.min(newItem.quantity || 1, currentStock);
                state.cartdata.push({
                    ...newItem,
                    cartItemId: targetKey,
                    quantity: Math.max(1, q),
                });
            }
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        increaseQuantity: (state, action: PayloadAction<string>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            const target = String(action.payload || "");
            const item = state.cartdata.find(
                item => (item.cartItemId && item.cartItemId === target) ||
                        (!item.cartItemId && String(item._id) === target) ||
                        (String(item._id) === target)
            );

            if (item) {
                const currentStock = item.variation ? item.variation.stock : (item.stock || 50);
                if (item.quantity < currentStock) {
                    item.quantity += 1;
                }
            }
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        decreaseQuantity: (state, action: PayloadAction<string>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            const target = String(action.payload || "");
            const itemIndex = state.cartdata.findIndex(
                item => (item.cartItemId && item.cartItemId === target) ||
                        (!item.cartItemId && String(item._id) === target) ||
                        (String(item._id) === target)
            );

            if (itemIndex > -1) {
                const item = state.cartdata[itemIndex];
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    state.cartdata.splice(itemIndex, 1);
                }
            }
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            const target = String(action.payload || "");
            state.cartdata = state.cartdata.filter(
                (item) => (item.cartItemId ? item.cartItemId !== target : String(item._id) !== target) &&
                          String(item._id) !== target
            );
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        applyCoupon: (state, action: PayloadAction<{ couponCode: string; discountAmount: number }>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            state.couponCode = action.payload.couponCode;
            state.discountAmount = action.payload.discountAmount;
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        removeCoupon: (state) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            state.couponCode = null;
            state.discountAmount = 0;
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        addMultipleToCart: (state, action: PayloadAction<IGrocery[]>) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            for (const newItem of action.payload) {
                const targetKey = newItem.cartItemId || (newItem.variation ? `${newItem._id}-${newItem.variation.weight}` : String(newItem._id));
                const existingItem = state.cartdata.find(
                    i => (i.cartItemId && i.cartItemId === targetKey) ||
                         (!i.cartItemId && String(i._id) === String(newItem._id))
                );
                const currentStock = newItem.variation ? newItem.variation.stock : (newItem.stock || 50);
                if (existingItem) {
                    if (existingItem.quantity + (newItem.quantity || 1) <= currentStock) {
                        existingItem.quantity += (newItem.quantity || 1);
                    } else {
                        existingItem.quantity = currentStock;
                    }
                } else {
                    const q = Math.min(newItem.quantity || 1, currentStock);
                    state.cartdata.push({
                        ...newItem,
                        cartItemId: targetKey,
                        quantity: Math.max(1, q),
                    });
                }
            }
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        setCartFromCloud: (
            state,
            action: PayloadAction<{
                cartdata: IGrocery[];
                couponCode?: string | null;
                discountAmount?: number;
                userId?: any;
                serverUpdatedAt?: string | number | Date;
                force?: boolean;
            }>
        ) => {
            const cleanId = getCleanUserId(action.payload.userId || state.currentUserId);
            state.currentUserId = cleanId;

            // 🛡️ RACE CONDITION SHIELD:
            // If the user on THIS device is actively clicking (+ / - / delete within 800ms)
            // or an outgoing POST sync is pending or in-flight, IGNORE incoming GET reads.
            // This device already has the freshest state in memory!
            if (!action.payload.force && (isSyncingToBackend || syncTimer !== null || Date.now() - lastLocalActionTimestamp < 800)) {
                return;
            }

            // Otherwise, apply authoritative cloud cart state
            state.cartdata = action.payload.cartdata || [];
            state.couponCode = action.payload.couponCode || null;
            state.discountAmount = action.payload.discountAmount || 0;

            // Persist locally for immediate offline cache without triggering recursive cloud sync
            saveCartToStorage(state.cartdata, state.couponCode, state.discountAmount, cleanId);
        },

        clearCart: (state) => {
            lastLocalActionTimestamp = Date.now();
            state.lastLocalActionAt = lastLocalActionTimestamp;
            state.cartdata = [];
            state.couponCode = null;
            state.discountAmount = 0;
            saveCart([], null, 0, state.currentUserId);
        },
    },
});

export const {
    hydrateCart,
    setCartFromCloud,
    addToCart,
    increaseQuantity,
    removeFromCart,
    decreaseQuantity,
    applyCoupon,
    removeCoupon,
    addMultipleToCart,
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;