(function() {
  // IIFE used to avoid global scoping issues. If something here is needed
  // globally, attach it to the window.
  const baseURL = `http://localhost:3000`;
  const submit = document.querySelector('#login');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const warning = document.querySelector('#warning');
  const warningMsg = document.querySelector('#warning-msg');
  const warningBtn = warning.querySelector('button');

  warning.style.visibility = 'hidden';
  /* Uncomment the removeItem() line for testing purposes */
  // localStorage.removeItem('authToken');
  if (localStorage.getItem('authToken')) {
    window.location.replace('grid-gallery.html');
  }

  warningBtn.addEventListener('click', (e) => {
    e.preventDefault();
    warning.style.visibility = 'hidden';
  });
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) {
      warning.style.visibility = 'visible';
      warningMsg.textContent = 'Please input an email and password.';
    } else {
      axios.post(`${baseURL}/login`, {
          email,
          password
        })
        .then((response) => {
          const token = response.headers.auth.split(' ')[1];
          localStorage.setItem('authToken', token);
          window.location.href = 'grid-gallery.html';
        })
        .catch((error) => {
          warning.style.visibility = 'visible';
          warningMsg.textContent = 'Please try a different username or password.';
        });
    }
    // Clears input fields
    emailInput.value = '';
    passwordInput.value = '';
  });

})();
