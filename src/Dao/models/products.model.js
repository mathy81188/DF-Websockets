import { Schema, model } from "mongoose";

const productsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },
});

export const productModel = model("Products", productsSchema);
