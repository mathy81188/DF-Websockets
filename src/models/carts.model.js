import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
      },
      totalPrice: {
        type: Number,
      },
      _id: false,
    },
  ],
});

export const cartModel = mongoose.model("carts", cartSchema);
