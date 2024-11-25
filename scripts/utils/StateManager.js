class StateManager {
  constructor() {
    this.state = {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
    };
    this.stateChangeListeners = [];
  }

  getToken() {
    return this.state.token;
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

  unsetState() {
    this.state.token = null;
    this.state.email = null;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.notifyStateChange();
  }

  addStateChangeListener(listener) {
    this.stateChangeListeners.push(listener);
  }

  notifyStateChange() {
    this.stateChangeListeners.forEach(listener => listener(this.state));
  }
}

export const stateManager = new StateManager();