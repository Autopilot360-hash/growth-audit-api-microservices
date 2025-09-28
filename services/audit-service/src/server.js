import Fastify from 'fastify';
import pkg from 'pg';
const { Pool } = pkg;

const fastify = Fastify({ logger: true });

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:supersecret@localhost:5433/growth_audit'
});

// Health check
fastify.get('/health', async () => {
  return {
    service: 'audit-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
});

// Lister les audits
fastify.get('/audits', async () => {
  try {
    const result = await pool.query('SELECT * FROM audits ORDER BY created_at DESC');
    return {
      audits: result.rows,
      total: result.rows.length,
      service: 'audit-service'
    };
  } catch (error) {
    return { error: 'Database connection failed', details: error.message };
  }
});

// Créer un audit
fastify.post('/audits', async (request) => {
  const { client_id, url, audit_type = 'growth' } = request.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO audits (client_id, url, audit_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [client_id, url, audit_type, 'pending']
    );
    
    return {
      audit: result.rows[0],
      service: 'audit-service'
    };
  } catch (error) {
    return { error: 'Failed to create audit', details: error.message };
  }
});

// Démarrer le serveur
const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log('🔍 Audit Service running on port 3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();