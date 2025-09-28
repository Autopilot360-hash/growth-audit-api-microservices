import Fastify from 'fastify';
import { setupRoutes } from './routes.js';

const fastify = Fastify({ logger: true });

// Setup routes
setupRoutes(fastify);

// Health check global
fastify.get('/health', async () => {
  const services = {
    client: process.env.CLIENT_SERVICE_URL,
    audit: process.env.AUDIT_SERVICE_URL,
    analytics: process.env.ANALYTICS_SERVICE_URL
  };
  
  const results = {};
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/health`, { timeout: 5000 });
      results[name] = response.ok ? 'healthy' : 'unhealthy';
    } catch {
      results[name] = 'unreachable';
    }
  }
  
  return {
    gateway: 'healthy',
    services: results,
    timestamp: new Date().toISOString()
  };
});

// Documentation endpoint
fastify.get('/api/v1', async () => ({
  service: 'Growth Audit API v1',
  module: 'Complete Core Business Logic',
  endpoints: {
    analytics: {
      health_check: 'POST /api/v1/analytics/health-check',
      description: 'Audit GA4, Mixpanel, Amplitude configuration'
    },
    funnel: {
      analyze: 'POST /api/v1/funnel/analyze',
      realtime: 'GET /api/v1/funnel/{id}/realtime',
      description: 'Real-time funnel analysis with friction point detection'
    },
    cohort: {
      analyze: 'POST /api/v1/cohort/analyze',
      description: 'LTV/CAC calculation with retention analysis'
    },
    competitive: {
      analyze: 'POST /api/v1/competitive/analyze',
      description: 'Competitive intelligence with pricing and feature analysis'
    },
    seo: {
      audit: 'POST /api/v1/seo/audit',
      recommendations: 'GET /api/v1/seo/recommendations/{clientId}',
      description: 'Technical SEO audit with prioritized recommendations'
    }
  },
  status: 'Module 1 Complete'
}));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Growth Audit API Gateway - Module 1 Complete');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
