import supertest from "supertest";
import { expect } from "chai";

const request = supertest.agent("http://localhost:8080");

// sessions
describe("users endpoints", () => {
  // GET /api/users
  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request.get("/api/users");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Users found");
      expect(response.body.users).to.exist;
    });
  });

  // POST /api/users/login
  describe("POST /api/users/login", () => {
    it("should log in a user", async () => {
      const userCredentials = {
        email: "matias@gmail.com",
        password: "123",
      };

      const response = await request
        .post("/api/users/login")
        .send(userCredentials);
      expect(response.status).to.equal(200);
      console.log("Response body:", response.body);

      expect(response.body.message).to.be.equal(
        `welcome ${userCredentials.email}`
      );
      expect(response.body.token).to.exist;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  });
  /*funciona perfecto
  // POST /api/users/signup
  describe("POST /api/users/signup", () => {
    it("should sign up a new user", async () => {
      const newUser = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "123",
      };

      const response = await request.post("/api/users/signup").send(newUser);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("User created");
      expect(response.body.createdUser).to.exist;
    });
  });

  // POST /api/users/logout
  describe("GET /api/users/logout", () => {
    it("should log out a user", async () => {
      const response = await request.get("/api/users/logout");
      console.log("Response body:", response.body);
      expect(response.status).to.equal(302);
    });
    
  });

  // GET /api/users/:id
  describe("GET /api/users/:id", () => {
    it("should return a specific user by ID", async () => {
      const response = await request.get("/api/users/65a70ee52b921fac7e3d66ae");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("user found");
      expect(response.body.user).to.exist;
    });
  });*/
});

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
      console.log("Response body:", response.body);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product created");
      expect(response.body.prod).to.exist;
    });
  });
  /*
  // DELETE /api/products/:pid
  describe("DELETE /api/products/:pid", () => {
    it("should delete a product", async () => {
      const response = await request.delete(
        "/api/products/65a9e8a2e7436e7777c4da37"
      );
      console.log("Response body:", response.body);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product deleted");
    });
  });
*/
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
        .put("/api/products/65a9e8a2e7436e7777c4da37")
        .send(updatedProduct);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product updated");
    });
  });
});

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
    it("should add a product to the user's cart", async () => {
      const response = await request.put(
        "/api/carts/655e9a854823ec5b75955804/product/6590c2966ca6380348149d09"
      );
      expect(response.status).to.equal(200);
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
      const response = await request
        .post("/api/carts")
        .send({ user: "exampleUser" });
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Cart created successfully");
      expect(response.body.newCart).to.exist;
    });
  });

  describe("DELETE /api/carts/:cid", () => {
    it("should delete a cart", async () => {
      const response = await request.delete("/api/carts/123");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Cart deleted");
    });
  });

  describe("DELETE /api/carts/:cid/product/:pid", () => {
    it("should delete a product from the cart", async () => {
      const response = await request.delete(
        "/api/carts/655e9a854823ec5b75955804/product/6590c2966ca6380348149d09"
      );
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Product deleted from Cart");
      expect(response.body.cart).to.exist;
    });
  });
});
