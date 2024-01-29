import supertest from "supertest";
import { expect } from "chai";

const request = supertest.agent("http://localhost:8080");

// sessions
describe("users endpoints", () => {
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

  // GET /api/users
  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request.get("/api/users");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Users found");
      expect(response.body.users).to.exist;
    });
  });

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

  // GET /api/users/:id
  describe("GET /api/users/:id", () => {
    it("should return a specific user by ID", async () => {
      const response = await request.get("/api/users/65a70ee52b921fac7e3d66ae");
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("user found");
      expect(response.body.user).to.exist;
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
});
