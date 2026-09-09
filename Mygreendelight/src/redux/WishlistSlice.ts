import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    category: string;
    stock?: number;
}

interface WishlistState {
    items: WishlistItem[];
    currentUserId: string | null;
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

const getStorageKey = (userId?: any) => {
    const cleanId = getCleanUserId(userId);
    return cleanId ? `subziquick_wishlist_user_${cleanId}` : "subziquick_wishlist_guest";
};

const saveWishlist = (items: WishlistItem[], userId?: any) => {
    if (typeof window === "undefined") return;
    try {
        const key = getStorageKey(userId);
        localStorage.setItem(key, JSON.stringify(items));
        // Clean up legacy global key if it exists
        localStorage.removeItem("subziquick_wishlist_data");
    } catch (e) {
        console.error("Wishlist save error:", e);
    }
};

const getSavedWishlist = (userId?: any): WishlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const key = getStorageKey(userId);
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed
                    .filter((item) => item && (item._id || item.name))
                    .map((item) => ({
                        _id: String(item._id),
                        name: String(item.name || "Fresh Produce"),
                        price: Number(item.price) || 0,
                        image: String(item.image || ""),
                        unit: String(item.unit || "1 unit"),
                        category: String(item.category || "Vegetables"),
                        stock: typeof item.stock === "number" ? item.stock : 50,
                    }));
            }
        }
    } catch (e) {}
    return [];
};

const initialState: WishlistState = {
    items: [],
    currentUserId: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        hydrateWishlist: (state, action: PayloadAction<{ userId?: any } | undefined>) => {
            const userId = action?.payload?.userId !== undefined ? getCleanUserId(action.payload.userId) : state.currentUserId;
            state.currentUserId = userId;
            state.items = getSavedWishlist(state.currentUserId);
        },
        setWishlist: (
            state,
            action: PayloadAction<{ items: any[]; userId?: any; isExplicitClear?: boolean } | any[]>
        ) => {
            let rawItems: any[] = [];
            let userId: string | null = state.currentUserId;
            let isExplicitClear = false;

            if (Array.isArray(action.payload)) {
                rawItems = action.payload;
            } else if (action.payload && typeof action.payload === "object") {
                rawItems = Array.isArray(action.payload.items) ? action.payload.items : [];
                if (action.payload.userId !== undefined) {
                    userId = getCleanUserId(action.payload.userId);
                }
                if (action.payload.isExplicitClear) {
                    isExplicitClear = true;
                }
            }

            state.currentUserId = userId;

            // Map and sanitize the incoming items
            const validItems: WishlistItem[] = rawItems
                .filter((item) => item && typeof item === "object" && (item._id || item.name))
                .map((item) => ({
                    _id: String(item._id),
                    name: String(item.name || "Fresh Produce"),
                    price: Number(item.price) || 0,
                    image: String(item.image || ""),
                    unit: String(item.unit || "1 unit"),
                    category: String(item.category || "Vegetables"),
                    stock: typeof item.stock === "number" ? item.stock : 50,
                }));

            if (validItems.length > 0) {
                state.items = validItems;
                saveWishlist(state.items, state.currentUserId);
            } else if (isExplicitClear) {
                state.items = [];
                saveWishlist([], state.currentUserId);
            } else {
                // If caller passed [] without explicit clear, preserve the locally saved wishlist for this user
                const saved = getSavedWishlist(state.currentUserId);
                if (saved.length > 0) {
                    state.items = saved;
                } else {
                    state.items = [];
                }
            }
        },
        toggleWishlist: (
            state,
            action: PayloadAction<{ item: any; userId?: any } | any>
        ) => {
            if (!action.payload) return;

            let payloadItem = action.payload;
            let targetUserId = state.currentUserId;

            if (action.payload.item && typeof action.payload.item === "object") {
                payloadItem = action.payload.item;
                if (action.payload.userId !== undefined) {
                    targetUserId = getCleanUserId(action.payload.userId);
                }
            }

            const rawId = String(payloadItem._id || "");
            if (!rawId) return;

            // Ensure items array is hydrated if it was empty in memory
            if (state.items.length === 0) {
                const saved = getSavedWishlist(targetUserId);
                if (saved.length > 0) {
                    state.items = saved;
                }
            }

            const existingIndex = state.items.findIndex(
                (item) => String(item._id) === rawId
            );

            if (existingIndex >= 0) {
                state.items.splice(existingIndex, 1);
            } else {
                state.items.push({
                    _id: rawId,
                    name: String(payloadItem.name || "Fresh Produce"),
                    price: Number(payloadItem.price) || 0,
                    image: String(payloadItem.image || ""),
                    unit: String(payloadItem.unit || "1 unit"),
                    category: String(payloadItem.category || "Vegetables"),
                    stock: typeof payloadItem.stock === "number" ? payloadItem.stock : 50,
                });
            }
            state.currentUserId = targetUserId;
            saveWishlist(state.items, targetUserId);
        },
        clearWishlist: (state, action: PayloadAction<{ userId?: any } | undefined>) => {
            const userId = action?.payload?.userId !== undefined ? getCleanUserId(action.payload.userId) : state.currentUserId;
            state.currentUserId = userId;
            state.items = [];
            saveWishlist([], userId);
        }
    }
});

export const { hydrateWishlist, toggleWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;


