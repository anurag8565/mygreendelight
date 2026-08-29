import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Chat =
  mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;