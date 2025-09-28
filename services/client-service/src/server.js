import Fastify from 'fastify';
import { ClientController } from './controllers/clientController.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({
  service: 'client-service',
  status: 'healthy',
  timestamp: new Date().toISOString()
}));

const clientController = new ClientController();

fastify.post('/clients', clientController.create.bind(clientController));
fastify.get('/clients', clientController.list.bind(clientController));
fastify.get('/clients/:id', clientController.getById.bind(clientController));

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Client Service started on port 3001');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
