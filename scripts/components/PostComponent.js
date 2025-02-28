import { BaseComponent } from './BaseComponent.js';
import { formatDate, escapeHtml } from '../utils/Utils.js';
import { likePost, unlikePost } from '../utils/API.js';
import { router } from '../main.js';
import { PopupComponent } from './PopupComponent.js';
import { fetchAddressChain } from '../utils/API.js';
import { stateManager } from '../utils/StateManager.js';

export class PostComponent extends BaseComponent {
  constructor(post) {
    super();
    this.theme = stateManager.getTheme();
    this.post = post;
    this.addressChain = [];
    this.fetchAndDisplayPost();
  }

  async fetchAndDisplayPost() {
      if(this.post.addressId) {
        this.addressChain = await fetchAddressChain(this.post.addressId);
      }
      this.render()
  }

  render() {
    this.element.className = 'post-card';
    this.element.innerHTML = `
      <div class="post-header">
        <div class="post-info">
          <p class="post-author">${this.post.author} - ${formatDate(this.post.createTime)}</p>
          <h2 class="post-title">${escapeHtml(this.post.title)}</h2>
        </div>
        <div class="post-geoposition">
          ${this.addressChain[0] ? `<img src="./assets/${this.theme}/icons/geo.png" class='geo-icon'></img>` : ''}
          <p class="post-address">${this.addressChain.map(address => address.text).join(', ')}</p>
        </div>
      </div>

      <div class="post-content">
        ${this.post.image ? `<img src="${this.post.image}" alt="${this.post.title}" class="post-image" />` : ''}
        <p class="post-description">${escapeHtml(this.post.description).substring(0, 300)}</p>
        ${this.post.description.length > 300 ? `<p class="read-more-button">Читать полностью</p>` : ''}
        <div class="post-details">

          <div class="post-likes">
            ${this.post.hasLike ? 
            `<img src="./assets/like.png" class="like-icon" />` 
            : `<img src="./assets/${this.theme}/icons/nonlike.png" class='like-icon'`}

            <p> ${this.post.likes}</p>
          </div>

          <div class="post-comments">
              <img src="./assets/${this.theme}/icons/comment.png" class='like-icon'></img>
              <p>${this.post.commentsCount}</p>
          </div>

          <p>Время чтения: ${this.post.readingTime} мин</p>
          
          <div class="post-tags">
            ${this.post.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
    this.setupReadMoreButton();
    this.setupLikeButton();
    this.setupTitleClick();
  }

  setupReadMoreButton() {
    const readMoreButton = this.element.querySelector('.read-more-button');
    if (readMoreButton) {
      readMoreButton.addEventListener('click', () => {
        const descriptionElement = readMoreButton.previousElementSibling;
        if (descriptionElement.classList.contains('expanded')) {
          descriptionElement.textContent = this.post.description.substring(0, 300) + '...';
          readMoreButton.textContent = 'Читать полностью';
        } else {
          descriptionElement.textContent = this.post.description;
          readMoreButton.textContent = 'Скрыть';
        }
        descriptionElement.classList.toggle('expanded');
      });
    }
  }

  setupLikeButton() {
    const likeButon = this.element.querySelector('.like-icon')
    likeButon.addEventListener('click', () => {
      this.post.hasLike ? this.unapplyLike() : this.applyLike();
    })
  }

  async applyLike() {
    try {
      await likePost(this.post.id);
      this.post.hasLike = true;
      this.post.likes++;
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      router.navigate('/main');
    }
  }

  async unapplyLike() {
    try {
      await unlikePost(this.post.id);
      this.post.hasLike = false;
      this.post.likes--;
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
      router.navigate('/main');
    }
  }

  setupTitleClick() {
    const postTitle = this.element.querySelector('.post-title');
    if (postTitle) {
      postTitle.addEventListener('click', () => {
        router.navigate(`/post/${this.post.id}`);
      });
    }
  }
}