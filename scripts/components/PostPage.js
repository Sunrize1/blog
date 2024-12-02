import { BaseComponent } from "./BaseComponent.js";
import { fetchPostById, addComment } from '../utils/API.js';
import { PopupComponent } from './PopupComponent.js';
import { PostComponent } from './PostComponent.js';
import { CommentComponent } from './CommentComponent.js';

export class PostPage extends BaseComponent {
  constructor(params) {
    super();
    this.postId = params.postId;
    this.post = null;
    this.render();
  }

  render() {
    this.element.className = "container";
    this.element.innerHTML = ``;
    this.element.innerHTML = `
      <div class="post"></div>
      <div class="comments"></div>
      <div class="comment-input-container">
        <textarea id="comment-input" placeholder="Add a comment..." required></textarea>
        <button id="submit-comment-button">Add Comment</button>
      </div>
    `;

    this.fetchAndDisplayPost();
    this.setupCommentForm();
  }

  async fetchAndDisplayPost() {
    try {
      this.post = await fetchPostById(this.postId);
      this.displayPost();
      this.displayComments();
    } catch (error) {
      new PopupComponent({ message: error.message }).mount(document.body);
    }
  }

  displayPost() {
    const postContainer = this.element.querySelector('.post');
    const postComponent = new PostComponent(this.post);
    postContainer.innerHTML = ``;
    postComponent.mount(postContainer);
  }

  displayComments() {
    const commentsContainer = this.element.querySelector('.comments');
    commentsContainer.innerHTML = '';
    this.post.comments.forEach(comment => {
      const commentComponent = new CommentComponent(comment, this.postId, false);
      commentComponent.mount(commentsContainer);
    });
  }

  setupCommentForm() {
    const commentInput = this.element.querySelector('#comment-input');
    const submitCommentButton = this.element.querySelector('#submit-comment-button');

    submitCommentButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const content = commentInput.value;
      try {
        await addComment(this.postId, { content });
        new PopupComponent({ message: 'Comment added successfully' }).mount(document.body);
        this.fetchAndDisplayPost();
        commentInput.value = '';
      } catch (error) {
        new PopupComponent({ message: error.message }).mount(document.body);
      }
    });
  }
}