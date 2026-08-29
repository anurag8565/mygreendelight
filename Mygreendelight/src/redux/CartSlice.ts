import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
    _id: mongoose.Types.ObjectId;
    cartItemId?: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
    stock: number;
    category: string;
    variation?: { weight: string, price: number, stock: number };
    createdAt: Date;
    updatedAt: Date;
}

interface CartState {
    cartdata: IGrocery[];
    couponCode: string | null;
    discountAmount: number;
}

const initialState: CartState = {
    cartdata: [],
    couponCode: null,
    discountAmount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IGrocery>) => {
            const newItem = action.payload;
            const existingItem = state.cartdata.find(i => i.cartItemId === newItem.cartItemId);
            
            const currentStock = newItem.variation ? newItem.variation.stock : newItem.stock;

            if (existingItem) {
                if (existingItem.quantity + newItem.quantity <= currentStock) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    existingItem.quantity = currentStock;
                }
            } else {
                if (newItem.quantity > currentStock) newItem.quantity = currentStock;
                state.cartdata.push(newItem);
            }
        },
        increaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.cartdata.find(
                item => item.cartItemId === action.payload
            );

            if (item) {
                const currentStock = item.variation ? item.variation.stock : item.stock;
                if (item.quantity < currentStock) {
                    item.quantity += 1;
                }
            }
        },

        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.cartdata.find(
                item => item.cartItemId === action.payload
            );

            if (item) {
                item.quantity -= 1;

                if (item.quantity <= 0) {
                    state.cartdata = state.cartdata.filter(
                        i => i.cartItemId !== action.payload
                    );
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartdata = state.cartdata.filter(
                (item) => item.cartItemId !== action.payload
            );
        },
        applyCoupon: (state, action: PayloadAction<{ couponCode: string; discountAmount: number }>) => {
            state.couponCode = action.payload.couponCode;
            state.discountAmount = action.payload.discountAmount;
        },
        removeCoupon: (state) => {
            state.couponCode = null;
            state.discountAmount = 0;
        },
        addMultipleToCart: (state, action: PayloadAction<IGrocery[]>) => {
            for (const newItem of action.payload) {
                const existingItem = state.cartdata.find(i => i.cartItemId === newItem.cartItemId);
                const currentStock = newItem.variation ? newItem.variation.stock : newItem.stock;
                if (existingItem) {
                    if (existingItem.quantity + newItem.quantity <= currentStock) {
                        existingItem.quantity += newItem.quantity;
                    } else {
                        existingItem.quantity = currentStock;
                    }
                } else {
                    if (newItem.quantity > currentStock) newItem.quantity = currentStock;
                    state.cartdata.push(newItem);
                }
            }
        },

    },
});
export const {
    increaseQuantity,
    removeFromCart,
    decreaseQuantity,
    applyCoupon,
    removeCoupon,
    addMultipleToCart,
} = cartSlice.actions;
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;