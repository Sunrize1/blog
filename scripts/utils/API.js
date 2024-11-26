import { stateManager } from "./StateManager.js";

export async function fetchTags() {
  const response = await fetch('https://blog.kreosoft.space/api/tag');
  if (!response.ok) {
    throw new Error(response.message);
  }
  const tags = await response.json();
  return tags;
}

//User endpoints
export async function registerUser(data) {
  const response = await fetch('https://blog.kreosoft.space/api/account/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}

export async function loginUser(data) {
  const response = await fetch('https://blog.kreosoft.space/api/account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  localStorage.setItem('token', responseData.token);
  return responseData;
}

export async function logoutUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }
  const response = await fetch('https://blog.kreosoft.space/api/account/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}

export async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }
  const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized")
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}

//Post endpoints
export async function fetchPosts(filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        queryParams.append(`${key}[${index}]`, item);
      });
    } else {
      queryParams.append(key, value);
    }
  }

  const response = await fetch(`https://blog.kreosoft.space/api/post?${queryParams.toString()}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.title);
  }
  return responseData;
}