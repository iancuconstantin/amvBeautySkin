document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".lazy-section");
    const hash = window.location.hash;

    // Crează observer-ul pentru lazy loading
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // Dacă URL-ul conține un fragment (link către o secțiune)
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            target.classList.add("visible"); // Asigură-te că secțiunea este vizibilă
            setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 300); // Scroll lin către secțiune
        }
    }
});
