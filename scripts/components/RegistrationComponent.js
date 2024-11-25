import { BaseComponent } from './BaseComponent.js';
import { registerUser } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { router } from '../main.js';

export class RegistrationComponent extends BaseComponent {
  constructor() {
    super();
    this.render();
    this.setupForm();
  }

  render() {
    this.element.innerHTML = `
      <div class="registration-container">
        <form id="registration-form">
        <h2>Registartion<h2>
          <input type="text" id="fullName" placeholder="Full Name" required />
          <input type="password" id="password" placeholder="Password" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="date" id="birthDate" required />
          <select id="gender" required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" id="phoneNumber" placeholder="Phone Number" required />
          <button type="submit">Register</button>
        </form>
      </div>
    `;
  }

  setupForm() {
    const form = this.element.querySelector('#registration-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        fullName: document.getElementById('fullName').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        phoneNumber: document.getElementById('phoneNumber').value,
      };
      try {
        const responseData = await registerUser(data);
        new PopupComponent(responseData).mount(document.body);
        router.navigate('/login');
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    });
  }
}