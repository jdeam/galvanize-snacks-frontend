const path = 'http://localhost:3000';

const fail = document.querySelector('#fail');
const failMessage = document.querySelector('#fail-message')
const failButton = document.querySelector('#fail-button');
failButton.addEventListener('click', (e) => {
  fail.style.display = 'none';
  failMessage.textContent = '';
});

const registerButton = document.querySelector('#register');

const fnField = document.querySelector('#fn');
const lnField = document.querySelector('#ln');
const emailField = document.querySelector('#email');
const pwField = document.querySelector('#pw');
const cpwField = document.querySelector('#cpw');

registerButton.addEventListener('click', (e) => {
  e.preventDefault();

  const first_name = fnField.value;
  const last_name = lnField.value;
  const email = emailField.value;
  const password = pwField.value;

  if (first_name && last_name && email && password) {
    const formData = { first_name, last_name, email, password };
    axios.post(`${path}/signup`, formData)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        failMessage.textContent = 'A user with that email already exists.';
        fail.style.display = 'block';
      });
  } else {
    let failText = 'Missing fields: '
    if (!first_name) failText += 'First Name, ';
    if (!last_name) failText += 'Last Name, ';
    if (!email) failText += 'Email, ';
    if (!password) failText += 'Password, '
    failText = failText.slice(0, -2) + '.';
    failMessage.textContent = failText;
    fail.style.display = 'block';
  }
});
