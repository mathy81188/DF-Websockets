export default class UserDTO {
  constructor(obj) {
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.email = obj.email;
    this.password = obj.password;
    this.age = obj.age;
    this.google = obj.google;
    this.role = obj.role;
    this.cart = obj.cart;
  }
}
