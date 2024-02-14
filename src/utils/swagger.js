import { __dirname } from "./utils.js";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API del Ecommerce",
      description: "Series Y Peliculas",
    },
  },
  apis: [`${__dirname}/../docs/*.yaml`],
};

export const specs = swaggerJSDoc(swaggerOptions);
