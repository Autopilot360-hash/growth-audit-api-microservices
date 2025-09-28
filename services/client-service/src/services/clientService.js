import { ClientRepository } from '../repositories/clientRepository.js';

export class ClientService {
  constructor() {
    this.clientRepo = new ClientRepository();
  }

  async createClient(clientData) {
    if (!clientData.name || !clientData.domain) {
      throw new Error('Name and domain are required');
    }

    const existing = await this.clientRepo.findByDomain(clientData.domain);
    if (existing) {
      throw new Error('Domain already exists');
    }

    return await this.clientRepo.create(clientData);
  }

  async getAllClients() {
    return await this.clientRepo.findAll();
  }

  async getClientById(id) {
    if (!id) {
      throw new Error('Client ID is required');
    }

    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  }
}
