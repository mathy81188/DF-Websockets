import mongoose from "mongoose";
const URI =
  "mongodb+srv://matiasbritez88:matias1188@codercluster0.j6xuhmy.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("conectado a bd"))
  .catch((error) => console.log(error));
