import supertest from "supertest";
import { expect } from "chai";

const request = supertest.agent("http://localhost:8080");

//products
describe("products endpoints", () => {
  // GET /api/products
  describe("GET /api/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/api/products");
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.exist;
    });
  });

  // GET /api/products/:pid
  describe("GET /api/products/:pid", () => {
    it("should return a specific product by ID", async () => {
      const response = await request.get(
        "/api/products/6590c2966ca6380348149d09"
      );
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product found");
      expect(response.body.product).to.exist;
    });
  });

  // POST /api/products

  describe("POST /api/products", () => {
    it("should create a product", async () => {
      const newProduct = {
        title: "New Product",
        description: "Description of the new product",
        price: 9900,
        stock: 50,
      };

      const response = await request.post("/api/products").send(newProduct);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product created");
      expect(response.body.prod).to.exist;
    });
  });

  // DELETE /api/products/:pid
  describe("DELETE /api/products/:pid", () => {
    it("should delete a product", async () => {
      const response = await request.delete(
        "/api/products/6590c3009b57b69fc0be9859"
      );

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product deleted");
    });
  });

  // PUT /api/products/:pid
  describe("PUT /api/products/:pid", () => {
    it("should update a product", async () => {
      const updatedProduct = {
        title: "Updated Product",
        description: "Updated description",
        price: 129.99,
        stock: 3666663,
      };

      const response = await request
        .put("/api/products/6590cda2945aac8960689d3a")
        .send(updatedProduct);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product updated");
    });
  });
});
