export class FontService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async uploadFont(formData) {
    return this.apiClient.post('/fonts/upload', formData);
  }

  async getFonts() {
    return this.apiClient.get('/fonts');
  }

  async deleteFont(id) {
    return this.apiClient.delete(`/fonts/${id}`);
  }
}