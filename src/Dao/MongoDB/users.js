import { usersModel } from "../models/users.model.js";
import Manager from "./manager.js";

class UsersManager extends Manager {
  constructor() {
    super(usersModel, "cart");
  }
  async findById(id) {
    const response = await usersModel.findById(id);
    return response;
  }

  async findByEmail(email) {
    const response = await usersModel.findOne({ email }).populate("cart");
    console.log("findEmail", response);
    return response;
  }

  async createOne(obj) {
    const response = await usersModel.create(obj);
    console.log("Response from createOne:", response);
    return response;
  }
}

export const usersManager = new UsersManager();
