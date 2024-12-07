// front/scripts/components/HeaderComponent.js

import { BaseComponent } from './BaseComponent.js';
import { toggleTheme } from '../utils/Utils.js';
import { logoutUser } from '../utils/API.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class HeaderComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
    this.setupNavigation();
    this.updateHeader();
    stateManager.addStateChangeListener(this.handleStateChange.bind(this));
  }

  render() {
    this.element.innerHTML = `
    <header class="header">
      <nav class="nav">
        <div class="center-links">
          <a href="#" data-route="/main" class="nav-link">Main</a>
          <a href="#" data-route="/authors" class="nav-link">Authors</a>
        </div>
        <div class="right-corner">
          ${stateManager.state.token ? `
            <div class="dropdown">
              <span class="user-email">${stateManager.state.email}</span>
              <div class="dropdown-content">
                <a href="#" data-route="/profile" class="nav-link">Profile</a>
                <a href="#" data-route="/logout" id="logout" class="nav-link">Logout</a>
              </div>
            </div>
          ` : '<a href="#" data-route="/login" class="nav-link">Login</a>'}
          ${!stateManager.state.token ? `<a href="#" data-route="/register" class="nav-link">Register</a>` : ''}
        </div>
      </nav>
    </header>
    `;
  }

  setupNavigation() {
    const navLinks = this.element.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route === '/logout') {
          this.handleLogout();
        } else {
          router.navigate(route);
        }
      });
    });
  }

  async handleLogout() {
    try {
      await logoutUser();
      stateManager.unsetState();
      this.updateHeader();
      router.redirect('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  }

  updateHeader() {
    this.render();
    this.setupNavigation();
  }

  handleStateChange(newState) {
    this.updateHeader();
  }
}