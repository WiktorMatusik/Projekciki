const currentUser = JSON.parse(localStorage.getItem('current_user'));

if (!currentUser || currentUser.role !== 'admin') {
    alert('Brak dostępu! Zaloguj się jako administrator.');
    window.location.href = 'index.html';
}

document.getElementById('adminName').textContent = currentUser.username;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
});

const addUserForm = document.getElementById('addUserForm');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');
const adminAlert = document.getElementById('adminAlert');
const userTableBody = document.getElementById('userTableBody');
const userCountElem = document.getElementById('userCount');

function getUsers() {
    return JSON.parse(localStorage.getItem('app_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('app_users', JSON.stringify(users));
}

function renderUsers() {
    const users = getUsers();
    userCountElem.textContent = users.length;
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        const isDefaultAdmin = user.username === 'admin';

        tr.innerHTML = `
            <td><strong>${escapeHtml(user.username)}</strong></td>
            <td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'Administrator' : 'Użytkownik'}</span></td>
            <td>${user.createdAt || 'Niedawno'}</td>
            <td class="text-right">
                ${isDefaultAdmin ? '<span style="color:#94a3b8; font-size:0.8rem">Główne konto</span>' : 
                `<button class="btn-delete" onclick="deleteUser('${escapeHtml(user.username)}')">Usuń</button>`}
            </td>
        `;
        userTableBody.appendChild(tr);
    });
}

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value;

    if (!username || !password) {
        showAdminAlert('Wypełnij wszystkie pola.', 'error');
        return;
    }

    const users = getUsers();
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (exists) {
        showAdminAlert('Użytkownik o takiej nazwie już istnieje!', 'error');
        return;
    }

    users.push({
        username: username,
        password: password,
        role: 'user',
        createdAt: new Date().toLocaleDateString('pl-PL')
    });

    saveUsers(users);
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    showAdminAlert(`Użytkownik "${username}" został pomyślnie dodany!`, 'success');
    renderUsers();
});

window.deleteUser = function(username) {
    if (confirm(`Czy na pewno chcesz usunąć konto użytkownika "${username}"?`)) {
        let users = getUsers();
        users = users.filter(u => u.username !== username);
        saveUsers(users);
        showAdminAlert(`Konto "${username}" zostało usunięte.`, 'success');
        renderUsers();
    }
};

function showAdminAlert(message, type) {
    adminAlert.textContent = message;
    adminAlert.className = `alert ${type}`;
    setTimeout(() => {
        adminAlert.className = 'alert hidden';
    }, 4000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

renderUsers();