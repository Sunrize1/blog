import { stateManager } from "./StateManager.js";
//Address enpoints
export async function fetchAddressSearch(parent, query) {
  const response = await fetch(`/api/address/search?parentObjectId=${parent}&query=${query}`);
  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

export async function fetchAddressChain(objectGuid) {
  const response = await fetch(`/api/address/chain?objectGuid=${objectGuid}`);
  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

// Tags endpoint
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
  stateManager.setToken(responseData.token);
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
  stateManager.setUserId(responseData.id);
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

export async function likePost(postId) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }

  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(responseData.title);
  }
}

export async function unlikePost(postId) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }

  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/like`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(responseData.title);
  }
}

export async function fetchPostById(postId) {
  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) {
    throw new Error(response.title);
  }
  return await response.json();
}

export async function addPost(data) {
  const response = await fetch('https://blog.kreosoft.space/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
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


//Comment endpoints
export async function addComment(postId, commentData) {
  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(commentData)
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(response.title);
  }
  return response;
}

export async function fetchCommentTree(commentId) {
  const response = await fetch(`https://blog.kreosoft.space/api/comment/${commentId}/tree`);
  if (!response.ok) {
    throw new Error(response.title);
  }
  return await response.json();
}

export async function deleteComment(commentId) {
  const response = await fetch(`https://blog.kreosoft.space/api/comment/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(response.title);
  }
}

export async function updateComment(commentId, commentData) {
  const response = await fetch(`https://blog.kreosoft.space/api/comment/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(commentData)
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(response.title);
  }
}