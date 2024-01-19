import { productManager } from "../src/Dao/MongoDB/product";
import { expect } from "chai";

describe("ProductManager", function () {
  describe("getAll", function () {
    it("should return an array of products", async function () {
      const result = await productManager.getAll();
      expect(result).to.be.an("array");
      
    });
  });

  describe("findById", function () {
    it("should return a single product by id", async function () {
      const result = await productManager.findById("someId");
      expect(result).to.be.an("object");
    
    });
  });

  describe("deleteOne", function () {
    it("should return a result indicating success", async function () {
      const result = await productManager.deleteOne("someId");
      expect(result).to.be.an("object");
   
    });
  });

  describe("create", function () {
    it("should return a newly created product", async function () {
      const productData = {
        
          title: "Blond ambition",
          description: "Description of the new product",
          price: 9900,
          stock: 50,
        
      };
      const result = await productManager.create(productData);
      expect(result).to.be.an("object");
      
    });
  });

  describe("updateOne", function () {
    it("should return a result indicating success", async function () {
      const productId = "someId";
      const updateData = {
        price: 300,
      };
      const result = await productManager.updateOne(productId, updateData);
      expect(result).to.be.an("object");
      
    });
  });
});
