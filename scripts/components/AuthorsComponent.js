import { BaseComponent } from './BaseComponent.js';
import { fetchAuthors } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import {router} from '../main.js'
export class AuthorsComponent extends BaseComponent {
  constructor() {
    super();
    this.theme = localStorage.getItem('theme');
    this.fetchAndDisplayAuthors();
  }

  async fetchAndDisplayAuthors() {
    try {
      const authors = await fetchAuthors();
      this.render(authors);
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render(authors) {
    authors.sort((a, b) => {
      if (b.posts !== a.posts) {
        return b.likes - a.likes;
      }
      return b.posts - a.posts;
    });
    this.element.className = 'authors-container'
    this.element.innerHTML = `
      <div class="authors-list">
          ${authors.map((author, index) => this.displayAuthor(author, index)).join('')}
        </div>
    `;
    this.setupCards();
  }

  displayAuthor(author, index) {
    const crownIcon = index < 3 ? `./assets/${['gold', 'silver', 'bronze'][index]}.png` : '';
    const genderIcon = author.gender === 'Male' ? `./assets/${this.theme}/icons/male.png` : `./assets/${this.theme}/icons/female.png`;

    
    return `
      <div class="author-card">
        <div class="author-header">
          <img src="${genderIcon}" alt="${author.gender}" class="author-icon">
          ${crownIcon ? `<img src="${crownIcon}" alt="Crown" class="crown-icon">` : ''}
        </div>
        <div class="author-name">${author.fullName}</div>
        <div class="author-stats">
          <span class="stat-tag">Posts: ${author.posts}</span>
          <span class="stat-tag">Likes: ${author.likes}</span>
        </div>
      </div>
    `;
  }

  setupCards() {
    this.element.querySelectorAll('.author-card').forEach(card => {
      card.addEventListener('click', () => {
        const authorName = card.querySelector('.author-name').textContent;
        const urlParams = new URLSearchParams();
        urlParams.set('author', authorName);
        urlParams.set('page', '1');
        urlParams.set('size', '5');
        router.navigate(`/main?${urlParams.toString()}`);
      });
    });
  }
}