import { BaseComponent } from './BaseComponent.js';
import { fetchAuthors } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { router } from '../main.js';
import { formatDate } from '../utils/Utils.js';

export class AuthorsComponent extends BaseComponent {
  constructor() {
    super();
    this.theme = localStorage.getItem('theme');
    this.fetchAndDisplayAuthors();
  }

  async fetchAndDisplayAuthors() {
    try {
      const authors = await fetchAuthors();

      const sortedByLikesAndPosts = authors.sort((a, b) => {
        if (b.likes !== a.likes) {
          return b.likes - a.likes; 
        }
        return b.posts - a.posts; 
      });

      const topAuthors = sortedByLikesAndPosts.slice(0, 3);

      const sortedAuthors = authors.sort((a, b) => {
        const nameA = a.fullName.toLowerCase();
        const nameB = b.fullName.toLowerCase();
      
        const getPriority = (name) => {
          if (/^[a-z]/.test(name)) {
            return 0; 
          } else if (/^[а-я]/.test(name)) {
            return 1; 
          } else {
            return 2; 
          }
        };
      
        const priorityA = getPriority(nameA);
        const priorityB = getPriority(nameB);
      
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      
        return nameA.localeCompare(nameB);
      });

      this.render(sortedAuthors, topAuthors);
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render(authors, topAuthors) {
    this.element.className = 'authors-container';
    this.element.innerHTML = `
      <div class="authors-list">
        ${authors.map((author, index) => this.displayAuthor(author, topAuthors)).join('')}
      </div>
    `;
    this.setupCards();
  }

  displayAuthor(author, topAuthors) {
    const isTopAuthor = topAuthors.some(topAuthor => topAuthor.fullName === author.fullName);
    const crownIcon = isTopAuthor ? `./assets/${['gold', 'silver', 'bronze'][topAuthors.findIndex(topAuthor => topAuthor.fullName === author.fullName)]}.png` : '';
    const genderIcon = author.gender === 'Male' ? `./assets/${this.theme}/icons/male.png` : `./assets/${this.theme}/icons/female.png`;

    return `
      <div class="author-card">
        <div class="author-header">
          <img src="${genderIcon}" alt="${author.gender}" class="author-icon">
          ${crownIcon ? `<img src="${crownIcon}" alt="Crown" class="crown-icon">` : ''}
        </div>
        <div class="author-name">${author.fullName}</div>
        <div class="author-stats">
          <span class="stat-tag">Посты: ${author.posts}</span>
          <span class="stat-tag">Лайки: ${author.likes}</span>
        </div>
        <div class="author-details">
          <p>Дата создания: ${formatDate(author.created)}</p>
          <p>Дата рождения: ${formatDate(author.birthDate)}</p>
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
        router.navigate(`/main?${urlParams.toString()}`);
      });
    });
  }
}