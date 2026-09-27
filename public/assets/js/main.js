document.addEventListener('DOMContentLoaded', () => {

  // Get references to the textarea and word count display elements
  const textarea = document.getElementById('message');
  const wordCountDisplay = document.getElementById('wordCount');


  if (textarea && wordCountDisplay) {
    const maxLength = textarea.getAttribute('maxlength') || 200;

    const updateWordCount = () => {
      wordCountDisplay.textContent = `${textarea.value.length}/${maxLength}`;
    };

    textarea.addEventListener('input', updateWordCount);
    updateWordCount();
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  const errorDiv = document.getElementById('form-errors');
  const fieldErrors = document.getElementById('field-errors');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popupMessage');
  const closeBtn = document.getElementById('closePopupButton');
  popup.hidden = true;

  /* ---------------- POPUP ACCESSIBILITY ---------------- */

  let popupTimer;

  function showPopup(message, isError = false) {
    popupMessage.textContent = message;

    popup.classList.remove('fade-out');
    popup.classList.add('show');
    popup.hidden = false;

    popup.classList.toggle('error', isError);
    popupMessage.focus();

    if (popupTimer) clearTimeout(popupTimer);

    popupTimer = setTimeout(() => {
      closePopup();
    }, 6000);
  }

  function closePopup() {
    popup.hidden = true;
    form.querySelector('button[type="submit"]').focus();
  }

  closeBtn?.addEventListener('click', closePopup);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) closePopup();
  });

  /* ---------------- FORM HELPERS ---------------- */

  function clearForm() {
    form.reset();
    if (wordCountDisplay && textarea) {
      const max = textarea.getAttribute('maxlength') || 200;
      wordCountDisplay.textContent = `0/${max}`;
    }
  }

  function clearErrors() {
    errorDiv.hidden = true;
    fieldErrors.innerHTML = '';
    form.querySelectorAll('.error').forEach(f => {
      f.classList.remove('error');
      f.removeAttribute('aria-invalid');
    });
  }

  function addError(field, message, errors) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    errors.push(message);
  }

  /* ---------------- FORM SUBMIT ---------------- */

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const errors = [];

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const service = document.getElementById('service');
    const message = form.querySelector('#message');

    if (!name.value) addError(name, 'Name is required.', errors);
    else if (name.value.length < 2 || name.value.length > 50) addError(name, 'Name must be between 2 and 50 characters.', errors);
    else if (!/^[A-Za-z\s]+$/.test(name.value)) addError(name, 'Name should contain letters and spaces only.', errors);

    if (!email.value) addError(email, 'Email is required.', errors);
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value))
      addError(email, 'Please enter a valid email address.', errors);

    // Service validation
    if (!service.value) {
      errors.push('Service selection is required.');
      service.classList.add('error');
    }
    
    if (!message.value) addError(message, 'Message is required.', errors);
    else if (message.value.length < 10 || message.value.length > 200)
      addError(message, 'Message must be between 10 and 200 characters.', errors);

    if (errors.length) {
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        fieldErrors.appendChild(li);
      });
      errorDiv.hidden = false;
      errorDiv.focus();
      return;
    }

    showPopup('Your message has been sent successfully!');
    clearForm();
  });
});
