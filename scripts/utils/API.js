import { stateManager } from "./StateManager.js";
//User endpoints
export async function registerUser(data) {
  const response = await fetch('https://blog.kreosoft.space/api/account/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  const responseData = await response.json();
  return responseData;
}

export async function loginUser(data) {
  const response = await fetch('https://blog.kreosoft.space/api/account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  const responseData = await response.json();
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
  if (!response.ok) {
    if (response.status === 401) {
      stateManager.unsetState();
    }
    throw new Error(responseData.message);
  }
  const responseData = await response.json();
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
  if (!response.ok) {
    if (response.status === 401) {
      stateManager.unsetState();
    }
    throw new Error(responseData.message);
  }
  const responseData = await response.json();
  return responseData;
}