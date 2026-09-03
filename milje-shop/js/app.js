/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function toggleMenu() {
    navMenu.classList.toggle('open');
    document.querySelector('.nav-toggle').classList.toggle('open');
}

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.querySelector('.nav-toggle').classList.remove('open');
    });
});

/* ===== SIZE SELECTION ===== */
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ===== FORM HANDLING ===== */
function handleOrder(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // In a real scenario, you'd send this to a server
    // For now, show success modal
    console.log('Porudžbina:', data);

    document.getElementById('success-modal').classList.remove('hidden');
    form.reset();

    // Reset size buttons
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.size-btn[data-size="M"]').classList.add('active');
}

function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Close modal on overlay click
document.getElementById('success-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ===== SCROLL ANIMATIONS ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.story-header, .story-text, .story-visual, .product-details, .why-card, .order-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===== NAVBAR ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
