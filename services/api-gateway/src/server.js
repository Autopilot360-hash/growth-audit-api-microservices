import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

const services = {
  client: 'http://client-service:3001'
};

fastify.get('/health', async () => {
  const serviceHealth = {};
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/health`);
      serviceHealth[name] = response.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      serviceHealth[name] = 'unreachable';
    }
  }

  return {
    gateway: 'healthy',
    services: serviceHealth,
    timestamp: new Date().toISOString()
  };
});

fastify.get('/', async () => ({
  message: 'Growth Audit API v2.0 - Microservices Architecture',
  status: 'running',
  architecture: 'microservices',
  services: Object.keys(services),
  version: '2.0.0'
}));

await fastify.register(import('@fastify/http-proxy'), {
  upstream: services.client,
  prefix: '/api/v2/clients',
  rewritePrefix: '/clients'
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('API Gateway started on port 3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
