import { BaseComponent } from './BaseComponent.js';
import { fetchProfile, updateUser } from '../utils/API.js';
import { formatDateForProfile, formatPhoneNumber } from '../utils/Utils.js';
import { router } from '../main.js';
import { PopupComponent } from './PopupComponent.js';

export class ProfileComponent extends BaseComponent {
  constructor() {
    super();
    this.profile = null;
    this.fetchAndDisplayProfile();
  }

  render() {
    this.element.className = 'profile-container';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <form id="profile-form">
        <h2>Профиль<h2>
          <input type="text" id="fullName" placeholder="ФИО" value=${this.profile.fullName} required />
          <input type="email" id="email" placeholder="Email" value=${this.profile.email} required />
          <input type="date" id="birthDate" required />
          <select id="gender" required>
            <option value="Male"${this.profile.gender === 'Male' ? 'selected' : ''} >Мужской</option>
            <option value="Female"${this.profile.gender === 'Female' ? 'selected' : ''}>Женский</option>
          </select>
          <input type="text" id="phoneNumber" placeholder="Номер телефона"  required />
          <button type="submit">Сохранить</button>
        </form>
    `;
    console.log(this.profile);
    this.setupForm()
  }

  setupForm() {
    const form = this.element.querySelector('#profile-form');
    const phoneInput = this.element.querySelector('#phoneNumber');
    const dateInput = this.element.querySelector('#birthDate');
    dateInput.value = formatDateForProfile(this.profile.birthDate);
    phoneInput.value = this.profile.phoneNumber;

    phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        fullName: this.element.querySelector('#fullName').value,
        email: this.element.querySelector('#email').value,
        birthDate: this.element.querySelector('#birthDate').value,
        gender: this.element.querySelector('#gender').value,
        phoneNumber: this.element.querySelector('#phoneNumber').value,
      };
      this.update(data);
    });
  }

  async update(data) {
    try {
      await updateUser(data);
      this.fetchAndDisplayProfile()
      new PopupComponent( {message: "Профиль успешно обновлен"}).mount(document.body);
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      this.fetchAndDisplayProfile()
    }
  }

  async fetchAndDisplayProfile() {
    try {
      this.profile = await fetchProfile();
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      router.navigate('/login');
    }
  } 
}