class StateManager {
  constructor() {
    this.state = {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
      userId: localStorage.getItem('userId'),
    };
    this.stateChangeListeners = [];
  }

  getToken() {
    return this.state.token;
  }

  getUserEmail() {
    return this.state.email;
  }

  getUserId() {
    return this.state.userId;
  }

  setToken(token) {
    this.state.token = token;
    localStorage.setItem('token', token);
    this.notifyStateChange();
  }

  setEmail(email) {
    this.state.email = email;
    localStorage.setItem('email', email);
    this.notifyStateChange();
  }

  setUserId(userId) {
    this.state.userId = userId;
    localStorage.setItem('userId', userId);
    this.notifyStateChange();
  }

  unsetState() {
    this.state.token = null;
    this.state.email = null;
    this.state.userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.notifyStateChange();
  }

  addStateChangeListener(listener) {
    this.stateChangeListeners.push(listener);
  }

  notifyStateChange() {
    this.stateChangeListeners.forEach(listener => listener());
  }
}

export const stateManager = new StateManager();