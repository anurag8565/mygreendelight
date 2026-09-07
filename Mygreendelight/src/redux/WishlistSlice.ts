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

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        hydrateWishlist: (state) => {
            if (typeof window === "undefined") return;
            try {
                const saved = localStorage.getItem("subziquick_wishlist_data");
                if (saved) {
                    state.items = JSON.parse(saved);
                }
            } catch (e) {}
        },
        setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
            state.items = action.payload;
            saveWishlist(state.items);
        },
        toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
            const existing = state.items.find(item => item._id === action.payload._id);
            if (existing) {
                state.items = state.items.filter(item => item._id !== action.payload._id);
            } else {
                state.items.push(action.payload);
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
