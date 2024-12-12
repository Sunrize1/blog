import { BaseComponent } from './BaseComponent.js';
import { registerUser } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { formatPhoneNumber } from '../utils/Utils.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class RegistrationComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.element.className = 'registration-container';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <form id="registration-form">
        <h2>Регистрация<h2>
          <input type="text" id="fullName" placeholder="ФИО" required />
          <input type="password" id="password" placeholder="Пароль" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="date" id="birthDate" required />
          <select id="gender" required>
            <option value="Male">Мужской</option>
            <option value="Female">Женский</option>
          </select>
          <input type="text" id="phoneNumber" placeholder="Номер телефона" required />
          <button type="submit">Зарегистрироваться</button>
        </form>
    `;
    this.setupForm();
  }

  setupForm() {
    const form = this.element.querySelector('#registration-form');
    const phoneInput = this.element.querySelector('#phoneNumber');

    phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        fullName: this.element.querySelector('#fullName').value,
        password: this.element.querySelector('#password').value,
        email: this.element.querySelector('#email').value,
        birthDate: this.element.querySelector('#birthDate').value,
        gender: this.element.querySelector('#gender').value,
        phoneNumber: this.element.querySelector('#phoneNumber').value,
      };
      this.register(data);
    });
  }

  async register(data) {
    try {
      const responseData = await registerUser(data);
      stateManager.setToken(responseData.token)
      stateManager.setEmail(data.email);
      router.navigate('/profile');
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }
}