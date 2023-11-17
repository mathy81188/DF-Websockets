/*import dotenv from "dotenv";

dotenv.config();

export default {
  mongouri: process.env.MONGO_URI,
};



import mongoose from "mongoose";


export default {
  mongouri: process.env.MONGO_URI,
};
//"mongodb+srv://matiasbritez88:matias1188@codercluster0.j6xuhmy.mongodb.net/ecommerce?retryWrites=true&w=majority";
*/
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const URI = process.env.MONGO_URI;
// "mongodb+srv://matiasbritez88:matias1188@codercluster0.j6xuhmy.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("conectado a bd"))
  .catch((error) => console.log(error));

export default { mongouri: URI };
