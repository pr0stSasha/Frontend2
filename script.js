
const galleryImgs = document.querySelectorAll('.gallery-img');
const imageCount = galleryImgs.length;
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
galleryImgs.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImgIndex = index;
        popupImage.src = img.src;
        imagePopup.classList.add('active');
        updateArrows();
    });
});

leftArrow.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex - 1 + imageCount) % imageCount;
        popupImage.src = galleryImgs[currentImgIndex].src;
});

rightArrow.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex + 1) % imageCount;
        popupImage.src = galleryImgs[currentImgIndex].src;
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.popup.active').classList.remove('active');
    });
});

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const formMessage = document.getElementById('formMessage');
const rules = document.querySelectorAll('.valid-list li');
const nameReq = document.getElementById('nameReq');
const phoneReq = document.getElementById('phoneReq');
const emailReq = document.getElementById('emailReq');
const messageReq = document.getElementById('messageReq');

function updateSubmitState() {
    const allValid = [...rules].every(li => li.classList.contains('valid'));
    submitBtn.disabled = !allValid;
}
contactForm.name.addEventListener('input', async (e) => {

    const name = contactForm.name.value.trim();
    updateSubmitState();

    if (!name || name.length < 2) {
        nameReq.classList.remove('valid');
        return;
    }
    showFormMessage('', '');
    nameReq.classList.add('valid');
    updateSubmitState();
});

contactForm.phone.addEventListener('input', async (e) => {

    const phone = contactForm.phone.value.trim();
    updateSubmitState();

    if(!/^\+?[78]\d{10}$/.test(phone)) {
        phoneReq.classList.remove('valid');
        return;
    }
    showFormMessage('', '');
    phoneReq.classList.add('valid');
    updateSubmitState();
});

contactForm.email.addEventListener('input', async (e) => {

    const email = contactForm.email.value.trim();
    updateSubmitState();

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailReq.classList.remove('valid');
        return;
    }
    showFormMessage('', '');
    emailReq.classList.add('valid');
    updateSubmitState();
});

contactForm.message.addEventListener('input', async (e) => {

    const message = contactForm.message.value.trim();
    updateSubmitState();

    if(message.length < 5) {
        messageReq.classList.remove('valid');
        return;
    }
    showFormMessage('', '');
    messageReq.classList.add('valid');
    updateSubmitState();
});


contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Начало обработки формы');

    const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        phone: contactForm.phone.value.trim(),
        message: contactForm.message.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    contactForm.classList.add('sending');

    try {
        const response = await fetch('https://formspree.io/f/mdkgjdgp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams(formData).toString()
        });

        console.log('Статус ответа:', response.status);

        const result = await response.json();

        if (response.ok) {
            showFormMessage('Сообщение успешно отправлено!', 'success');
            contactForm.classList.replace('sending', 'sent');
            submitBtn.textContent = 'Отправлено ✓';
            resetBtn.style.display = 'block';
            const rules = document.querySelector('.valid-list');
            const items = rules.querySelectorAll('li');
            items.forEach(li => li.classList.remove('valid'));
            Array.from(contactForm.elements).forEach(el => {
                if (el !== resetBtn) el.disabled = true;
            });
        } else {
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

    const relX = (e.clientX - centerX) / (containerRect.width / 2);
    const relY = (e.clientY - centerY) / (containerRect.height / 2);

    const maxShift = 0.03;
    const shiftX = relX * maxShift * 100;
    const shiftY = relY * maxShift * 100;

    const rotation = (relX + relY) * 10;

    svg.style.transform = `
        translate(${shiftX}%, ${shiftY}%)
        rotate(${rotation}deg)
    `;
});

container.addEventListener('mouseleave', () => {
    svg.style.transform = 'translate(0, 0) rotate(0deg)';
});