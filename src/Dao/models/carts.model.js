import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [{ productId: String, quantity: Number }],
    require: true,
  },
});

export const cartModel = model("carts", cartSchema);
