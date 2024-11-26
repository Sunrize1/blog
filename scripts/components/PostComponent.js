import { BaseComponent } from './BaseComponent.js';
import { formatDate } from '../utils/Utils.js';

export class PostComponent extends BaseComponent {
  constructor(post) {
    super();
    this.post = post;
    this.render();
    this.setupReadMoreButton();
  }

  render() {
    this.element.className = 'post-card';
    this.element.innerHTML = `
      <div class="post-header">
        <p>${this.post.author} - ${formatDate(this.post.createTime)}</p>
        <h2>${this.post.title}</h2>
      </div>
      <div class="post-content">
        ${this.post.image ? `<img src="${this.post.image}" alt="${this.post.title}" class="post-image" />` : ''}
        <p class="post-description">${this.post.description.substring(0, 300)}</p>
        ${this.post.description.length > 300 ? `<p class="read-more-button">Read More</p>` : ''}
        <div class="post-details">
          <p><span class="like-icon">👍</span> ${this.post.likes}</p>
          <p><span class="comment-icon">💬</span> ${this.post.commentsCount}</p>
          <p>Reading Time: ${this.post.readingTime} minutes</p>
          <p>${this.post.tags.map(tag => tag.name).join(', ')}</p>
        </div>
      </div>
    `;
  }

  setupReadMoreButton() {
    const readMoreButton = this.element.querySelector('.read-more-button');
    if (readMoreButton) {
      readMoreButton.addEventListener('click', () => {
        const descriptionElement = readMoreButton.previousElementSibling;
        if (descriptionElement.classList.contains('expanded')) {
          descriptionElement.textContent = this.post.description.substring(0, 300) + '...';
          readMoreButton.textContent = 'Read More';
        } else {
          descriptionElement.textContent = this.post.description;
          readMoreButton.textContent = 'Read Less';
        }
        descriptionElement.classList.toggle('expanded');
      });
    }
  }
}