import { messageModel } from "../models/messages.model.js";
import Manager from "./manager.js";
class MessageManager extends Manager {
  constructor() {
    super(messageModel);
  }
}

export const messageManager = new MessageManager();
