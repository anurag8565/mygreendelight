import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectCartItems = (state: RootState) => state.cart.cartdata;

export const selectSubtotal = createSelector(
  [selectCartItems],
  (cartdata) =>
    cartdata.reduce((acc, item) => {
      const price = Number(item.price) || (item.variation ? Number(item.variation.price) : 0) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + (price * qty);
    }, 0)
);

export const selectDeliveryFee = createSelector(
  [selectSubtotal],
  (subtotal) => (subtotal > 0 && subtotal < 199 ? 30 : 0)
);

export const selectDiscount = (state: RootState) => Number(state.cart.discountAmount) || 0;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;

export const selectTotal = createSelector(
  [selectSubtotal, selectDeliveryFee, selectDiscount],
  (subtotal, deliveryFee, discount) => Math.max(0, subtotal + deliveryFee - (Number(discount) || 0))
);