export default class NotFound {
  static createErr(entity) {
    throw new Error(`${entity} not found`);
  }
}
