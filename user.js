const currentUser = JSON.parse(localStorage.getItem('current_user'));

if (!currentUser) {
    alert('Zaloguj się, aby uzyskać dostęp do tej strony.');
    window.location.href = 'index.html';
}

document.getElementById('currentUserName').textContent = currentUser.username;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
});