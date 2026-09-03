/* ===== PROIZVODI (katalog) — muško/žensko × crna/bela ===== */
const KATALOG = {
    musko: {
        crna: {
            naziv: 'Milje Classic',
            boja: 'Crna / Zlatna vez',
            cena: '4.500 RSD',
            opis: 'Crna majica kratkih rukava sa autentičnom vezom inspirisanom tradicionalnim heklanim uzorcima. Rukav ukrašen rukom pisanim natpisom "Milje".',
            modelOpcija: 'Milje Classic — Muška (Crna)',
            slike: [
                { src: 'assets/product-model.jpg', alt: 'Milje Classic — muška crna majica, model' },
                { src: 'assets/product-front.jpg', alt: 'Detalj veza na grudima' },
                { src: 'assets/product-back.jpg', alt: 'Milje majica — pogled sa leđa' },
                { src: 'assets/product-embroidery.jpg', alt: 'Makro detalj veza' },
                { src: 'assets/product-sleeve.jpg', alt: 'Natpis Milje na rukavu' },
                { src: 'assets/product-alt.jpg', alt: 'Milje Classic — dodatni kadar' }
            ]
        },
        bela: {
            naziv: 'Milje Classic',
            boja: 'Bela / Zlatna vez',
            cena: '4.500 RSD',
            opis: 'Bela muška majica sa istom autentičnom vezom inspirisanom tradicionalnim heklanim uzorcima. Rukav ukrašen rukom pisanim natpisom "Milje".',
            modelOpcija: 'Milje Classic — Muška (Bela)',
            slike: [
                { src: 'assets/product-men-white.jpg', alt: 'Milje Classic — muška bela majica, model' }
            ]
        }
    },
    zensko: {
        crna: {
            naziv: 'Milje Classic',
            boja: 'Crna / Zlatna vez',
            cena: '4.500 RSD',
            opis: 'Crna ženska majica sa istom autentičnom vezom inspirisanom tradicionalnim heklanim uzorcima. Rukav ukrašen rukom pisanim natpisom "Milje".',
            modelOpcija: 'Milje Classic — Ženska (Crna)',
            slike: [
                { src: 'assets/product-women-black.jpg', alt: 'Milje Classic — ženska crna majica, model' }
            ]
        },
        bela: {
            naziv: 'Milje Classic',
            boja: 'Bela / Zlatna vez',
            cena: '4.500 RSD',
            opis: 'Bela ženska majica sa istom autentičnom vezom inspirisanom tradicionalnim heklanim uzorcima. Rukav ukrašen rukom pisanim natpisom "Milje".',
            modelOpcija: 'Milje Classic — Ženska (Bela)',
            slike: [
                { src: 'assets/product-women-main.jpg', alt: 'Milje Classic — ženska bela majica, model' },
                { src: 'assets/product-women-white-2.jpg', alt: 'Milje Classic — ženska bela majica, drugi kadar' }
            ]
        }
    }
};

let aktivniPol = 'musko';
let aktivnaBoja = 'crna';

function renderProizvod() {
    const p = KATALOG[aktivniPol][aktivnaBoja];
    if (!p) return;

    document.getElementById('product-name').textContent = p.naziv;
    document.getElementById('product-color').textContent = p.boja;
    document.getElementById('product-price').textContent = p.cena;
    document.getElementById('product-desc').textContent = p.opis;

    document.querySelectorAll('.swatch').forEach(sw => {
        const isActive = sw.dataset.color === aktivnaBoja;
        sw.classList.toggle('active', isActive);
        sw.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const mainImg = document.getElementById('main-product-img');
    mainImg.src = p.slike[0].src;
    mainImg.alt = p.slike[0].alt;

    const thumbs = document.getElementById('gallery-thumbs');
    thumbs.innerHTML = '';
    p.slike.forEach((slika, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'thumb' + (i === 0 ? ' active' : '');
        btn.innerHTML = `<img src="${slika.src}" alt="${slika.alt}">`;
        btn.addEventListener('click', () => {
            mainImg.src = slika.src;
            mainImg.alt = slika.alt;
            thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        });
        thumbs.appendChild(btn);
    });

    const orderModel = document.getElementById('order-model');
    if (orderModel) orderModel.value = p.modelOpcija;
}

document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gender-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        aktivniPol = btn.dataset.gender;
        renderProizvod();
    });
});

document.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
        aktivnaBoja = btn.dataset.color;
        renderProizvod();
    });
});

// Kad se izabere model direktno iz forme, uskladi prikaz proizvoda gore
const orderModelSelect = document.getElementById('order-model');
if (orderModelSelect) {
    orderModelSelect.addEventListener('change', () => {
        const val = orderModelSelect.value;
        const pol = val.includes('Ženska') ? 'zensko' : 'musko';
        const boja = val.includes('Bela') ? 'bela' : 'crna';
        if (pol !== aktivniPol || boja !== aktivnaBoja) {
            aktivniPol = pol;
            aktivnaBoja = boja;
            document.querySelectorAll('.gender-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.gender === pol);
                b.setAttribute('aria-selected', b.dataset.gender === pol ? 'true' : 'false');
            });
            renderProizvod();
        }
    });
}

renderProizvod();

/* ===== FAQ AKORDEON ===== */
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('open');
            other.querySelector('.faq-answer').style.maxHeight = null;
        });
        if (!isOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

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
