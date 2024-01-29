import supertest from "supertest";
import { expect } from "chai";

const request = supertest.agent("http://localhost:8080");

//carts
describe("carts endpoints", () => {
  describe("GET /api/carts/:cid", () => {
    it("should return the cart by id", async () => {
      const response = await request.get("/api/carts/655e9a854823ec5b75955804");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Cart found");
      expect(response.body.cart).to.exist;
    });
  });

  describe("PUT /api/carts/:cid/product/:pid", () => {
    it("should add a product to cart", async () => {
      const response = await request.put(
        "/api/carts/65a9e283fdf68c475d060f97/product/6528a201679529d9639de6e0"
      );
      console.log("put test", response.body);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body.message).to.equal("Product edited");
      expect(response.body.cart).to.exist;
    });
  });

  describe("GET /api/carts", () => {
    it("should return all carts", async () => {
      const response = await request.get("/api/carts");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Carts found");
      expect(response.body.carts).to.exist;
    });
  });

  describe("POST /api/carts", () => {
    it("should create a new cart", async () => {
      const response = await request.post("/api/carts");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Carrito creado con exito");
      expect(response.body.newCart).to.exist;
    });
  });

  describe("DELETE /api/carts/:cid", () => {
    it("should delete a cart", async () => {
      const response = await request.delete(
        "/api/carts/65ac163788e47e8d07aeb2bb"
      );
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Cart deleted");
    });
  });

  describe("DELETE /api/carts/:cid/product/:pid", () => {
    it("should delete a product from the cart", async () => {
      const response = await request.delete(
        "/api/carts/65a9e283fdf68c475d060f97/product/65920390a4ce2ed454f489bc"
      );
      console.log("delete test", response.body);
      //tiene 9 unidades
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body.message).to.equal("Product deleted from Cart");
      expect(response.body.cart).to.exist;
    });
  });
});
