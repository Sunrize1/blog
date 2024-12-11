import { BaseComponent } from './BaseComponent.js';

export class PopupComponent extends BaseComponent {
  constructor(response) {
    super();
    this.response = response;
    this.render();
    this.setupCloseButton();
  }

  render() {
    this.element.innerHTML = `
      <div class="popup">
        <p>${this.response.message}</p>
        <button class="close-button">Закрыть</button>
      </div>
    `;
  }

  setupCloseButton() {
    const closeButton = this.element.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      this.unmount();
    });
  }

  mount(parentElement) {
    super.mount(parentElement);
    setTimeout(() => {
      this.unmount();
    }, 5000); 
  }
}