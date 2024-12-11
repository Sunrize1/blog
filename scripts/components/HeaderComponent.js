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
      <h3>Блог №415</h2>
        <div class="center-links">
          <a href="#" data-route="/main" class="nav-link">Главная</a>
          <a href="#" data-route="/authors" class="nav-link">Авторы</a>
          <a href="#" data-route="/communities" class="nav-link">Группы</a>
        </div>
      </nav>
      <div class="right-corner">
          ${stateManager.state.token ? `
            <div class="dropdown">
              <span class="user-email">${stateManager.state.email}</span>
              <div class="dropdown-content">
                <a href="#" data-route="/profile" class="nav-link">Профиль</a>
                <a href="#" data-route="/logout" id="logout" class="nav-link">Выйти</a>
              </div>
            </div>
          ` : '<a href="#" data-route="/login" class="nav-link">Войти</a>'}
          ${!stateManager.state.token ? `<a href="#" data-route="/register" class="nav-link">Зарегистрироваться</a>` : ''}
        </div>
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