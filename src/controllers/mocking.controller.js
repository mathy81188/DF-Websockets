import { generateMockingproducts } from "../utils/faker.js";

async function mockingProducts(req, res) {
  const products = [];
  for (let index = 0; index < 100; index++) {
    const product = generateMockingproducts();
    products.push(product);
  }
  res.json(products);
}

export { mockingProducts };
