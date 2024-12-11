import { BaseComponent } from './BaseComponent.js';
import { router } from '../main.js';


export class FilterComponent extends BaseComponent {
  constructor(tags, onFilterChange, isCommunity) {
    super();
    this.onFilterChange = onFilterChange;
    this.tags = tags
    this.isCommunity = isCommunity;
    this.render();
    this.setupForm();
    
  }

  render() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTagIds = urlParams.get('tags') ? urlParams.get('tags').split(',') : [];
    const selectedTags = this.tags.filter(tag => selectedTagIds.includes(tag.id.toString()));
    this.element.className = 'filter';
    this.element.innerHTML = `
      <form id="filter-form">
        <div class="filter-group">
          <label for="tags">Тэги</label>
          <div class="tags-container">
            <div class="tags-input">
            <input type="text" id="tags-input" placeholder="Тэги" readonly />
            ${selectedTags.map(tag => `<span class="tag">${tag.name} <span class="remove-tag" data-tag-id="${tag.id}">×</span></span>`).join('')}
              <span class="tags-arrow">&#9660;</span>
            </div>
            <div class="tags-dropdown">
              ${this.tags.map(tag => `<div class="tag-option" data-tag-id="${tag.id}">${tag.name}</div>`).join('')}
            </div>
          </div>
        </div>
        ${this.isCommunity ? '' : `<div class="filter-group">
          <label for="author">Автор</label>
          <input type="text" id="author" placeholder="Author" value="${urlParams.get('author') || ''}" />
        </div>`}
        ${this.isCommunity ? '' : `<div class="filter-group">
          <label for="min">Время чтения от</label>
          <input type="number" id="min" placeholder="Время чтения от" min="0" value="${urlParams.get('min') || ''}" />
        </div>`}
        ${this.isCommunity ? '' : `<div class="filter-group">
          <label for="max">Время чтения до</label>
          <input type="number" id="max" placeholder="Время чтения до" min="0" value="${urlParams.get('max') || ''}" />
        </div>`}
        <div class="filter-group">
          <label for="sorting">Сортировать</label>
          <select id="sorting">
            <option value="CreateDesc" ${urlParams.get('sorting') === 'CreateDesc' ? 'selected' : ''}>По дате создания(сначала новые)</option>
            <option value="CreateAsc" ${urlParams.get('sorting') === 'CreateAsc' ? 'selected' : ''}>По дате создания(сначала старые)</option>
            <option value="LikeAsc" ${urlParams.get('sorting') === 'LikeAsc' ? 'selected' : ''}>По лайкам(от меньшего)</option>
            <option value="LikeDesc" ${urlParams.get('sorting') === 'LikeDesc' ? 'selected' : ''}>По лайкам(от большего)</option>
          </select>
        </div>
        ${this.isCommunity ? '' : `<div class="filter-group">
          <label for="onlyMyCommunities">Только мои группы</label>
          <input type="checkbox" id="onlyMyCommunities" ${urlParams.get('onlyMyCommunities') === 'true' ? 'checked' : ''} />
        </div>`}
        <button type="submit" class="filter-button">Применить</button>
      </form>
    `;
  }

  setupForm() {
    const form = this.element.querySelector('#filter-form');
    const tagsInput = this.element.querySelector('.tags-input');
    const tagsDropdown = this.element.querySelector('.tags-dropdown');
    const tagsInputField = this.element.querySelector('#tags-input');
    const tagsArrow = this.element.querySelector('.tags-arrow');

    tagsArrow.addEventListener('click', () => {
      tagsDropdown.style.display = tagsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    const tagOptions = tagsDropdown.querySelectorAll('.tag-option');
    tagOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const tagId = e.target.getAttribute('data-tag-id');
        const tagName = e.target.textContent;
        const tagElement = `<span class="tag">${tagName} <span class="remove-tag" data-tag-id="${tagId}">×</span></span>`;
        tagsInput.insertAdjacentHTML('beforeend', tagElement);
        tagsDropdown.style.display = 'none';
        tagsInputField.value = '';
        this.setupTags();
      });
    });
    this.setupTags();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.applyFilters();
    });
  }

  setupTags() {
    const tagsInput = this.element.querySelector('.tags-input');
    const removeTags = tagsInput.querySelectorAll('.remove-tag');
    removeTags.forEach(removeTag => {
      removeTag.addEventListener('click', (e) => {
        const tagElement = e.target.parentElement;
        tagElement.remove();
      });
    });
  }


  applyFilters() {
    const tags = Array.from(this.element.querySelectorAll('.tag')).map(tag => tag.querySelector('.remove-tag').getAttribute('data-tag-id'));
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set('page', '1');
    urlParams.set('size', '5');

    if (tags.length > 0) {
      urlParams.set('tags', tags.join(','));
    } else {
      urlParams.delete('tags');
    }
  
    let author;
    if(!this.isCommunity) author = document.getElementById('author').value;
    if (author) {
      urlParams.set('author', author);
    } else {
      urlParams.delete('author');
    }
  
    let min;
    if(!this.isCommunity) min = document.getElementById('min').value;
    if (min) {
      urlParams.set('min', min);
    } else {
      urlParams.delete('min');
    }
  
    let max;
    if(!this.isCommunity) max = document.getElementById('max').value;
    if (max) {
      urlParams.set('max', max);
    } else {
      urlParams.delete('max');
    }
  
    const sorting = document.getElementById('sorting').value;
    if (sorting) {
      urlParams.set('sorting', sorting);
    } else {
      urlParams.delete('sorting');
    }
  
    let onlyMyCommunities;
    if(!this.isCommunity) onlyMyCommunities = document.getElementById('onlyMyCommunities').checked
    if (onlyMyCommunities) {
      urlParams.set('onlyMyCommunities', 'true');
    } else {
      urlParams.delete('onlyMyCommunities');
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    router.updateUrl(newUrl);

    this.onFilterChange();
  }

}