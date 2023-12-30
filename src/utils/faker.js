import { faker } from "@faker-js/faker";
export const generateMockingproducts = () => {
  const product = {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.number.int({ max: 100 }),
  };

  return product;
};
