export default class Manager {
  constructor(model, populating) {
    this.model = model;
    this.populating = populating;
  }
  async find() {
    return this.model.find().populate(this.populating).lean();
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
