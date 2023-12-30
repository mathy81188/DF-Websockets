import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,

    unique: true,
  },
  age: {
    type: Number,
  },
  //
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  //
  password: {
    type: String,
  },
  google: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    profile: ["isAdmin", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
});

export const usersModel = mongoose.model("Users", usersSchema);
