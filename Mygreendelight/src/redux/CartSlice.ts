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

const saveCart = (cartdata: IGrocery[], couponCode: string | null, discountAmount: number, userId?: any) => {
    if (typeof window === "undefined") return;
    try {
        const cartKey = getCartStorageKey(userId);
        const couponKey = getCouponStorageKey(userId);
        localStorage.setItem(cartKey, JSON.stringify(cartdata));
        localStorage.setItem(couponKey, JSON.stringify({ couponCode, discountAmount }));
        // Clean up legacy global key so different accounts never collide
        localStorage.removeItem("mgd_cart_data");
        localStorage.removeItem("mgd_cart_coupon");
    } catch (e) {
        console.error("Cart save error:", e);
    }
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
                            const existing = merged.find(i => i.cartItemId === gItem.cartItemId);
                            if (existing) {
                                const maxStock = existing.variation ? existing.variation.stock : existing.stock;
                                existing.quantity = Math.min(existing.quantity + gItem.quantity, maxStock);
                            } else {
                                merged.push(gItem);
                            }
                        }
                        // Clear guest cart once merged into user account
                        saveCart([], null, 0, null);
                    }
                    state.cartdata = merged;
                    state.couponCode = userCart.couponCode || guestCart.couponCode;
                    state.discountAmount = userCart.discountAmount || guestCart.discountAmount;
                    saveCart(state.cartdata, state.couponCode, state.discountAmount, cleanId);
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
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
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
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
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
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartdata = state.cartdata.filter(
                (item) => item.cartItemId !== action.payload
            );
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },
        applyCoupon: (state, action: PayloadAction<{ couponCode: string; discountAmount: number }>) => {
            state.couponCode = action.payload.couponCode;
            state.discountAmount = action.payload.discountAmount;
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },
        removeCoupon: (state) => {
            state.couponCode = null;
            state.discountAmount = 0;
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
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
            saveCart(state.cartdata, state.couponCode, state.discountAmount, state.currentUserId);
        },

        clearCart: (state) => {
            state.cartdata = [];
            state.couponCode = null;
            state.discountAmount = 0;
            saveCart([], null, 0, state.currentUserId);
        },
    },
});

export const {
    hydrateCart,
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