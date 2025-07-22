const BASE_URL = 'http://localhost:4000/api';

export async function uploadFont(formData) {
  const res = await fetch(`${BASE_URL}/fonts/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function getFonts() {
  const res = await fetch(`${BASE_URL}/fonts`);
  return res.json();
}

export async function deleteFont(id) {
  const res = await fetch(`${BASE_URL}/api/fonts/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}


export async function getGroups() {
  const res = await fetch(`${BASE_URL}/groups`);
  return res.json();
}

export async function deleteGroup(id) {
  const res = await fetch(`${BASE_URL}/groups/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function createGroup(data) {
  const res = await fetch(`${BASE_URL}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
