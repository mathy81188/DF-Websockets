export default class Manager {
  constructor(model) {
    this.model = model;
  }
  async find() {
    return this.model.find().lean();
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(obj) {
    return this.model.create(obj);
  }

  async updateOne(id, obj) {
    return this.model.updateOne({ _id: id }, obj);
  }

  async deleteOne(id) {
    return this.model.deleteOne({ _id: id });
  }
}
