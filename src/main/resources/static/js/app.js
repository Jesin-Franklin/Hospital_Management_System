document.addEventListener('DOMContentLoaded', () => {

    // Toggle forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginCard = document.querySelector('.glass-card:first-child');
    const registerCard = document.getElementById('registerCard');

    if(loginForm && document.getElementById('showRegister')) {
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            loginCard.classList.add('d-none');
            registerCard.classList.remove('d-none');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            registerCard.classList.add('d-none');
            loginCard.classList.remove('d-none');
        });
    }

    // Handle Login
    const loginFormEl = document.getElementById('loginForm');
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = '/dashboard.html';
                } else {
                    const error = await response.text();
                    errorDiv.textContent = 'Invalid username or password';
                    errorDiv.classList.remove('d-none');
                }
            } catch (err) {
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    // Handle Register
    const registerFormEl = document.getElementById('registerForm');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            const name = document.getElementById('regName').value;
            const errorDiv = document.getElementById('regError');

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role, name })
                });

                if (response.ok) {
                    alert('Registration successful! Please login.');
                    document.getElementById('showLogin').click();
                } else {
                    const data = await response.json();
                    errorDiv.textContent = data.message || 'Registration failed';
                    errorDiv.classList.remove('d-none');
                }
            } catch (err) {
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    // Dashboard Load
    if(window.location.pathname.includes('dashboard.html')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if(!user) {
            window.location.href = '/';
            return;
        }

        document.getElementById('userNameDisplay').textContent = user.username + ' (' + user.role + ')';

        if(user.role === 'ADMIN') {
            loadAdminStats();
            document.getElementById('adminLinks').classList.remove('d-none');
        } else {
            document.getElementById('mainContent').innerHTML = `<h3>Welcome back, ${user.username}!</h3><p>Use the sidebar to navigate to your accessible features.</p>`;
        }
    }

    // Handle Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            window.location.href = '/';
        });
    }

});

async function loadAdminStats() {
    try {
        const stats = await apiFetch('/dashboard/admin');
        let html = `
            <div class="row">
                <div class="col-md-3">
                    <div class="glass-card stat-card mb-4">
                        <h3>${stats.totalPatients}</h3>
                        <p>Total Patients</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card stat-card mb-4">
                        <h3>${stats.totalDoctors}</h3>
                        <p>Total Doctors</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card stat-card mb-4">
                        <h3>${stats.totalAppointments}</h3>
                        <p>Appointments</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="glass-card stat-card mb-4">
                        <h3>$${stats.totalRevenue ? stats.totalRevenue.toFixed(2) : 0}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('mainContent').innerHTML = html;
    } catch (error) {
        document.getElementById('mainContent').innerHTML = `<p class="text-danger">Failed to load statistics: ${error.message}</p>`;
    }
}
