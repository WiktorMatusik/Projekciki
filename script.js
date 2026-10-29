function initUsers() {
    let users = localStorage.getItem('app_users');
    if (!users) {
        const defaultUsers = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toLocaleDateString('pl-PL')
            }
        ];
        localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }
}

initUsers();

const currentUser = JSON.parse(localStorage.getItem('current_user'));
if (currentUser) {
    if (currentUser.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'user.html';
    }
}

const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const alertMessage = document.getElementById('alertMessage');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginCard = document.querySelector('.login-card');

togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    showAlert('', false);

    if (!username || !password) {
        showAlert('Wypełnij wszystkie pola.', 'error');
        triggerShake();
        return;
    }

    const users = JSON.parse(localStorage.getItem('app_users')) || [];
    const matchedUser = users.find(u => u.username === username && u.password === password);

    if (matchedUser) {
        localStorage.setItem('current_user', JSON.stringify({
            username: matchedUser.username,
            role: matchedUser.role
        }));

        showAlert('Logowanie udane! Przekierowywanie...', 'success');
        
        setTimeout(() => {
            if (matchedUser.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        }, 800);
    } else {
        showAlert('Niepoprawny login lub hasło.', 'error');
        triggerShake();
    }
});

function showAlert(message, type) {
    if (!type) {
        alertMessage.className = 'alert hidden';
        alertMessage.textContent = '';
        return;
    }
    alertMessage.textContent = message;
    alertMessage.className = `alert ${type}`;
}

function triggerShake() {
    loginCard.classList.remove('shake');
    void loginCard.offsetWidth;
    loginCard.classList.add('shake');
}