let carouselData = null;
let currentSlide = 0;
let slideInterval = null;
let lastUpdateTimestamp = 0; 
const POLLING_INTERVAL = 5000; 

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderCarousel();
    setInterval(checkDataChanges, POLLING_INTERVAL);
});

function fetchAndRenderCarousel() {
    const outputElement = document.getElementById('carousel-output');
    
    fetch('save_carousel.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        }
        throw new Error(`Помилка отримання даних: ${response.status}`);
    })
    .then(data => {
        carouselData = data;
        lastUpdateTimestamp = data.last_updated; 
        renderCarousel(data);
    })
    .catch((error) => {
        outputElement.innerHTML = `<p style="color: red;">Помилка завантаження каруселі: ${error.message}</p>`;
        console.error('Помилка при завантаженні каруселі:', error);
    });
}

function checkDataChanges() {
    const outputElement = document.getElementById('carousel-output');
    
    fetch(`save_carousel.php?last_updated=${lastUpdateTimestamp}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 304) {
            console.log('Дані каруселі не змінилися. Оновлення не потрібне.');
            return null;
        } else if (response.status === 200) {
            return response.json();
        }
        throw new Error(`Помилка контролю змін: ${response.status}`);
    })
    .then(data => {
        if (data) {
            console.log('Дані каруселі оновлено! Перезавантаження.');
            carouselData = data;
            lastUpdateTimestamp = data.last_updated;
            renderCarousel(data); 
            outputElement.insertAdjacentHTML('afterbegin', '<p style="color: blue;">** Карусель оновлено з сервера! **</p>');
        }
    })
    .catch((error) => {
        console.error('Помилка контролю змін:', error);
    });
}


function renderCarousel(data) {
    if (!data || !data.slides || data.slides.length === 0) {
        document.getElementById('carousel-output').innerHTML = '<p>Не вдалося завантажити дані каруселі або слайди відсутні.</p>';
        return;
    }

    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    let htmlContent = '<div class="carousel-container">';
    
    data.slides.forEach((slide, index) => {
        htmlContent += `
            <div class="carousel-slide" data-index="${index}">
                <h3>${slide.title}</h3>
                <img src="${slide.imageUrl}" alt="${slide.title}">
                <p>${slide.description}</p>
            </div>
        `;
    });
    
    htmlContent += `
        <div class="carousel-controls">
            <button class="carousel-button" onclick="changeSlide(-1)">&#10094;</button>
            <button class="carousel-button" onclick="changeSlide(1)">&#10095;</button>
        </div>
    `;
    htmlContent += '</div>';

    document.getElementById('carousel-output').innerHTML = htmlContent;

    initCarouselJS(data.speed);
}

function initCarouselJS(speed) {
    const slides = document.querySelectorAll('.carousel-slide');
    const numSlides = slides.length;
    
    if (numSlides === 0) return;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none'; 
        });
        
        currentSlide = (index + numSlides) % numSlides;
        
        slides[currentSlide].style.display = 'block';
        slides[currentSlide].classList.add('active');
    }
    
    window.changeSlide = function(n) {
        showSlide(currentSlide + n);
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide(1), speed);
        }
    }

    slideInterval = setInterval(() => changeSlide(1), speed);

    showSlide(0);
}