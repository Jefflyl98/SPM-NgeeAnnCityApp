const loginButton = document.querySelector('.login-button');
const loginOverlay = document.getElementById('loginOverlay');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginCancelBtn = document.getElementById('loginCancelBtn');

loginButton.addEventListener('click', () => {
  loginOverlay.style.display = 'flex';
});

loginCancelBtn.addEventListener('click', () => {
  loginOverlay.style.display = 'none';
});

loginSubmitBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Add your login logic here
  alert(`Username: ${username}, Password: ${password}`);
  loginOverlay.style.display = 'none';
});
