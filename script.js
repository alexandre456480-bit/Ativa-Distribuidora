/* ==========================================================================
   ATIVA DISTRIBUIDORA — Script Principal v2
   Hero Scroll-Driven Canvas + Particulas Organicas + GSAP Animations
   ========================================================================== */

// ---- Lucide Icons ----
lucide.createIcons();

// ==========================================================================
// NAVBAR
// ==========================================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// Mobile menu
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================================================
// HERO CANVAS — Scroll-Driven Frame Animation
// As imagens fluem conforme o usuario da scroll (como uma landing page premium)
// ==========================================================================
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
const heroSection = document.getElementById('hero');

const FRAME_COUNT = 30;
const framePath = (i) => `imagens/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

const frames = [];
let framesLoaded = 0;
let heroAnimFrame = { index: 0 };

// Pre-carrega todas as imagens
for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = framePath(i);
    img.decoding = 'async';
    img.onload = () => {
        framesLoaded++;
        if (framesLoaded === 1) {
            resizeHeroCanvas();
            drawHeroFrame();
        }
        // Quando todas carregarem, faz um draw final limpo
        if (framesLoaded === FRAME_COUNT) {
            drawHeroFrame();
        }
    };
    frames.push(img);
}

function resizeHeroCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // limitar dpr para performance
    const rect = heroSection.getBoundingClientRect();
    heroCanvas.width = rect.width * dpr;
    heroCanvas.height = rect.height * dpr;
    heroCanvas.style.width = rect.width + 'px';
    heroCanvas.style.height = rect.height + 'px';
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawHeroFrame() {
    const w = heroSection.offsetWidth;
    const h = heroSection.offsetHeight;

    heroCtx.clearRect(0, 0, w, h);

    const frameIdx = Math.min(Math.max(Math.round(heroAnimFrame.index), 0), FRAME_COUNT - 1);
    const img = frames[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Cover fit
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW, drawH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - drawH) / 2;
    } else {
        drawH = h;
        drawW = h * imgRatio;
        offsetX = (w - drawW) / 2;
        offsetY = 0;
    }

    heroCtx.imageSmoothingEnabled = true;
    heroCtx.imageSmoothingQuality = 'high';
    heroCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

// Resize
let heroResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(heroResizeTimer);
    heroResizeTimer = setTimeout(() => {
        resizeHeroCanvas();
        drawHeroFrame();
    }, 100);
});

// ==========================================================================
// GSAP
// ==========================================================================
gsap.registerPlugin(ScrollTrigger);

// -- SCROLL-DRIVEN: imagens fluem conforme scroll (dentro da hero e um pouco após) --
gsap.to(heroAnimFrame, {
    index: FRAME_COUNT - 1,
    snap: 'index',
    ease: 'none',
    scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5, // atraso suave para fluidez
        // pin: false — nao fixa a hero
    },
    onUpdate: drawHeroFrame
});

// Também roda um loop automático quando o user está no topo sem scroll (pra hero nao ficar estática)
let autoplayTween = gsap.to(heroAnimFrame, {
    index: FRAME_COUNT - 1,
    snap: 'index',
    ease: 'none',
    duration: 3,
    repeat: -1,
    yoyo: true,
    onUpdate: drawHeroFrame,
    paused: false
});

// Quando o user começa a scrollar, pausa o autoplay e ativa o scroll-driven
ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => autoplayTween.pause(),
    onLeaveBack: () => autoplayTween.play(),
});

// -- Hero entrance animation --
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
    .from('.hero-badge', { y: -20, opacity: 0, duration: 0.7 })
    .from('.title-row', { y: 30, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.4')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-buttons .btn', { y: 15, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.4')
    .from('.floating-card', {
        x: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out'
    }, '-=0.6')
    .from('.scroll-cue', { opacity: 0, duration: 1 }, '-=0.3');

// -- Scroll Reveals com GSAP (garantindo opacity 1 no final) --
document.querySelectorAll('.reveal-el').forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
            },
            onComplete: () => {
                el.classList.add('revealed');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        }
    );
});

// -- Parallax / Fake 3D about card --
const fake3dCards = document.querySelectorAll('.fake-3d');
document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    fake3dCards.forEach(card => {
        gsap.to(card, {
            rotateY: mx * 6,
            rotateX: -my * 4,
            duration: 1,
            ease: 'power1.out',
            transformPerspective: 800
        });
    });
});

// ==========================================================================
// PARTICLES CANVAS — Particulas organicas (folhas/pontos verdes e beges)
// Decorativo, fixo no fundo, combinando com a paleta
// ==========================================================================
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');

const PARTICLE_COLORS = [
    'rgba(143, 166, 122, 0.3)',  // green-500
    'rgba(168, 169, 127, 0.25)', // olive-400
    'rgba(183, 169, 124, 0.2)',  // olive-300
    'rgba(198, 187, 151, 0.18)', // beige-300
    'rgba(74, 122, 63, 0.15)',   // green-700
    'rgba(111, 143, 79, 0.2)',   // green-600
];

const particles = [];
const PARTICLE_COUNT = 45;

function resizeParticles() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

// Inicializa particulas
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1, // leve subida
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        isLeaf: Math.random() > 0.6, // 40% sao "folhinhas"
    });
}

function drawParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.rotSpeed;

        // Wraparound
        if (p.x > particlesCanvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = particlesCanvas.width + 10;
        if (p.y > particlesCanvas.height + 10) p.y = -10;
        if (p.y < -10) p.y = particlesCanvas.height + 10;

        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate(p.angle);
        pCtx.globalAlpha = p.opacity;

        if (p.isLeaf) {
            // Forma de folha estilizada (elipse achatada)
            pCtx.beginPath();
            pCtx.ellipse(0, 0, p.size * 2.5, p.size, 0, 0, Math.PI * 2);
            pCtx.fillStyle = p.color;
            pCtx.fill();
            // Nervura central
            pCtx.beginPath();
            pCtx.moveTo(-p.size * 2.2, 0);
            pCtx.lineTo(p.size * 2.2, 0);
            pCtx.strokeStyle = p.color;
            pCtx.lineWidth = 0.5;
            pCtx.stroke();
        } else {
            // Circulo suave
            pCtx.beginPath();
            pCtx.arc(0, 0, p.size, 0, Math.PI * 2);
            pCtx.fillStyle = p.color;
            pCtx.fill();
        }

        pCtx.restore();
    });

    requestAnimationFrame(drawParticles);
}

drawParticles();

// ==========================================================================
// PARALLAX SUAVE nas secoes (leve movimento no scroll)
// ==========================================================================
gsap.utils.toArray('.section-about, .section-diff').forEach(section => {
    gsap.to(section, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// -- Stat number counter animation --
ScrollTrigger.create({
    trigger: '.about-floating-stat',
    start: 'top 90%',
    once: true,
    onEnter: () => {
        const statEl = document.querySelector('.stat-number');
        if (statEl) {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: 25,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    statEl.textContent = '+' + Math.round(obj.val);
                }
            });
        }
    }
});
