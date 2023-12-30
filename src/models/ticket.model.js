import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  purchase_datetime: {
    type: String,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
});

export const ticketsModel = mongoose.model("Tickets", ticketSchema);
