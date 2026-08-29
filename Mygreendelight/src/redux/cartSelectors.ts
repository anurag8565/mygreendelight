import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectCartItems = (state: RootState) => state.cart.cartdata;

export const selectSubtotal = createSelector(
  [selectCartItems],
  (cartdata) =>
    cartdata.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

export const selectDeliveryFee = createSelector(
  [selectSubtotal],
  (subtotal) => (subtotal > 0 && subtotal < 100 ? 50 : 0)
);

export const selectDiscount = (state: RootState) => state.cart.discountAmount;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;

export const selectTotal = createSelector(
  [selectSubtotal, selectDeliveryFee, selectDiscount],
  (subtotal, deliveryFee, discount) => subtotal + deliveryFee - discount
);