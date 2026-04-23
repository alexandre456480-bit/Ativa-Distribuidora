/* ============================================
   ATIVA DISTRIBUIDORA - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavbar();
    initScrollReveal();
    initScrollProgress();

    // Tarefas não-críticas: executar quando idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initCustomCursor();
            initParticles();
            initCountUp();
        });
    } else {
        setTimeout(() => {
            initCustomCursor();
            initParticles();
            initCountUp();
        }, 200);
    }
});

/* --- Custom Cursor --- */
function initCustomCursor() {
    if (window.innerWidth < 768) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animate() {
        dx += (mx - dx) * 0.15;
        dy += (my - dy) * 0.15;
        dot.style.transform = `translate3d(calc(${mx}px - 50%), calc(${my}px - 50%), 0)`;
        ring.style.transform = `translate3d(calc(${dx}px - 50%), calc(${dy}px - 50%), 0)`;
        requestAnimationFrame(animate);
    }
    animate();

    document.querySelectorAll('a, button, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

/* --- Navbar --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });

        links.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }
}



/* --- Particles --- */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        container.appendChild(particle);
    }
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

/* --- Count Up Animation --- */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* --- Scroll Progress Bar --- */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
}
