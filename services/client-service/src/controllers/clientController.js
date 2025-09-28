import { ClientService } from '../services/clientService.js';

export class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  async create(request, reply) {
    try {
      const client = await this.clientService.createClient(request.body);
      reply.code(201).send(client);
    } catch (error) {
      reply.code(400).send({ error: error.message });
    }
  }

  async list(request, reply) {
    try {
      const clients = await this.clientService.getAllClients();
      reply.send({
        clients,
        total: clients.length,
        service: 'client-service'
      });
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getById(request, reply) {
    try {
      const client = await this.clientService.getClientById(request.params.id);
      reply.send(client);
    } catch (error) {
      reply.code(404).send({ error: error.message });
    }
  }
}
