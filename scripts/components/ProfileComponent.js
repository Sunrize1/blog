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
        <h2>User Profile</h2>
        <div id="profile-content">
          <p><strong>Loading profile data...</strong></p>
        </div>
        <button id="save-profile" class="save-button">Save</button>
      </div>
    `;
  }

  async fetchAndDisplayProfile() {
    try {
      const profile = await fetchProfile();
      const profileContent = document.getElementById('profile-content');
      profileContent.innerHTML = `
        <p><strong>Email:</strong> <input type="email" id="email" value="${profile.email}" disabled /></p>
        <p><strong>Full Name:</strong> <input type="text" id="fullName" value="${profile.fullName}" disabled /></p>
        <p><strong>Phone Number:</strong> <input type="text" id="phoneNumber" value="${profile.phoneNumber}" disabled /></p>
        <p><strong>Gender:</strong> <input type="text" id="gender" value="${profile.gender}" disabled /></p>
        <p><strong>Birth Date:</strong> <input type="date" id="birthDate" value="${new Date(profile.birthDate).toISOString().split('T')[0]}" disabled /></p>
      `;
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      router.navigate('/login');
    }
  } 
}