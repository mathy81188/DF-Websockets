import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
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

productsSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("Products", productsSchema);
