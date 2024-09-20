// 登錄功能
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // 儲存賬號和密碼到 localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        alert('登錄成功！');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
    } else {
        alert('請輸入有效的賬號和密碼');
    }
});

// 撲克牌翻拍動畫
document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.card');
    card.addEventListener('click', function () {
        card.classList.toggle('flipped');
    });
});
