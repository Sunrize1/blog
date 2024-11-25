import { BaseComponent } from './BaseComponent.js';
import { toggleTheme } from '../utils/Utils.js';

export class FooterComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
    this.setupThemeToggle();
  }

  render() {
    this.element.innerHTML = `
      <footer>
      <button id="theme-toggle" class="theme-toggle">Toggle Theme</button>
        <p>&copy; 2023 My Web App</p>
      </footer>
    `;
  }

  setupThemeToggle() {
    const themeToggle = this.element.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }
}