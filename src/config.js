import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const URI = process.env.MONGO_URI;

const PASSPORT_CLIENTID = process.env.PASSPORT_CLIENTID;
const PASSPORT_CLIENTSECRET = process.env.PASSPORT_CLIENTSECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET

mongoose
  .connect(URI)
  .then(() => console.log("conectado a bd"))
  .catch((error) => console.log(error));

export default {
  mongouri: URI,
  clienteId: PASSPORT_CLIENTID,
  clientSecret: PASSPORT_CLIENTSECRET,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  sessionSecret: SESSION_SECRET}
