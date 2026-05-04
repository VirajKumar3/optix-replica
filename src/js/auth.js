/* eslint-disable */
/* exported authInit, userNavInit */
/* -------------------------------------------------------------------------- */
/*                            Authentication Logic                            */
/* -------------------------------------------------------------------------- */

const authInit = () => {
  const authForm = document.getElementById('auth-form');
  const nameField = document.getElementById('name-field');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleContainer = document.getElementById('auth-toggle-text');
  
  if (!authForm) {
    console.log('Auth form not found, skipping authInit');
    return;
  }

  console.log('Auth system initialized');

  let isLogin = true;

  // --- Toggle between Login and Signup ---
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'auth-toggle-btn') {
      e.preventDefault();
      isLogin = !isLogin;
      console.log('Toggling auth mode to:', isLogin ? 'Login' : 'Signup');

      if (isLogin) {
        authTitle.innerText = 'Welcome Back';
        authSubtitle.innerText = 'Please enter your details to sign in.';
        authSubmitBtn.innerText = 'Sign In';
        authToggleContainer.innerHTML = `Don't have an account? <a href="#" class="text-primary fw-bold" id="auth-toggle-btn">Sign up for free</a>`;
        nameField.classList.add('d-none');
      } else {
        authTitle.innerText = 'Create an Account';
        authSubtitle.innerText = 'Join the Optix family today.';
        authSubmitBtn.innerText = 'Create Account';
        authToggleContainer.innerHTML = `Already have an account? <a href="#" class="text-primary fw-bold" id="auth-toggle-btn">Sign in here</a>`;
        nameField.classList.remove('d-none');
      }
    }
  });

  // --- Form Submission ---
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Auth form submitted');
    
    const formData = new FormData(authForm);
    const payload = {};
    formData.forEach((value, key) => payload[key] = value);
    
    console.log('Payload:', payload);
    
    const endpoint = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/signup';
    
    authSubmitBtn.disabled = true;
    authSubmitBtn.innerText = 'Processing...';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      console.log('Response status:', res.status);
      return res.json();
    })
    .then(result => {
      console.log('API Result:', result);
      if (result.success) {
        localStorage.setItem('optix-token', result.token);
        localStorage.setItem('optix-user', JSON.stringify(result.user));
        
        showAuthToast(isLogin ? `Welcome back, ${result.user.name}!` : `Welcome to the Optix family, ${result.user.name}!`);
        
        setTimeout(() => {
          window.location.href = result.user.role === 'admin' ? 'admin.html' : 'index.html';
        }, 1500);
      } else {
        alert('Error: ' + result.message);
      }
    })
    .catch(err => {
      console.error('Auth fetch error:', err);
      alert('Could not connect to the auth server. Please ensure the backend is running.');
    })
    .finally(() => {
      authSubmitBtn.disabled = false;
      authSubmitBtn.innerText = isLogin ? 'Sign In' : 'Create Account';
    });
  });

  const showAuthToast = (msg) => {
    const toastEl = document.getElementById('auth-toast');
    if (!toastEl) return;
    document.getElementById('auth-toast-message').innerText = msg;
    if (window.bootstrap) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      alert(msg);
    }
  };
};

/* -------------------------------------------------------------------------- */
/*                            Navbar User Dropdown                            */
/* -------------------------------------------------------------------------- */

const userNavInit = () => {
  const dropdownMenu = document.getElementById('user-dropdown-menu');
  if (!dropdownMenu) return;

  const userData = localStorage.getItem('optix-user');
  
  if (userData) {
    const user = JSON.parse(userData);
    const avatarUrl = user.avatar ? `http://localhost:8080${user.avatar}` : 'assets/img/gallery/him.png';
    
    dropdownMenu.innerHTML = `
      <li class="px-3 py-2 border-bottom mb-2">
        <div style="line-height: 1.2;">
          <p class="mb-0 text-muted fw-medium" style="font-size: 10px; letter-spacing: 0.5px;">SIGNED IN AS</p>
          <h6 class="fw-bold mb-0 text-dark" style="font-size: 13px;">${user.name}</h6>
        </div>
      </li>
      ${user.role === 'admin' ? '<li><a class="dropdown-item small py-2 d-flex align-items-center" href="admin.html"><i class="me-2 text-primary" data-feather="settings" style="width:14px"></i>Admin Dashboard</a></li>' : ''}
      <li><hr class="dropdown-divider mx-3"></li>
      <li><a class="dropdown-item small py-2 text-danger fw-bold d-flex align-items-center" href="#" id="logout-btn"><i class="me-2" data-feather="log-out" style="width:14px"></i>Logout Account</a></li>
    `;

    // Initialize feather icons in dropdown
    if (window.feather) window.feather.replace();

    // Logout listener
    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('optix-token');
      localStorage.removeItem('optix-user');
      window.location.reload();
    });
  }
};
