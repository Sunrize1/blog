import { BaseComponent } from './BaseComponent.js';
import { fetchPosts, fetchTags, addPost } from '../utils/API.js';
import { router } from '../main.js';
import { PostComponent } from './PostComponent.js';
import { FilterComponent } from './FilterComponent.js';
import { PaginationComponent } from './PaginationComponent.js';
import { PopupComponent } from './PopupComponent.js';
import { CreatePostComponent } from './CreatePostComponent.js';
import { stateManager } from '../utils/StateManager.js';

export class MainComponent extends BaseComponent {
  constructor() {
    super();
    this.tags = [];
    this.posts = [];
    this.pagination = {};
    this.render();
  }

  render() {
    this.element.className = 'main-container';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      ${stateManager.getToken() ? `<button id="create-post-button" class="create-post-button">Create Post</button>` : ''}
      <div id="filter"></div>
      <div id="posts"></div>
      <div id="pagination"></div>
    `;

    this.fetchAndDisplayFilter();
    this.fetchAndDisplayPosts();
    if(stateManager.getToken()) this.setupCreatePostButton();
  }

  async fetchAndDisplayPosts() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const filters = Object.fromEntries(urlParams.entries());

      if (filters.tags) {
        filters.tags = filters.tags.split(',');
      }

      const response = await fetchPosts(filters);
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

  setupFilter() {
    const filterContainer = document.getElementById('filter')
    filterContainer.innerHTML = '';
    const filterComponent = new FilterComponent(this.tags, this.fetchAndDisplayPosts.bind(this));
    filterComponent.mount(filterContainer);
  }

  setupPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    this.posts.forEach(post => {
      const postComponent = new PostComponent(post);
      postComponent.mount(postsContainer);
    });
  }

  setupPagination() {
    const paginationContainer = document.getElementById('pagination')
    paginationContainer.innerHTML = '';
    const paginationComponent = new PaginationComponent(this.pagination, this.handlePageChange);
    paginationComponent.mount(paginationContainer);
  }

  async handlePageChange(newPage) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', newPage);
    router.navigate(`/main?${urlParams.toString()}`);
    await this.fetchAndDisplayPosts();
  }

  setupCreatePostButton() {
    const createPostButton = this.element.querySelector('#create-post-button');
    createPostButton.addEventListener('click', () => {
      const createPostComponent = new CreatePostComponent();
      createPostComponent.mount(document.body);
    });
  }
}