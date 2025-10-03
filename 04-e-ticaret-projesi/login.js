const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePassword.querySelector('i').classList.toggle('bi-eye');
  togglePassword.querySelector('i').classList.toggle('bi-eye-slash');
});

// Validation functions
function validateUsername(username) {
  if (!username) {
    return 'Kullanıcı adı zorunludur';
  }
  if (username.length < 3) {
    return 'Kullanıcı adı en az 3 karakter olmalıdır';
  }
  return '';
}

function validatePassword(password) {
  if (!password) {
    return 'Şifre zorunludur';
  }
  if (password.length < 6) {
    return 'Şifre en az 6 karakter olmalıdır';
  }
  return '';
}

// Clear error messages
function clearErrors() {
  usernameError.textContent = '';
  passwordError.textContent = '';
  usernameInput.classList.remove('error');
  passwordInput.classList.remove('error');
}

// Login function
async function handleLogin(credentials) {
  try {
    const response = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.token) {
      // Store token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', credentials.username);

      // Show success message
      alert('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...');

      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      alert('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

// Form submit handler
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate
  const usernameValidation = validateUsername(username);
  const passwordValidation = validatePassword(password);

  let hasError = false;

  if (usernameValidation) {
    usernameError.textContent = usernameValidation;
    usernameInput.classList.add('error');
    hasError = true;
  }

  if (passwordValidation) {
    passwordError.textContent = passwordValidation;
    passwordInput.classList.add('error');
    hasError = true;
  }

  if (hasError) return;

  // Submit login
  const credentials = { username, password };
  handleLogin(credentials);
});

// Real-time validation
usernameInput.addEventListener('blur', () => {
  const error = validateUsername(usernameInput.value.trim());
  usernameError.textContent = error;
  if (error) {
    usernameInput.classList.add('error');
  } else {
    usernameInput.classList.remove('error');
  }
});

passwordInput.addEventListener('blur', () => {
  const error = validatePassword(passwordInput.value.trim());
  passwordError.textContent = error;
  if (error) {
    passwordInput.classList.add('error');
  } else {
    passwordInput.classList.remove('error');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');

  console.log(token);

  if (token) {
    window.location.href = './index.html';
  }

});
