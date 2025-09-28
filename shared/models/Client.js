export class Client {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.domain = data.domain;
    this.industry = data.industry;
    this.description = data.description;
    this.isActive = data.is_active !== false;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static validate(data) {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!data.domain || !this.isValidUrl(data.domain)) {
      throw new Error('Valid domain URL is required');
    }
    return true;
  }

  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}
