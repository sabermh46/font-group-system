export class GroupService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getGroups() {
    return this.apiClient.get('/groups');
  }

  async deleteGroup(id) {
    return this.apiClient.delete(`/groups/${id}`);
  }

  async createGroup(data) {
    return this.apiClient.post('/groups', data);
  }

  async updateGroup(id, data) {
    return this.apiClient.put(`/groups/${id}`, data);
  }
}