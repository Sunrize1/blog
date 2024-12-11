import { BaseComponent } from './BaseComponent.js';
import { addPost, fetchAddressSearch, fetchAddressChain, fetchMyCommunities, fetchCommunities } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { fetchTags } from '../utils/API.js';
import { router } from '../main.js';

export class CreatePostComponent extends BaseComponent {
  constructor(ChoosenCommunityId) {
    super();
    this.tags = [];
    this.address = null;
    this.currentObjectId = null;
    this.ChoosenCommunityId = ChoosenCommunityId;
    this.communities = [];
    this.fetchAndDisplayCreatePost();
  }

  async fetchAndDisplayCreatePost() {
    try {
      this.tags = await fetchTags();
      const myCommunities = await fetchMyCommunities();
      const adminCommunityIds = myCommunities.filter(c => c.role === 'Administrator').map(c => c.communityId);

      const allCommunities = await fetchCommunities();
      this.communities = allCommunities.filter(c => adminCommunityIds.includes(c.id));
      this.render();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  render() {
    this.element.className = 'create-overlay';
    this.element.innerHTML = `
      <div class="create-post-container">
        <form class="create-post-form">
          <h2>Написать новый пост</h2>
          <input type="text" id="title" placeholder="Название" required />
          <textarea id="description" placeholder="Текст" required></textarea>
          <input type="text" id="image" placeholder="Ссылка на картинку" />
          <input type="number" id="readingTime" placeholder="Время чтения(в минутах)" required />
          <div class="tags-container">
            <div class="tags-input">
              <input type="text" id="tags-input" placeholder="Тэги" readonly />
              <span class="tags-arrow">&#9660;</span>
            </div>
            <div class="tags-dropdown">
              ${this.tags.map(tag => `<div class="tag-option" data-tag-id="${tag.id}">${tag.name}</div>`).join('')}
            </div>
          </div>
          <div class="community-select-group">
            <label for="community">Группа</label>
            <select id="community">
              <option value="">Не выбрано</option>
              ${this.communities.map(community => 
                `<option value="${community.id}" ${community.id == this.ChoosenCommunityId ? 'selected': ''}>
                    ${community.name}
                </option>`).join('')}
            </select>
          </div>
          <div class="address-input-group">
            <label for="region">Субъект РФ</label>
            <input type="text" id="region-select" list="region-datalist" class="address-select"></input>
            <datalist id="region-datalist"></datalist>
          </div>
          <button type="submit">Создать пост</button>
          <button type="button" class="close-button">Закрыть</button>
        </form>
      </div>
    `;
    this.setupRegionSelect();
    this.setupForm();
    this.setupInputTags();
  }

  setupForm() {
    const form = this.element.querySelector('.create-post-form');
    const closeButton = this.element.querySelector('.close-button');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        title: this.element.querySelector('#title').value,
        description: this.element.querySelector('#description').value,
        readingTime: this.element.querySelector('#readingTime').value,
        image: this.element.querySelector('#image').value,
        addressId: this.address,
        tags: Array.from(this.element.querySelectorAll('.tag')).map(tag => tag.querySelector('.remove-tag').getAttribute('data-tag-id')),
        communityId: this.element.querySelector('#community').value || null 
      };
      
      await this.createPost(data);
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

  setupRegionSelect() {
    const regionInput = this.element.querySelector('#region-select');
    const datalist = this.element.querySelector('#region-datalist');

    regionInput.addEventListener('input', async () => {
      datalist.innerHTML = '';
        const regions = await this.fetchAddress(regionInput.value);

        regions.forEach(region => {
          const option = document.createElement('option');
          option.value = region.text;
          option.dataset.objectId = region.objectId;
          option.dataset.guid = region.objectGuid;
          option.dataset.objectLevel = region.objectLevel;
          datalist.appendChild(option);
        });
    });

    regionInput.addEventListener('change', () => {
      const selectedOption = Array.from(datalist.children).find(option => option.value === regionInput.value);
      if (selectedOption) {
        const objectLevel = selectedOption.dataset.objectLevel;
        this.address = selectedOption.dataset.guid;
        this.currentObjectId = selectedOption.dataset.objectId;

        if (objectLevel !== 'Building') {
          this.setupNextAddress(this.currentObjectId, regionInput, selectedOption.dataset.guid);
        }
      } else {
        this.resetAddressInputs(regionInput);
      }
    });
  }

  setupNextAddress(parentId, parentElem, parentGuid) {
    const inputGroup = this.createAddressInputGroup();
    parentElem.insertAdjacentElement('afterend', inputGroup);

    const input = inputGroup.querySelector('input');
    const datalist = inputGroup.querySelector('datalist');

    input.value = '';
    datalist.innerHTML = '';
    inputGroup.style.display = 'flex';

    input.addEventListener('input', async () => {
      datalist.innerHTML = '';
        const nextAddresses = await this.fetchAddress(input.value, parentId);

        nextAddresses.forEach(addr => {
          const option = document.createElement('option');
          option.value = addr.text;
          option.dataset.objectId = addr.objectId;
          option.dataset.guid = addr.objectGuid;
          option.dataset.objectLevel = addr.objectLevel;
          option.dataset.objectLevelText = addr.objectLevelText;
          datalist.appendChild(option);
        });
    });

    input.addEventListener('change', () => {
      const selectedOption = Array.from(datalist.children).find(option => option.value === input.value);
      if (selectedOption) {
        const ObjectLevel = selectedOption.dataset.objectLevel;
        const ObjectLevelText = selectedOption.dataset.objectLevelText;
        this.address = selectedOption.dataset.guid;
        this.currentObjectId = selectedOption.dataset.objectId;

        this.updateAddressInput(inputGroup, ObjectLevel, ObjectLevelText);
        this.resetAddressInputs(inputGroup);

        if (ObjectLevel !== 'Building') {
          this.setupNextAddress(this.currentObjectId, inputGroup, parentGuid);
        }
      } else {
        this.resetAddressInputs(inputGroup);
        this.address = parentGuid;
      }
    });
  }

  createAddressInputGroup() {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'address-input-group';
    inputGroup.id = 'next-address';
    inputGroup.innerHTML = `
      <label>Следующий элемент аддреса</label>
      <input type="text" list="next-address-select" class="address-select"></input>
      <datalist id="next-address-select"></datalist>
    `;
    return inputGroup;
  }

  updateAddressInput(inputGroup, inputId, placeholder) {
    const label = inputGroup.querySelector('label');
    const input = inputGroup.querySelector('input');
    const datalist = inputGroup.querySelector('datalist');
  
    inputGroup.id = inputId;
    label.textContent = placeholder;
    input.setAttribute('list', `${inputId}-select`);
    datalist.id = `${inputId}-select`;
  }

  resetAddressInputs(parentElem) {
    let nextInputGroup = parentElem.nextElementSibling;
    while (nextInputGroup) {
      const nextNextInputGroup = nextInputGroup.nextElementSibling;
      nextInputGroup.remove();
      nextInputGroup = nextNextInputGroup;
    }

  }

  async fetchAddress(query, parent) {
    try {
      let formattedQuery = query;
      if (query.includes(' ')) {
        formattedQuery = query.split(' ').slice(1).join(' ').trim();
      }
      const response = await fetchAddressSearch(formattedQuery, parent);
      return response;
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  async createPost(data) {
    try {
      await addPost(data);
      new PopupComponent({ message: 'Пост создан успешно!' }).mount(document.body);
      this.unmount();
      router.navigate('/main');
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }
}