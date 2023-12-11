import { ticketsModel } from "../models/ticket.model.js";
import Manager from "./manager.js";
class TicketManager extends Manager {
  constructor() {
    super(ticketsModel);
  }
}

export const messageManager = new TicketManager();
