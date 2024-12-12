import { BaseComponent } from './BaseComponent.js';
import { loginUser } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class LoginComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.element.className = 'login-container';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <form class="login-form">
          <h2>Вход</h2>
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Пароль" required />
          <button type="submit">Войти</button>
          <button class="registration-button">Зарегестрироваться</button>
        </form>
    `;
    this.setupForm();
    this.setupRegistrationButton();
  }

  setupForm() {
    const form = this.element.querySelector('.login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        email: this.element.querySelector('#email').value,
        password: this.element.querySelector('#password').value,
      };
      this.login(data);
    });
  }

  setupRegistrationButton() {
    const button = this.element.querySelector('.registration-button');
    button.addEventListener('click', () => {
      router.navigate('/register')
    })
  }

  async login(data) {
    try {
      const responseData = await loginUser(data);
      stateManager.setToken(responseData.token);
      stateManager.setEmail(data.email);
      router.navigate('/profile');
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }
}