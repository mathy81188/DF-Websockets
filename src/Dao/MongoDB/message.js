import { messageModel } from "../models/messages.model.js";
import { usersModel } from "../models/users.model.js";
import Manager from "./manager.js";
class MessageManager extends Manager {
  constructor() {
    super(messageModel);
  }
  async findByEmail(email) {
    const user = await usersModel.findOne({ email });
    return user ? user.role : null;
  }
}

export const messageManager = new MessageManager();
