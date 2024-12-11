import { BaseComponent } from './BaseComponent.js';
import { fetchProfile } from '../utils/API.js';
import { router } from '../main.js';
import { PopupComponent } from './PopupComponent.js';

export class ProfileComponent extends BaseComponent {
  constructor() {
    super();
    this.fetchAndDisplayProfile();
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <div class="profile-container">
        <h2>Профиль</h2>
        <div id="profile-content">
          <p><strong>Загрузка...</strong></p>
        </div>
        <button id="save-profile" class="save-button">Сохранить</button>
      </div>
    `;
  }

  async fetchAndDisplayProfile() {
    try {
      const profile = await fetchProfile();
      const profileContent = document.getElementById('profile-content');
      profileContent.innerHTML = `
        <p><strong>Email</strong> <input type="email" id="email" value="${profile.email}" disabled /></p>
        <p><strong>ФИО</strong> <input type="text" id="fullName" value="${profile.fullName}" disabled /></p>
        <p><strong>Номер телефона</strong> <input type="text" id="phoneNumber" value="${profile.phoneNumber}" disabled /></p>
        <p><strong>Пол</strong> <input type="text" id="gender" value="${profile.gender}" disabled /></p>
        <p><strong>Дата рождения</strong> <input type="date" id="birthDate" value="${new Date(profile.birthDate).toISOString().split('T')[0]}" disabled /></p>
      `;
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      router.navigate('/login');
    }
  } 
}