import { BaseComponent } from './BaseComponent.js';
import { fetchCommunities, subscribeToCommunity, unsubscribeFromCommunity, fetchMyCommunities } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { router } from '../main.js';
import { stateManager } from '../utils/StateManager.js';

export class CommunitiesComponent extends BaseComponent {
  constructor() {
    super();
    this.token = stateManager.getToken();
    this.communities = [];
    this.myCommunities = [];
    this.fetchAndDisplayCommunities();
  }

  async fetchAndDisplayCommunities() {
    try {
      this.communities = await fetchCommunities();
      if(this.token) this.myCommunities = await fetchMyCommunities();
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render() {
    this.element.className = 'communities-container';
    this.element.innerHTML = `
      <div class="communities-list">
        ${this.communities.map(community => this.displayCommunity(community)).join('')}
      </div>
    `;
    this.setupCommunityActions();
  }

  displayCommunity(community) {
    const isAdmin = this.token ? this.myCommunities.some(myCommunity => myCommunity.communityId === community.id && myCommunity.role === 'Administrator') : false;
    const isSubscribed = this.token ? this.myCommunities.some(myCommunity => myCommunity.communityId === community.id): false;

    return `
      <div class="community-card" data-community-id="${community.id}">
        <h3>${community.name}</h3>
        ${isAdmin ? '' : `
          <button class="subscribe-button" data-community-id="${community.id}" data-subscribed="${isSubscribed}">
            ${isSubscribed ? 'Отписаться' : 'Подписаться'}
          </button>
        `}
      </div>
    `;
  }

  setupCommunityActions() {
    const communityCards = this.element.querySelectorAll('.community-card');
    communityCards.forEach(card => {
      card.addEventListener('click', () => {
        const communityId = card.getAttribute('data-community-id');
        router.navigate(`/community/${communityId}`); 
      });
    });

    const subscribeButtons = this.element.querySelectorAll('.subscribe-button');
    subscribeButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const communityId = button.getAttribute('data-community-id');
        const isSubscribed = button.getAttribute('data-subscribed') === 'true';

        try {
          if (isSubscribed) {
            await unsubscribeFromCommunity(communityId);
          } else {
            await subscribeToCommunity(communityId);
          }
          this.fetchAndDisplayCommunities();
        } catch (error) {
          new PopupComponent({ message: error.message }).mount(document.body);
        }
      });
    });
  }
}