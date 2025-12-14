document.addEventListener('DOMContentLoaded', () => {
    generateSlideInputs();
});

const DEFAULT_SPEED = 3000; 

function generateSlideInputs() {
    const numSlides = document.getElementById('num-slides').value;
    const container = document.getElementById('slides-container');
    container.innerHTML = '<h3>Контент слайдів:</h3>';

    for (let i = 1; i <= numSlides; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.style.border = '1px solid #ccc';
        slideDiv.style.padding = '10px';
        slideDiv.style.marginBottom = '10px';

        slideDiv.innerHTML = `
            <h4>Слайд #${i}</h4>
            <label for="title-${i}">Заголовок:</label>
            <input type="text" id="title-${i}" value="Заголовок ${i}" required style="width: 90%; margin-bottom: 5px;"><br>
            <label for="desc-${i}">Опис:</label>
            <textarea id="desc-${i}" required style="width: 90%; margin-bottom: 5px;">Опис слайда про EQ ${i}</textarea><br>
            <label for="image-${i}">URL Зображення:</label>
            <input type="text" id="image-${i}" value="images/image${i}.jpg" style="width: 90%;">
            <hr>
        `;
        container.appendChild(slideDiv);
    }
}

function saveCarouselData() {
    const numSlides = parseInt(document.getElementById('num-slides').value);
    
    const slides = [];

    for (let i = 1; i <= numSlides; i++) {
        slides.push({
            title: document.getElementById(`title-${i}`).value,
            description: document.getElementById(`desc-${i}`).value,
            imageUrl: document.getElementById(`image-${i}`).value
        });
    }

    const carouselData = {
        speed: DEFAULT_SPEED, 
        slides: slides
    };

    const statusElement = document.getElementById('save-status');
    statusElement.style.color = 'blue';
    statusElement.textContent = 'Збереження даних...';

    fetch('save_carousel.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carouselData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            statusElement.style.color = 'green';
            statusElement.textContent = `Успішно збережено! ${data.message}`;
            console.log('Дані каруселі збережено:', data);
        } else {
            statusElement.style.color = 'red';
            statusElement.textContent = `Помилка збереження: ${data.message}`;
            console.error('Помилка збереження:', data);
        }
    })
    .catch((error) => {
        statusElement.style.color = 'red';
        statusElement.textContent = `Помилка з'єднання: ${error.message}`;
        console.error('Помилка при виконанні fetch:', error);
    });
}