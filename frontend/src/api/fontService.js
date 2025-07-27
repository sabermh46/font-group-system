const BASE_URL = 'http://localhost:4000/api';

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }
  return response.json();
};

export const fontService = {
  uploadFont: async (formData) => {
    return fetchData(`${BASE_URL}/fonts/upload`, {
      method: 'POST',
      body: formData,
    });
  },
  getFonts: async () => {
    return fetchData(`${BASE_URL}/fonts`);
  },
  deleteFont: async (id) => {
    return fetchData(`${BASE_URL}/fonts/${id}`, {
      method: 'DELETE',
    });
  },
};

export const groupService = {
  getGroups: async () => {
    return fetchData(`${BASE_URL}/groups`);
  },
  deleteGroup: async (id) => {
    return fetchData(`${BASE_URL}/groups/${id}`, {
      method: 'DELETE',
    });
  },
  createGroup: async (data) => {
    return fetchData(`${BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  updateGroup: async (id, data) => {
    return fetchData(`${BASE_URL}/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
};