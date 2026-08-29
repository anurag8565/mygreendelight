import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface iUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryboy";
  image?: string;
}

interface iUserSlice {
  userdata: iUser | null;
}

const initialState: iUserSlice = {
  userdata: null,
};

const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserdata: (state, action) => {
      state.userdata = action.payload;
    },

    clearUserdata: (state) => {
      state.userdata = null;
    },
  },
});

export const { setUserdata, clearUserdata } = userslice.actions;
export default userslice.reducer;