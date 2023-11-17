import { usersModel } from "../models/users.model.js";
import Manager from "./manager.js";

class UsersManager extends Manager {
  constructor() {
    super(usersModel, "carts");
  }
  async findById(id) {
    const response = await usersModel.findById(id);
    return response;
  }
  async findByEmail(email) {
    const response = await usersModel.findOne({ email }).populate("carts");
    return response;
  }

  async createOne(obj) {
    const response = await usersModel.create(obj);
    return response;
  }
}

export const usersManager = new UsersManager();
