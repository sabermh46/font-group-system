export class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const res = await fetch(`${this.baseURL}${endpoint}`);
    return res.json();
  }

  async post(endpoint, body) {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
    return res.json();
  }

  async put(endpoint, body) {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async delete(endpoint) {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
    });
    return res.json();
  }
}