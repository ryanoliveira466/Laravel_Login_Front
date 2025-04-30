const apiUrl = 'http://127.0.0.1:8000/api'; // adjust if needed

document.addEventListener('DOMContentLoaded', function () {
  const token = sessionStorage.getItem('token');

  // Login
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.access_token);
        window.location.href = 'home.html'; // After login, go to home
      } else {
        alert('Login failed');
      }
    });
  }

  // Register
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.access_token);
        alert('Registration successful! Please check your email and verify your account.');
        window.location.href = 'home.html';
      } else {
        alert('Registration failed');
      }
    });
  }

  // Home check if logged
  if (document.getElementById('guest')) {
    if (token) {
      document.getElementById('guest').style.display = 'none';
      document.getElementById('loggedIn').style.display = 'block';
    }
  }

  // Profile
  if (document.getElementById('profileForm')) {
    if (!token) {
      alert('Please login first.');
      window.location.href = 'login.html';
    } else {
      loadProfile();
    }

    document.getElementById('profileForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      const response = await fetch(`${apiUrl}/user/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });

      if (response.ok) {
        alert('Profile updated! If you changed email, please verify again');
      } else {
        alert('Failed to update.');
      }
    });




    //Password
    document.getElementById('changePasswordForm').addEventListener('submit', async function (e) {
      e.preventDefault();
    
      const token = sessionStorage.getItem('token');
      const current_password = document.getElementById('current_password').value;
      const new_password = document.getElementById('new_password').value;
      const new_password_confirmation = document.getElementById('new_password_confirmation').value;
    
      const response = await fetch(`${apiUrl}/user/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ current_password, new_password, new_password_confirmation })
      });
    
      const data = await response.json();
    
      if (response.ok) {
        alert('Password changed successfully!');
        document.getElementById('changePasswordForm').reset();
      } else {
        alert(data.message || 'Failed to change password.');
        console.error(data);
      }
    });
    


  }

  // Logout
  if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', function () {
      if (confirm('Are you sure?')) {
        sessionStorage.removeItem('token');
        window.location.href = 'home.html';
      }
    });
  }

});

// Load profile info
async function loadProfile() {
  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/user/my`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('name').value = data.user.name;
      document.getElementById('email').value = data.user.email;
    } else {
      alert('Failed to load profile');
    }
  } catch (error) {
    console.error(error);
    alert('Error loading profile');
  }
}
