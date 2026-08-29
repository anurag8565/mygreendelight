import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./CartSlice";
import wishlistSlice from "./WishlistSlice";

export const store = configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice,
        wishlist: wishlistSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
