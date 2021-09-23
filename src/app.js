import { authWithEmailAndPassword, getAuthForm } from './auth';
import { Question } from './question';
import './styles.css';
import { createModal, isValid } from './utils';

const form = document.getElementById('form');
const floatBtn = document.getElementById('float-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
floatBtn.addEventListener('click', openModal);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
})

function submitFormHandler(e) {
  e.preventDefault();
  
  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    };

    submitBtn.disabled = true;
    // Async request to server for save question
    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
      submitBtn.disabled = false;
    })
  }
}

function openModal() {
  createModal('Authorization', getAuthForm());
  document.getElementById('auth-form')
    .addEventListener('submit', authFormHandler, {once: true});
}

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button')
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;
  btn.disabled = true;
  authWithEmailAndPassword(email, password)
  .then(Question.fetch)
  .then(renderModalAftelAuth)
  .then( () => btn.disabled = false)
}

function renderModalAftelAuth(content) {
  if (typeof content === 'string') {
    createModal('Error', content);
  } else {
    createModal('Question list', Question.listToHTML(content));
  }
}