export class Audit {
  constructor(data) {
    this.id = data.id;
    this.clientId = data.client_id;
    this.status = data.status || 'PENDING';
    this.type = data.type || 'FULL';
    this.priority = data.priority || 'NORMAL';
    this.score = data.score;
    this.results = data.results;
    this.summary = data.summary;
    this.recommendations = data.recommendations;
    this.startedAt = data.started_at;
    this.completedAt = data.completed_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static validateStatus(status) {
    const validStatuses = ['PENDING', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'];
    return validStatuses.includes(status);
  }

  static validateType(type) {
    const validTypes = ['FULL', 'SEO', 'PERFORMANCE', 'ANALYTICS', 'CONVERSION', 'QUICK'];
    return validTypes.includes(type);
  }
}
