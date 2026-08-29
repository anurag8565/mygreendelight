import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    category: string;
}

interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
            state.items = action.payload;
        },
        toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
            const existing = state.items.find(item => item._id === action.payload._id);
            if (existing) {
                state.items = state.items.filter(item => item._id !== action.payload._id);
            } else {
                state.items.push(action.payload);
            }
        }
    }
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
