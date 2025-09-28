export const setupRoutes = (fastify) => {
  // Route vers le service analytics
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', async (request, reply) => {
      request.serviceUrl = process.env.ANALYTICS_SERVICE_URL;
    });

    // Analytics Health Check
    fastify.post('/api/v1/analytics/health-check', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/analytics/health-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body)
      });
      return response.json();
    });

    // Funnel Analysis
    fastify.post('/api/v1/funnel/analyze', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/funnel/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body)
      });
      return response.json();
    });

    // Realtime Funnel Data
    fastify.get('/api/v1/funnel/:funnelId/realtime', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/funnel/${request.params.funnelId}/realtime`);
      return response.json();
    });

    // Cohort Analysis
    fastify.post('/api/v1/cohort/analyze', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/cohort/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body)
      });
      return response.json();
    });

    // Competitive Analysis
    fastify.post('/api/v1/competitive/analyze', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/competitive/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body)
      });
      return response.json();
    });
  });

  // Route vers le service audit pour SEO
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', async (request, reply) => {
      request.serviceUrl = process.env.AUDIT_SERVICE_URL;
    });

    // Technical SEO Audit
    fastify.post('/api/v1/seo/audit', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/seo/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body)
      });
      return response.json();
    });

    // SEO Recommendations
    fastify.get('/api/v1/seo/recommendations/:clientId', async (request, reply) => {
      const response = await fetch(`${request.serviceUrl}/seo/recommendations/${request.params.clientId}`);
      return response.json();
    });
  });
};
