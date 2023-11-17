import mongoose, { Mongoose } from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  github: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    profile: ["isAdmin", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "carts",
  },
});

export const usersModel = mongoose.model("Users", usersSchema);
