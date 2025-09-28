import Fastify from 'fastify';
import pkg from 'pg';
const { Pool } = pkg;

const fastify = Fastify({ logger: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:supersecret@localhost:5433/growth_audit'
});

fastify.get('/health', async () => {
  return {
    service: 'analytics-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
});

// Dashboard des métriques
fastify.get('/dashboard', async () => {
  try {
    const clients = await pool.query('SELECT COUNT(*) as total FROM clients');
    const audits = await pool.query('SELECT COUNT(*) as total FROM audits');
    const activeClients = await pool.query('SELECT COUNT(*) as total FROM clients WHERE is_active = true');
    
    return {
      metrics: {
        total_clients: parseInt(clients.rows[0].total),
        total_audits: parseInt(audits.rows[0].total),
        active_clients: parseInt(activeClients.rows[0].total)
      },
      service: 'analytics-service',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { error: 'Analytics calculation failed', details: error.message };
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3003, host: '0.0.0.0' });
    console.log('📊 Analytics Service running on port 3003');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();