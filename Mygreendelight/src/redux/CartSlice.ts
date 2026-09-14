import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";
import { socket } from "@/lib/socket";

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
    isCloudHydrated: boolean;
    pendingSyncCount: number;
}

export const getCleanUserId = (userId?: any): string | null => {
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

export const CLIENT_SESSION_ID = typeof window !== "undefined"
  ? ((window as any).__subziquick_client_id || ((window as any).__subziquick_client_id = "client_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36)))
  : "server";

let syncTimer: any = null;
let isSyncingToBackend = false;
let lastLocalActionTimestamp = 0;
let pendingCartToSync: { cartdata: IGrocery[]; couponCode: string | null; discountAmount: number; userId?: any } | null = null;

// Broadcast changes instantly across both same-device tabs (BroadcastChannel) and other devices (WebSocket)
export const emitLiveCartUpdate = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    let cleanId = getCleanUserId(userId);
    if (!cleanId && typeof window !== "undefined") {
        cleanId = localStorage.getItem("subziquick_guest_id");
    }

    // 1. Same-device multi-tab instant broadcast (0ms delay)
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
        try {
            const channel = new BroadcastChannel("subziquick_cart_sync");
            channel.postMessage({
                type: "CART_MUTATED",
                cartdata,
                couponCode,
                discountAmount,
                timestamp: Date.now(),
                clientId: CLIENT_SESSION_ID,
            });
            setTimeout(() => {
                try { channel.close(); } catch (_) {}
            }, 500);
        } catch (_) {}
    }

    // 2. Cross-device WebSocket live broadcast (<20ms delay)
    if (cleanId && socket && socket.connected) {
        try {
            socket.emit("cart-changed", {
                userId: cleanId,
                cart: {
                    items: cartdata,
                    couponCode,
                    discountAmount,
                },
                timestamp: Date.now(),
                clientId: CLIENT_SESSION_ID,
            });
        } catch (_) {}
    }
};

export const syncCartToBackend = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    if (typeof window === "undefined") return;

    lastLocalActionTimestamp = Date.now();
    const cleanId = getCleanUserId(userId);

    // Immediately push live update via WebSocket and BroadcastChannel
    emitLiveCartUpdate(cartdata, couponCode, discountAmount, cleanId);

    // Always store the freshest clone of cart state so rapid clicks (1->2->3->4) sync the final quantity
    pendingCartToSync = {
        cartdata: JSON.parse(JSON.stringify(cartdata)),
        couponCode,
        discountAmount,
        userId: cleanId,
    };

    if (syncTimer) clearTimeout(syncTimer);
    // Debounced sync to MongoDB cloud so rapid clicks only sync the final quantity
    syncTimer = setTimeout(async () => {
        if (!pendingCartToSync) return;
        const toSync = pendingCartToSync;
        isSyncingToBackend = true;
        try {
            await fetch("/api/user/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: toSync.cartdata,
                    couponCode: toSync.couponCode,
                    discountAmount: toSync.discountAmount,
                    clientTimestamp: Date.now(),
                    clientId: CLIENT_SESSION_ID,
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

// Pure local storage update without network side effects
const saveCartToStorage = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    if (typeof window === "undefined") return;
    try {
        const cleanId = getCleanUserId(userId);
        const cartKey = cleanId ? `subziquick_cart_user_${cleanId}` : "subziquick_cart_guest";
        const couponKey = cleanId ? `subziquick_coupon_user_${cleanId}` : "subziquick_coupon_guest";
        localStorage.setItem(cartKey, JSON.stringify(cartdata));
        localStorage.setItem(couponKey, JSON.stringify({ couponCode, discountAmount }));
        
        // Also keep guest key updated so if session transitions, items aren't overwritten with old quantity
        if (cleanId) {
            localStorage.setItem("subziquick_cart_guest", JSON.stringify(cartdata));
        }
        localStorage.removeItem("mgd_cart_data");
        localStorage.removeItem("mgd_cart_coupon");
    } catch (e) {
        console.error("Cart storage save error:", e);
    }
};

// Full save: updates local storage, broadcasts to other tabs, and syncs to MongoDB
const saveCart = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    saveCartToStorage(cartdata, couponCode, discountAmount, userId);
    syncCartToBackend(cartdata, couponCode, discountAmount, userId);
};

const getSavedCart = (userId?: any): { cartdata: IGrocery[]; couponCode: string | null; discountAmount: number } => {
    if (typeof window === "undefined") return { cartdata: [], couponCode: null, discountAmount: 0 };
    try {
        const cleanId = getCleanUserId(userId);
        const userCartKey = cleanId ? `subziquick_cart_user_${cleanId}` : null;
        const guestCartKey = "subziquick_cart_guest";
        const legacyCartKey = "mgd_cart_data";

        // Read all possible keys
        const userRaw = userCartKey ? localStorage.getItem(userCartKey) : null;
        const guestRaw = localStorage.getItem(guestCartKey);
        const legacyRaw = localStorage.getItem(legacyCartKey);

        const parseItems = (raw: string | null): IGrocery[] => {
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed
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
            } catch (_) {}
            return [];
        };

        const userItems = parseItems(userRaw);
        const guestItems = parseItems(guestRaw);
        const legacyItems = parseItems(legacyRaw);

        // Merge user + guest + legacy items so no produce is ever lost across transitions
        let combined: IGrocery[] = [];
        const seenKeys = new Set<string>();

        const addItem = (item: IGrocery) => {
            const key = item.cartItemId || String(item._id);
            if (!key) return;
            const existing = combined.find(i => (i.cartItemId && i.cartItemId === key) || String(i._id) === String(item._id));
            if (existing) {
                const maxStock = existing.variation ? existing.variation.stock : existing.stock;
                existing.quantity = Math.min(Math.max(existing.quantity, item.quantity), maxStock);
            } else {
                combined.push({ ...item });
                seenKeys.add(key);
            }
        };

        if (cleanId) {
            if (userItems.length > 0) {
                userItems.forEach(addItem);
            } else {
                guestItems.forEach(addItem);
                legacyItems.forEach(addItem);
            }
        } else {
            guestItems.forEach(addItem);
            legacyItems.forEach(addItem);
            // If guest has nothing, check if there was an existing user cart key in localStorage
            if (combined.length === 0) {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith("subziquick_cart_user_")) {
                        const items = parseItems(localStorage.getItem(k));
                        items.forEach(addItem);
                        if (combined.length > 0) break;
                    }
                }
            }
        }

        let couponCode: string | null = null;
        let discountAmount = 0;
        const couponKey = getCouponStorageKey(userId);
        const savedCoupon = localStorage.getItem(couponKey) || localStorage.getItem("subziquick_coupon_guest");
        if (savedCoupon) {
            try {
                const parsed = JSON.parse(savedCoupon);
                couponCode = parsed.couponCode || null;
                discountAmount = parsed.discountAmount || 0;
            } catch (_) {}
        }

        return { cartdata: combined, couponCode, discountAmount };
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
    isCloudHydrated: false,
    pendingSyncCount: 0,
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

                const saved = getSavedCart(cleanId);

                // If in-memory state already has items, prioritize in-memory quantities (active user actions)!
                if (state.cartdata.length > 0) {
                    let merged = [...state.cartdata];
                    for (const sItem of saved.cartdata) {
                        const sKey = sItem.cartItemId || String(sItem._id);
                        const existing = merged.find(i => (i.cartItemId && i.cartItemId === sKey) || String(i._id) === String(sItem._id));
                        if (!existing) {
                            merged.push(sItem);
                        } else {
                            existing.quantity = Math.max(existing.quantity, sItem.quantity || 1);
                        }
                    }
                    state.cartdata = merged;
                } else {
                    state.cartdata = saved.cartdata;
                }

                state.couponCode = state.couponCode || saved.couponCode;
                state.discountAmount = state.discountAmount || saved.discountAmount;

                // Save back to both user & guest storage so items are consistently available
                saveCartToStorage(state.cartdata, state.couponCode, state.discountAmount, cleanId);

                if (cleanId && state.cartdata.length > 0) {
                    syncCartToBackend(state.cartdata, state.couponCode, state.discountAmount, cleanId);
                }

                state.isCloudHydrated = true;
            } catch (e) {
                console.error("Cart hydrate error:", e);
                state.isCloudHydrated = true;
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
            state.cartdata = state.cartdata.filter((item) => {
                if (item.cartItemId) {
                    return item.cartItemId !== target;
                }
                return String(item._id) !== target;
            });
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
                requestStartedAt?: number;
                force?: boolean;
            }>
        ) => {
            const cleanId = getCleanUserId(action.payload.userId || state.currentUserId);
            state.currentUserId = cleanId;

            const reqTime = action.payload.requestStartedAt || 0;
            const now = Date.now();
            const isRecentLocalAction = (now - state.lastLocalActionAt < 4000) || (now - lastLocalActionTimestamp < 4000);

            // 🛡️ RECENT USER INTERACTION SHIELD (4s):
            // If user just interacted on this tab, never overwrite with background polling/stale GET responses!
            if (!action.payload.force && isRecentLocalAction) {
                return;
            }

            // 🛡️ IN-FLIGHT RACE CONDITION SHIELD:
            // 1. If this GET request was started BEFORE the user made their latest local click,
            // it contains stale data! DISCARD IT!
            if (!action.payload.force && reqTime > 0 && reqTime < state.lastLocalActionAt) {
                return;
            }

            // 2. If the user on THIS device has an in-flight sync or pending debounce,
            // don't let external reads overwrite the local optimistic state!
            if (!action.payload.force && (isSyncingToBackend || syncTimer !== null)) {
                return;
            }

            // 3. 🛡️ EMPTY CLOUD OVERWRITE SHIELD:
            // If the incoming cloud cart is empty, but we already have items in local state (or in localStorage),
            // this happens right after login before guest cart synced to cloud. Do NOT wipe the user's basket!
            const incomingItems = action.payload.cartdata || [];
            if (incomingItems.length === 0 && state.cartdata.length > 0 && !action.payload.force) {
                // Keep local items and push them to cloud
                if (cleanId) {
                    syncCartToBackend(state.cartdata, state.couponCode, state.discountAmount, cleanId);
                }
                state.isCloudHydrated = true;
                return;
            }

            // 🛡️ PER-ITEM QUANTITY SAFEGUARD:
            // Never allow an incoming cloud/socket update to downgrade an item quantity that is locally higher!
            // This prevents race conditions where an older server state arrives after a local increment.
            if (state.cartdata.length > 0) {
                const reconciled = incomingItems.map((inc) => {
                    const localMatch = state.cartdata.find(
                        (loc) => (loc.cartItemId && loc.cartItemId === inc.cartItemId) ||
                                 String(loc._id) === String(inc._id)
                    );
                    if (localMatch && localMatch.quantity > inc.quantity) {
                        return { ...inc, quantity: localMatch.quantity };
                    }
                    return inc;
                });
                state.cartdata = reconciled;
            } else {
                state.cartdata = incomingItems;
            }

            state.couponCode = action.payload.couponCode || null;
            state.discountAmount = action.payload.discountAmount || 0;
            state.isCloudHydrated = true;

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