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
import { TechnicalSEOAnalyzer } from './seo/technical.js';

// Technical SEO Audit endpoint
fastify.post('/seo/audit', async (request) => {
  const { url, client_id } = request.body;
  
  if (!url) {
    return { error: 'URL is required' };
  }

  const seoAnalyzer = new TechnicalSEOAnalyzer();
  const audit = await seoAnalyzer.auditSite(url);
  
  // Sauvegarder l'audit SEO
  try {
    await pool.query(
      'INSERT INTO seo_audits (client_id, url, audit_data, technical_score, audited_at) VALUES ($1, $2, $3, $4, NOW())',
      [client_id, url, JSON.stringify(audit), audit.technical_score]
    );
  } catch (error) {
    console.error('Failed to save SEO audit:', error);
  }
  
  return {
    audit_id: `seo_${Date.now()}`,
    url: audit.url,
    technical_score: audit.technical_score,
    categories: audit.categories,
    priority_recommendations: audit.priority_recommendations,
    action_plan: audit.action_plan,
    summary: {
      total_checks: Object.keys(audit.categories).length,
      passing_categories: Object.values(audit.categories).filter(cat => cat.score >= 70).length,
      critical_issues: audit.priority_recommendations.filter(rec => rec.priority === 'HIGH').length
    }
  };
});

// Endpoint pour obtenir toutes les recommandations SEO
fastify.get('/seo/recommendations/:clientId', async (request) => {
  const { clientId } = request.params;
  
  try {
    const result = await pool.query(
      'SELECT audit_data FROM seo_audits WHERE client_id = $1 ORDER BY audited_at DESC LIMIT 1',
      [clientId]
    );
    
    if (result.rows.length === 0) {
      return { error: 'No SEO audit found for this client' };
    }
    
    const auditData = result.rows[0].audit_data;
    
    return {
      client_id: clientId,
      recommendations: auditData.priority_recommendations,
      action_plan: auditData.action_plan,
      last_audit: auditData.audited_at
    };
  } catch (error) {
    return { error: 'Failed to retrieve SEO recommendations' };
  }
});
