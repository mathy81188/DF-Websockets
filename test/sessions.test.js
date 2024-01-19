import { usersManager } from "../src/Dao/MongoDB/users.js";
import { expect } from "chai";

describe("get users", function () {
  it("should return an array", async function () {
    const result = await usersManager.getAllUsers();
    expect(result).to.be.an("array");
  });
});

describe("create user", function () {
  it("should create a new user", async function () {
    const user = {
      first_name: "Peter",
      last_name: "Parker",
      email: "peterparker@gmail.com",
      password: "123",
    };
    const result = await usersManager.createOne(user);
    console.log("user", result);
    expect(result).to.be.property("_id");
    // Validaciones específicas

    expect(result.first_name).to.equal(user.first_name);
    expect(result.last_name).to.equal(user.last_name);
    expect(result.email).to.equal(user.email);

    // Limpieza: eliminar el usuario creado después de la prueba
    await usersManager.deleteUser(result._id);
  });
});

describe("delete user", function () {
  it("should delete an existing user", async function () {
    // Crear un usuario para la prueba
    const user = await usersManager.createOne({
      first_name: "Test",
      last_name: "User",
      email: "testuser@example.com",
      password: "password123",
    });

    // Elimina usuario prueba
    await usersManager.deleteOne(user._id);

    // Intentar obtener el usuario eliminado
    const deletedUser = await usersManager.findById(user._id);

    // Verificar que el usuario haya sido eliminado
    expect(deletedUser).to.be.null;
  });
});
