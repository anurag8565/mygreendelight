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
}

const saveWishlist = (items: WishlistItem[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem("subziquick_wishlist_data", JSON.stringify(items));
    } catch (e) {
        console.error("Wishlist save error:", e);
    }
};

const getSavedWishlist = (): WishlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem("subziquick_wishlist_data");
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
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        hydrateWishlist: (state) => {
            const saved = getSavedWishlist();
            if (saved.length > 0) {
                state.items = saved;
            }
        },
        setWishlist: (state, action: PayloadAction<any[]>) => {
            if (!Array.isArray(action.payload)) return;

            // Only update if payload contains actual populated item objects
            const validItems = action.payload
                .filter((item) => item && typeof item === "object" && item._id && item.name)
                .map((item) => ({
                    _id: String(item._id),
                    name: String(item.name),
                    price: Number(item.price) || 0,
                    image: String(item.image || ""),
                    unit: String(item.unit || "1 unit"),
                    category: String(item.category || "Vegetables"),
                    stock: typeof item.stock === "number" ? item.stock : 50,
                }));

            if (validItems.length > 0) {
                // Merge unique items with existing
                const existingMap = new Map<string, WishlistItem>();
                state.items.forEach((item) => existingMap.set(String(item._id), item));
                validItems.forEach((item) => existingMap.set(String(item._id), item));
                state.items = Array.from(existingMap.values());
                saveWishlist(state.items);
            }
        },
        toggleWishlist: (state, action: PayloadAction<any>) => {
            if (!action.payload) return;
            const rawId = String(action.payload._id || "");
            if (!rawId) return;

            const existingIndex = state.items.findIndex(
                (item) => String(item._id) === rawId
            );

            if (existingIndex >= 0) {
                state.items.splice(existingIndex, 1);
            } else {
                state.items.push({
                    _id: rawId,
                    name: String(action.payload.name || "Fresh Produce"),
                    price: Number(action.payload.price) || 0,
                    image: String(action.payload.image || ""),
                    unit: String(action.payload.unit || "1 unit"),
                    category: String(action.payload.category || "Vegetables"),
                    stock: typeof action.payload.stock === "number" ? action.payload.stock : 50,
                });
            }
            saveWishlist(state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            saveWishlist(state.items);
        }
    }
});

export const { hydrateWishlist, toggleWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

