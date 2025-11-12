document.addEventListener('DOMContentLoaded', function () {
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const slideCount = slides.length - 1; // El último slide es una copia para el loop
    let currentIndex = 0;
    const intervalTime = 4000; // 4 segundos entre cada cambio

    // Función para mover el carrusel
    function moveCarousel() {
        currentIndex++;
        
        // Mueve el track
        carouselTrack.style.transition = 'transform 1s ease-in-out';
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Lógica para el bucle infinito (loop)
        if (currentIndex >= slideCount) {
            // Después de la transición al slide duplicado (el 4to),
            // reinicia instantáneamente al primer slide (0) sin transición visible.
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = 'translateX(0)';
                currentIndex = 0;
            }, 1000); // El timeout debe coincidir con el tiempo de la transición CSS (1s)
        }
    }

    // Iniciar el carrusel automático
    setInterval(moveCarousel, intervalTime);
});