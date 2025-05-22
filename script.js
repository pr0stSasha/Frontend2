// Галерея изображений
const galleryImgs = document.querySelectorAll('.gallery-img');
const imagePopup = document.getElementById('imagePopup');
const popupImage = document.getElementById('popupImage');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
const closeBtns = document.querySelectorAll('.close-btn');
let currentImgIndex = 0;

window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
        header.classList.add('fixed');
        document.body.style.paddingTop = `${header.offsetHeight}px`;
    } else {
        header.classList.remove('fixed');
        document.body.style.paddingTop = '0';
    }
});
// Открытие попапа с изображением
galleryImgs.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImgIndex = index;
        popupImage.src = img.src;
        imagePopup.classList.add('active');
        updateArrows();
    });
});

// Навигация по изображениям
leftArrow.addEventListener('click', () => {
    if (currentImgIndex > 0) {
        currentImgIndex--;
        popupImage.src = galleryImgs[currentImgIndex].src;
        updateArrows();
    }
});

rightArrow.addEventListener('click', () => {
    if (currentImgIndex < galleryImgs.length - 1) {
        currentImgIndex++;
        popupImage.src = galleryImgs[currentImgIndex].src;
        updateArrows();
    }
});

function updateArrows() {
    leftArrow.style.display = currentImgIndex === 0 ? 'none' : 'block';
    rightArrow.style.display = currentImgIndex === galleryImgs.length - 1 ? 'none' : 'block';
}

// Закрытие попапов
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.popup.active').classList.remove('active');
    });
});

// Форма обратной связи
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Начало обработки формы');

    // Получаем данные формы
    const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        phone: contactForm.phone.value.trim(),
        message: contactForm.message.value.trim()
    };

    // Валидация
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        showFormMessage('Все поля обязательны для заполнения', 'error');
        return;
    }

    if (!/^\+?[78]\d{10}$/.test(formData.phone)) {
        showFormMessage('Телефон должен начинаться с +7, 7 или 8 и содержать 11 цифр', 'error');
        return;
    }

    // Блокировка формы
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    contactForm.classList.add('sending');

    try {
        const response = await fetch('https://formspree.io/f/mdkgjdgp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json' // Добавлено для получения подробных ошибок
            },
            body: new URLSearchParams(formData).toString()
        });

        console.log('Статус ответа:', response.status);

        const result = await response.json(); // Пробуем распарсить тело ответа

        if (response.ok) {
            showFormMessage('Сообщение успешно отправлено!', 'success');
            contactForm.classList.replace('sending', 'sent');
            submitBtn.textContent = 'Отправлено ✓';
            resetBtn.style.display = 'block';

            // Блокируем поля формы
            Array.from(contactForm.elements).forEach(el => {
                if (el !== resetBtn) el.disabled = true;
            });
        } else {
            // Если есть ошибки от Formspree, показываем их
            const errorMessage = result.errors
                ? result.errors.map(err => err.message).join(', ')
                : 'Неизвестная ошибка';
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showFormMessage('Ошибка отправки: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
        contactForm.classList.remove('sending');
    }
});

// Сброс формы
resetBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.classList.remove('sent', 'sending');
    Array.from(contactForm.elements).forEach(el => el.disabled = false);
    submitBtn.textContent = 'Отправить';
    resetBtn.style.display = 'none';
    formMessage.textContent = '';
    formMessage.style.display = 'none';
});

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = type + '-message';
    formMessage.style.display = 'block';
}

// Таймер до диплома
const timer = document.getElementById('timer');
const targetDate = new Date('2028-06-25').getTime();

function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    timer.textContent = `${days}д ${hours}ч ${mins}м ${secs}с`;
    requestAnimationFrame(updateTimer);
}
updateTimer();

// Отложенный попап
const delayedPopup = document.getElementById('delayedPopup');

if (!localStorage.getItem('popupClosed')) {
    setTimeout(() => {
        delayedPopup.classList.add('active');
    }, 30000);
}

delayedPopup.querySelector('.close-btn').addEventListener('click', () => {
    delayedPopup.classList.remove('active');
    localStorage.setItem('popupClosed', 'true');
});

// Фиксированное меню
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
        header.classList.add('fixed');
        document.body.style.paddingTop = `${header.offsetHeight}px`;
    } else {
        header.classList.remove('fixed');
        document.body.style.paddingTop = '0';
    }
});

const svg = document.getElementById('animatedSvg');
const container = document.querySelector('.svg-container');

window.addEventListener('mousemove', (e) => {
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    // Рассчитываем относительное положение мыши (от -1 до 1)
    const relX = (e.clientX - centerX) / (containerRect.width / 2);
    const relY = (e.clientY - centerY) / (containerRect.height / 2);

    // Ограничиваем максимальное смещение (5% от размера контейнера)
    const maxShift = 0.03;
    const shiftX = relX * maxShift * 100; // В процентах
    const shiftY = relY * maxShift * 100;

    // Ограниченное вращение (макс 10 градусов)
    const rotation = (relX + relY) * 10;

    // Применяем трансформацию в процентах
    svg.style.transform = `
        translate(${shiftX}%, ${shiftY}%)
        rotate(${rotation}deg)
    `;
});

// Сброс позиции при уходе мыши
container.addEventListener('mouseleave', () => {
    svg.style.transform = 'translate(0, 0) rotate(0deg)';
});