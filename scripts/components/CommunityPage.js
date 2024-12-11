import { BaseComponent } from './BaseComponent.js';
import { fetchCommunityById, fetchCommunityPosts, fetchTags, fetchCommunityRole, subscribeToCommunity, unsubscribeFromCommunity } from '../utils/API.js';
import { PostComponent } from './PostComponent.js';
import { PaginationComponent } from './PaginationComponent.js';
import { FilterComponent } from './FilterComponent.js';
import { PopupComponent } from './PopupComponent.js';
import { CreatePostComponent } from './CreatePostComponent.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class CommunityPage extends BaseComponent {
  constructor(params) {
    super();
    this.token = stateManager.getToken();
    this.theme = localStorage.getItem('theme');
    this.communityId = params.id;
    this.community = null;
    this.role = null;
    this.posts = [];
    this.pagination = {};
    this.tags = [];
    this.fetchAndDisplayCommunity();
  }

  async fetchAndDisplayCommunity() {
    try {
      this.community = await fetchCommunityById(this.communityId);
      if(this.token) this.role = await fetchCommunityRole(this.communityId);
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }


  async fetchAndDisplayPosts() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const filters = Object.fromEntries(urlParams.entries());

      if (filters.tags) {
        filters.tags = filters.tags.split(',');
      }

      const response = await fetchCommunityPosts(this.communityId, filters);
      this.posts = response.posts;
      this.pagination = response.pagination;
      this.setupPosts();
      this.setupPagination();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  async fetchAndDisplayFilter() {
    try {
      this.tags = await fetchTags();
      this.setupFilter();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render() {
    this.element.className = 'community-page';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <div class="community-info">
          <div class="community-header">
            <h1>${this.community.name}</h2>
            ${this.role === "Administrator" ? `<button class="create-post-button">Написать пост</button>` 
              : `<button class="subscribe-button">
                    ${this.role === "Subscriber" ? "Отписаться" : "Подписаться"}
                 </button>`}
          </div>
          <div class="community-subscribers">
            <img src="./assets/${this.theme}/icons/subscribers.png" class='subscribers-icon'></img>
            <p>${this.community.subscribersCount} подписчиков</p>
          </div>
          <div class="community-description">
            <p>Тип сообщества: ${this.community.isClosed ? 'Закрытое' :  'Открытое'}</p>
          </div>
          <div class="community-description">
            <p>${this.community.description}</p>
          </div>
          <div class="administrators-list">
            <h3>Администраторы</h3>
            <div class="administrators-column">
              ${this.community.administrators.map(admin => this.displayAdministrator(admin)).join('')}
            </div>
          </div>
        </div>
        <div id="filter"></div>
        <div id="posts"></div>
        <div id="pagination"></div>
    `;

      if(this.role != "Administrator") {
        this.setupCommunityActions()
      } else {
        this.setupCreatePostButton();
      }

      if(!this.role && this.community.isClosed) {
        return;
      } else {
        this.fetchAndDisplayFilter();
        this.fetchAndDisplayPosts();
      }
  }

  displayAdministrator(admin) {
    const genderIcon = admin.gender === 'Male' ? 'male.png' : 'female.png';
    return `
      <div class="administrator-card">
        <img src="./assets/${this.theme}/icons/${genderIcon}" alt="${admin.gender}" class="administrator-icon">
        <p class="administrator-name">${admin.fullName}</p>
      </div>
    `;
  }

  setupFilter() {
    const filterContainer = this.element.querySelector('#filter');
    filterContainer.innerHTML = '';
    const filterComponent = new FilterComponent(this.tags, this.fetchAndDisplayPosts.bind(this), true);
    filterComponent.mount(filterContainer);
  }

  setupPosts() {
    const postsContainer = this.element.querySelector('#posts');
    postsContainer.innerHTML = '';
    this.posts.forEach(post => {
      const postComponent = new PostComponent(post);
      postComponent.mount(postsContainer);
    });
  }

  setupCommunityActions() {
    const subscribeButton = this.element.querySelector('.subscribe-button');
    subscribeButton.addEventListener('click', async (e) => {
      const isSubscribed = this.role === "Subscriber";

      try {
        if (isSubscribed) {
          await unsubscribeFromCommunity(this.communityId);
        } else {
          await subscribeToCommunity(this.communityId);
        }
        this.fetchAndDisplayCommunity();
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    })
  }

  setupPagination() {
    const paginationContainer = this.element.querySelector('#pagination');
    paginationContainer.innerHTML = '';
    const paginationComponent = new PaginationComponent(this.pagination, this.handlePageChange.bind(this));
    paginationComponent.mount(paginationContainer);
  }

  setupCreatePostButton() {
    const createPostButton = this.element.querySelector('.create-post-button');
    createPostButton.addEventListener('click', () => {
      const createPostComponent = new CreatePostComponent(this.communityId);
      createPostComponent.mount(document.body);
    });
  }

  handlePageChange(newPage) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', newPage);
    router.navigate(`/community/${this.communityId}?${urlParams.toString()}`);
  }
}