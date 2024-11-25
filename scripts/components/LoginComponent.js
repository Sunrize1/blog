import { BaseComponent } from './BaseComponent.js';
import { loginUser } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class LoginComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
    this.setupForm();
  }

  render() {
    this.element.innerHTML = `
      <div class="login-container">
        <form class="login-form">
          <h2>Login</h2>
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    `;
  }

  setupForm() {
    const form = this.element.querySelector('.login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      try {
        const responseData = await loginUser(data);
        new PopupComponent({message : "Login Successful"}).mount(document.body);
        stateManager.setToken(responseData.token);
        stateManager.setEmail(data.email);
        router.navigate('/profile');
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    });
  }
}