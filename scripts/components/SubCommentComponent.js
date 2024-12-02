import { BaseComponent } from "./BaseComponent.js";
import { formatDate, escapeHtml } from '../utils/Utils.js';
import { deleteComment, addComment, updateComment } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { stateManager } from '../utils/StateManager.js';

export class SubCommentComponent extends BaseComponent {
  constructor(comment, postId, baseCommentRefreshAfterDeleteSubComment, baseCommentRefreshAfterAddSubComment) {
    super();
    this.postId = postId;
    this.theme = localStorage.getItem('theme');
    this.comment = comment;
    this.baseCommentRefreshAfterDeleteSubComment = baseCommentRefreshAfterDeleteSubComment;
    this.baseCommentRefreshAfterAddSubComment = baseCommentRefreshAfterAddSubComment;
    this.isDeleted = this.comment.content ? false : true;
    this.render();
  }

  render() {
    this.element.className = 'comment';
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <div class="comment-header">
        <div class="comment-info">
        ${this.isDeleted ? 
          `<p>[Комментарий удален] - ${formatDate(this.comment.deleteDate)}</p>` 
          : `<p>${escapeHtml(this.comment.author)} - ${formatDate(this.comment.createTime)}</p>` }
        ${this.comment.modifiedDate && !this.isDeleted ? `<p title="${formatDate(this.comment.modifiedDate)}" >(Изменено)</p>`: ''}
        </div>
        <div class="comment-actions">
          <button class="answer-button">Reply</button>
          ${(this.comment.authorId === stateManager.state.userId && !this.isDeleted) ? `
            <img src="./assets/${this.theme}/icons/delete.png" class="delete-icon" alt="Delete">
            <img src="./assets/${this.theme}/icons/edit.png" class="edit-icon" alt="Edit">
          ` : ''}
          ${(this.isDeleted && this.comment.subComments == 0) ?
            `<img src="./assets/${this.theme}/icons/delete.png" class="delete-icon" alt="Delete"></img>` : ''}
        </div>
      </div>
      ${this.isDeleted ? `<p class="comment-content">[Комментарий удален]</p>` : `<p class="comment-content">${this.comment.content}</p>`}
      <div class="answer-input-container" style="display: none;">
        <input type="text" class="answer-input" placeholder="Write your answer...">
        <button class="submit-answer-button">Answer</button>
        <button class="close-answer-button">Close</button>
      </div>
      <div class="edit-input-container" style="display: none;">
        <input type="text" class="edit-input" value="${this.comment.content}">
        <button class="submit-edit-button">Edit</button>
        <button class="close-edit-button">Close</button>
      </div>
      <div class="sub-comments"></div>
    `;

    this.setupAnswerButton();

    if (!this.isDeleted) {
      this.setupDeleteButton();
      this.setupEditButton();
    }

    if (this.isDeleted && this.comment.subComments == 0) {
      this.setupDeleteButton();
    }
  }

  setupEditButton() {
    const editIcon = this.element.querySelector('.edit-icon');
    const editInputContainer = this.element.querySelector('.edit-input-container');
    const submitEditButton = this.element.querySelector('.submit-edit-button');
    const editInput = this.element.querySelector('.edit-input');
    const closeEditButton = this.element.querySelector('.close-edit-button');

    if (editIcon) {
      editIcon.addEventListener('click', () => {
        editInputContainer.style.display = 'block';
      });

      closeEditButton.addEventListener('click', () => {
        editInputContainer.style.display = 'none';
      });

      submitEditButton.addEventListener('click', () => {
        const content = editInput.value;
        this.updateCommentOfPost(content);
        editInputContainer.style.display = 'none';
      });
    }
  }

  async updateCommentOfPost(content) {
    if (content) {
      try {
        await updateComment(this.comment.id, { content });
        new PopupComponent({ message: 'Comment updated successfully' }).mount(document.body);
        this.comment.content = content;
        this.comment.modifiedDate = new Date()
        this.render();
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    } 

    else {
      new PopupComponent({ message: "No content found" }).mount(document.body);
    }
  }

  setupAnswerButton() {
    const answerButton = this.element.querySelector('.answer-button');
    const answerInputContainer = this.element.querySelector('.answer-input-container');
    const submitAnswerButton = this.element.querySelector('.submit-answer-button');
    const answerInput = this.element.querySelector('.answer-input');
    const closeAnswerButton = this.element.querySelector('.close-answer-button');

    answerButton.addEventListener('click', () => {
      answerInputContainer.style.display = 'block';
    });

    closeAnswerButton.addEventListener('click', () => {
      answerInputContainer.style.display = 'none';
    });

    submitAnswerButton.addEventListener('click', () => {
      const content = answerInput.value;
      this.addCommentForPost(content);
      answerInputContainer.style.display = 'none';
      answerInput.value = '';
    });
  }

  async addCommentForPost(content) {
    if (content) {
      try {
        await addComment(this.postId, { content, parentId: this.comment.id });
        this.baseCommentRefreshAfterAddSubComment();
        new PopupComponent({ message: 'Answer added successfully' }).mount(document.body);
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    }
  }

  setupDeleteButton() {
    const deleteIcon = this.element.querySelector('.delete-icon');
    
    if (deleteIcon) {
      deleteIcon.addEventListener('click', () => {
        const response = this.deleteCommentOfPost();

        if (response) {
          if (this.comment.subComments > 0) {
            this.isDeleted = true;
            this.render();
            this.baseCommentRefreshAfterAddSubComment();
          } 
          
          else {
            this.element.remove();
          }
        }
      });
    }
  }

  async deleteCommentOfPost() {
    try {
      await deleteComment(this.comment.id);
      this.baseCommentRefreshAfterDeleteSubComment();
      new PopupComponent({ message: 'Comment deleted successfully' }).mount(document.body);
      return true;
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }
}