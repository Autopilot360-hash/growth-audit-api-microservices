import pg from 'pg';

export class ClientRepository {
  constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async create(clientData) {
    const query = `
      INSERT INTO clients (name, domain, industry, description) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    
    try {
      const result = await this.pool.query(query, [
        clientData.name,
        clientData.domain,
        clientData.industry,
        clientData.description
      ]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Domain already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const query = 'SELECT * FROM clients ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByDomain(domain) {
    const query = 'SELECT * FROM clients WHERE domain = $1';
    const result = await this.pool.query(query, [domain]);
    return result.rows[0] || null;
  }
}
