document.addEventListener("scroll", function () {
    let scrollPosition = window.scrollY;
    let maxMove = 200; // Distancia máxima que las manos se moverán

    let moveAmount = Math.min(scrollPosition / 2, maxMove);

    document.querySelector(".left-hand").style.transform = `translateX(${moveAmount}px)`;
    document.querySelector(".right-hand").style.transform = `translateX(-${moveAmount}px)`;
});
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let hands = document.querySelectorAll(".hand");

    if (scrollTop > lastScrollTop) {
        // Desaparecen al hacer scroll hacia abajo
        hands.forEach(hand => hand.classList.add("hidden"));
    } else {
        // Aparecen al hacer scroll hacia arriba
        hands.forEach(hand => hand.classList.remove("hidden"));
    }

    lastScrollTop = scrollTop;
});
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in");

    function checkVisibility() {
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add("show");
            } else {
                el.classList.remove("show");
            }
        });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility();
});
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in, .video-container");

    function checkVisibility() {
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add("show");
            } else {
                el.classList.remove("show");
            }
        });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility();
});
