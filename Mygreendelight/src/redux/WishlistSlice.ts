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

const getStorageKey = (userId?: string | null) => {
    return userId ? `subziquick_wishlist_user_${userId}` : "subziquick_wishlist_guest";
};

const saveWishlist = (items: WishlistItem[], userId?: string | null) => {
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

const getSavedWishlist = (userId?: string | null): WishlistItem[] => {
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
        hydrateWishlist: (state, action: PayloadAction<{ userId?: string | null } | undefined>) => {
            const userId = action?.payload?.userId !== undefined ? action.payload.userId : state.currentUserId;
            state.currentUserId = userId || null;
            state.items = getSavedWishlist(state.currentUserId);
        },
        setWishlist: (
            state,
            action: PayloadAction<{ items: any[]; userId?: string | null } | any[]>
        ) => {
            let rawItems: any[] = [];
            let userId: string | null | undefined = state.currentUserId;

            if (Array.isArray(action.payload)) {
                rawItems = action.payload;
            } else if (action.payload && typeof action.payload === "object") {
                rawItems = Array.isArray(action.payload.items) ? action.payload.items : [];
                if (action.payload.userId !== undefined) {
                    userId = action.payload.userId || null;
                }
            }

            state.currentUserId = userId || null;

            // Map and sanitize the incoming user items
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

            // Crucial: REPLACE state.items with this user's exact wishlist (DO NOT merge with other users!)
            state.items = validItems;
            saveWishlist(state.items, state.currentUserId);
        },
        toggleWishlist: (
            state,
            action: PayloadAction<{ item: any; userId?: string | null } | any>
        ) => {
            if (!action.payload) return;

            let payloadItem = action.payload;
            let targetUserId = state.currentUserId;

            if (action.payload.item && typeof action.payload.item === "object") {
                payloadItem = action.payload.item;
                if (action.payload.userId !== undefined) {
                    targetUserId = action.payload.userId || null;
                }
            }

            const rawId = String(payloadItem._id || "");
            if (!rawId) return;

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
            saveWishlist(state.items, targetUserId);
        },
        clearWishlist: (state, action: PayloadAction<{ userId?: string | null } | undefined>) => {
            const userId = action?.payload?.userId !== undefined ? action.payload.userId : state.currentUserId;
            state.items = [];
            saveWishlist([], userId);
        }
    }
});

export const { hydrateWishlist, toggleWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;


