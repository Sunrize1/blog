import { stateManager } from "./StateManager.js";
//Address enpoints
export async function fetchAddressSearch(query, parent) {
  const queryParams = new URLSearchParams();
  if(parent) {
    queryParams.append('parentObjectId', parent);
  }
  if(query) {
    queryParams.append('query', query);
  }

  const response = await fetch(`https://blog.kreosoft.space/api/address/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error(response.message);
  }

  const responseData = await response.json();

  return responseData;
}

export async function fetchAddressChain(objectGuid) {
  const response = await fetch(`https://blog.kreosoft.space/api/address/chain?objectGuid=${objectGuid}`);
  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

//Authors endpoints
export async function fetchAuthors() {
  const response = await fetch('https://blog.kreosoft.space/api/author/list');
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
  const response = await fetch('https://blog.kreosoft.space/api/account/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}

export async function fetchProfile() {

  const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован")
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
    throw new Error("Неавторизован");
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.title);
  }
  return responseData;
}

export async function likePost(postId) {
  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(responseData.title);
  }
}

export async function unlikePost(postId) {
  
  const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/like`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
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
    throw new Error("Неавторизован");
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
    throw new Error("Неавторизован");
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
    throw new Error("Неавторизован");
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
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(response.title);
  }
}

//Communities endpoints
export async function fetchCommunities() {
  const response = await fetch('https://blog.kreosoft.space/api/community');
  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

export async function fetchMyCommunities() {
  const response = await fetch('https://blog.kreosoft.space/api/community/my', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

export async function subscribeToCommunity(communityId) {
  const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/subscribe`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(response.message);
  }
}

export async function unsubscribeFromCommunity(communityId) {
  const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/unsubscribe`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(response.message);
  }
}

export async function fetchCommunityById(communityId) {
  const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}`);
  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

export async function fetchCommunityPosts(communityId, filters) {
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

  const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/post?${queryParams.toString()}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.title);
  }
  return responseData;
}

export async function fetchCommunityRole(communityId) {
  const response = await fetch(`https://blog.kreosoft.space/api/community/${communityId}/role`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  }
  );

  if (response.status === 401) {
    stateManager.unsetState();
    throw new Error("Неавторизован");
  }

  if (!response.ok) {
    throw new Error(response.message);
  }
  return await response.json();
}

