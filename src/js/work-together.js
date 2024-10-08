import { axios, iziToast } from '../js/libraries';

const form = document.querySelector('.work-tgt-form');
const modal = document.querySelector('[data-modal]');
const closeModalBtn = document.querySelector('[data-modal-close]');
const sendButton = document.querySelector('[data-send]');
const emailInput = form.querySelector('input[type="email"]');
const backdrop = document.querySelector('.backdrop');

const feedback = emailInput.nextElementSibling;

function updateValidationState() {
  if (emailInput.value.length > 0) {
    if (emailInput.validity.valid) {
      emailInput.classList.add('valid');
      emailInput.classList.remove('invalid');
      feedback.querySelector('.valid-feedback').style.display = 'block';
      feedback.querySelector('.invalid-feedback').style.display = 'none';
    } else {
      emailInput.classList.add('invalid');
      emailInput.classList.remove('valid');
      feedback.querySelector('.valid-feedback').style.display = 'none';
      feedback.querySelector('.invalid-feedback').style.display = 'block';
    }
  } else {
    emailInput.classList.remove('valid', 'invalid');
    feedback.querySelector('.valid-feedback').style.display = 'none';
    feedback.querySelector('.invalid-feedback').style.display = 'none';
  }
}

emailInput.addEventListener('blur', function () {
  updateValidationState();
});

function openModal() {
  modal.classList.remove('is-hidden');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.add('is-hidden');
  document.body.classList.remove('modal-open');
}

sendButton.addEventListener('click', async event => {
  event.preventDefault();
  updateValidationState();

  if (!emailInput.validity.valid) {
    iziToast.error({
      message: 'Please enter a valid email address.',
      position: 'bottomRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      messageSize: '16',
      theme: 'dark',
    });
    return;
  }

  const formData = new FormData(form);
  const comment = formData.get('comment');

  if (!comment.trim()) {
    iziToast.error({
      message: 'Comments field cannot be empty.',
      position: 'bottomRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      messageSize: '16',
      theme: 'dark',
    });
    return;
  }

  const data = {
    email: formData.get('email'),
    comment: comment,
  };

  try {
    const response = await axios.post(
      'https://portfolio-js.b.goit.study/api/requests',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      openModal();
      form.reset();
      emailInput.classList.remove('valid', 'invalid');
      feedback.querySelector('.valid-feedback').style.display = 'none';
      feedback.querySelector('.invalid-feedback').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    console.error('Error details:', error.response?.data);

    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please check your input and try again.',
      position: 'bottomRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      messageSize: '16',
      theme: 'dark',
    });
    throw error;
  }
});

closeModalBtn.addEventListener('click', closeModal);

backdrop.addEventListener('click', event => {
  if (event.target === backdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

function onScroll() {
  const title = document.querySelector('.work-tgt-title');
  const titlePosition = title.getBoundingClientRect().top;
  const screenPosition = window.innerHeight / 1.3;

  if (titlePosition < screenPosition) {
    title.classList.add('visible');
  }
}

window.addEventListener('scroll', onScroll);
