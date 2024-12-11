import { BaseComponent } from './BaseComponent.js';
import { router } from '../main.js';

export class PaginationComponent extends BaseComponent {
  constructor(pagination, onPageChange) {
    super();
    this.pagination = pagination;
    this.onPageChange = onPageChange;
    this.render();
    this.setupPagination();
  }

  render() {
    this.element.innerHTML = `
      <div class="pagination">
        ${this.pagination.current > 1 ? `<button class="prev-page">Предыдущая</button>` : ''}
        <span>Page ${this.pagination.current} of ${this.pagination.count}</span>
        ${this.pagination.current < this.pagination.count ? `<button class="next-page">Следующая</button>` : ''}
        <div class="pagination-size-filter">
          <label for="pagination-size">Постов на странице</label>
          <input type="number" id="pagination-size" min="1" value="${this.pagination.size}" />
        </div>
      </div>
    `;
  }

  setupPagination() {
    const prevButton = this.element.querySelector('.prev-page');
    const nextButton = this.element.querySelector('.next-page');
    const paginationSizeInput = this.element.querySelector('#pagination-size');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        this.handlePageChange(this.pagination.current - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.handlePageChange(this.pagination.current + 1);
      });
    }

    if (paginationSizeInput) {
      paginationSizeInput.addEventListener('change', () => {
        const newSize = parseInt(paginationSizeInput.value, 10);
        this.handlePageSizeChange(newSize);
      });
    }
  }

  handlePageChange(newPage) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', newPage);
    router.navigate(`/main?${urlParams.toString()}`);
    this.onPageChange(newPage);
  }

  handlePageSizeChange(newSize) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', 1); 
    urlParams.set('size', newSize);
    router.navigate(`/main?${urlParams.toString()}`);
    this.onPageChange(1); 
  }
}