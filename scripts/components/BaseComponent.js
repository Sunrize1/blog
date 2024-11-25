export class BaseComponent {
  constructor() {
      this.element = document.createElement('div');
  }

  render() {
  }

  mount(parentElement) {
      if (parentElement) {
          parentElement.appendChild(this.element);
      } else {
          document.body.appendChild(this.element);
      }
  }

  unmount() {
      if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
      }
  }
}