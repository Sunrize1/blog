import { BaseComponent } from './BaseComponent.js';
import { addPost, fetchAddressSearch, fetchAddressChain } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { fetchTags } from '../utils/API.js';

export class CreatePostComponent extends BaseComponent {
  constructor() {
    super();
    this.tags = [];
    this.addressChain = [];
    this.fetchAndDisplayTags();
  }

  async fetchAndDisplayTags() {
    try {
      this.tags = await fetchTags();
      this.render();
      this.setupForm();
      this.setupInputTags();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="create-post-container">
        <form class="create-post-form">
          <h2>Create Post</h2>
          <input type="text" id="title" placeholder="Title" required />
          <textarea id="description" placeholder="Description" required></textarea>
          <input type="text" id="image" placeholder="Image URL" />
          <input type="number" id="readingTime" placeholder="Reading Time (minutes)" required />
          <div class="tags-container">
            <div class="tags-input">
              <input type="text" id="tags-input" placeholder="Select tags" readonly />
              <span class="tags-arrow">&#9660;</span>
            </div>
            <div class="tags-dropdown">
              ${this.tags.map(tag => `<div class="tag-option" data-tag-id="${tag.id}">${tag.name}</div>`).join('')}
            </div>
          </div>
          <div class="address-input-group">
            <label for="region">Субъект РФ</label>
            <select id="region" class="address-select"></select>
          </div>
          <div class="address-input-group" id="next-address-element" style="display: none;">
            <label id="next-address-label">Следующий элемент адреса</label>
            <select id="next-address-select" class="address-select"></select>
          </div>
          <button type="submit">Create Post</button>
          <button type="button" class="close-button">Close</button>
        </form>
      </div>
    `;
  }

  setupForm() {
    const form = this.element.querySelector('.create-post-form');
    const closeButton = this.element.querySelector('.close-button');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        title: this.element.querySelector('#title').value,
        description: this.element.querySelector('#description').value,
        image: this.element.querySelector('#image').value,
        readingTime: this.element.querySelector('#readingTime').value,
        tags: Array.from(this.element.querySelectorAll('.tag')).map(tag => tag.querySelector('.remove-tag').getAttribute('data-tag-id')),
        addressChain: this.addressChain,
      };
      try {
        await addPost(data);
        new PopupComponent({ message: 'Post created successfully' }).mount(document.body);
        this.unmount();
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    });

    closeButton.addEventListener('click', () => {
      this.unmount();
    });
  }

  setupInputTags() {
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
  
}