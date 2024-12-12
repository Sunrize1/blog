import { BaseComponent } from './BaseComponent.js';
import { logoutUser } from '../utils/API.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class HeaderComponent extends BaseComponent {
  constructor() {
    super();
    this.route = null;
    this.render();
    stateManager.addStateChangeListener(this.render.bind(this));
    router.addUrlChangeListener(this.render.bind(this));
  }

  render() {
    this.route = window.location.pathname.split('/');
    this.element.innerHTML = ``;
    this.element.innerHTML = `
    <header class="header">
      <nav class="nav">
      <h3>Блог №415</h2>
        <div class="center-links">
          <a href="#" data-route="/main" class="nav-link">Главная</a>
          ${this.route[1] === 'main' || this.route[1] === 'community' || this.route[1] === 'communities' || this.route[1] === 'post'  ? `<a href="#" data-route="/authors" class="nav-link">Авторы</a>
          <a href="#" data-route="/communities" class="nav-link">Группы</a>`: ''}
          ${this.route[1] === 'authors' ? `<a href="#" data-route="/authors" class="nav-link">Авторы</a>`: ''}
        </div>
      </nav>
      <div class="right-corner">
          ${stateManager.getToken() ? `
            <div class="dropdown">
              <span class="user-email">${stateManager.getUserEmail()}</span>
              <span class="arrow">&#9660;</span>
              <div class="dropdown-content">
                <a href="#" data-route="/profile" class="nav-link">Профиль</a>
                <a href="#" data-route="/logout" id="logout" class="nav-link">Выйти</a>
              </div>
            </div>
          ` : '<a href="#" data-route="/login" class="nav-link">Войти</a>'}
        </div>
    </header>
    `;
    this.setupNavigation();
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
      this.render();
      router.redirect('/login');
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }
}