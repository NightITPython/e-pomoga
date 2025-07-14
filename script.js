document.addEventListener('DOMContentLoaded', function() {
    // Показати вибір банку
    document.getElementById("applyBtn").addEventListener("click", function() {
        document.getElementById("bankSelection").style.display = "block";
        this.style.display = "none";
    });

    // Обрано банк → показати форму
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', function() {
            const bankName = this.getAttribute('data-bank');
            const bankLogo = this.querySelector('img').src;

            document.getElementById("bankSelection").style.display = "none";
            document.getElementById("dataForm").style.display = "block";

            // Добавляем лого выбранного банка в форму
            document.getElementById("formTitle").innerHTML = `
                Введіть ваші дані для <img src="${bankLogo}" style="height: 35px; vertical-align: middle; margin: 0 5px;">
            `;
        });
    });

    // Відправка форми
    document.querySelector('.submit-btn').addEventListener('click', submitForm);
});

function submitForm() {
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.innerHTML = "Відправка...";
    submitBtn.disabled = true;

    setTimeout(() => {
        alert("Дані успішно відправлені! Очікуйте рішення.");
        document.getElementById("dataForm").style.display = "none";
        document.getElementById("applyBtn").style.display = "inline-block";
        submitBtn.innerHTML = "Підтвердити";
        submitBtn.disabled = false;

        // Очищаем форму
        document.querySelectorAll('.form-control').forEach(input => {
            input.value = '';
        });
    }, 1000);
}