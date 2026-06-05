/* ============================================
   ATIVA DISTRIBUIDORA - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização robusta e tolerante a falhas de componentes independentes
    
    // 1. Lucide Icons (Tolerante a atrasos na CDN)
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide Icons CDN não carregou a tempo. Agendando para pós-load.');
            window.addEventListener('load', () => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                } else {
                    console.error('Falha crítica ao carregar Lucide Icons CDN.');
                }
            });
        }
    } catch (e) {
        console.error('Erro na inicialização do Lucide:', e);
    }

    // 2. Navbar & Menu Mobile
    try {
        initNavbar();
    } catch (e) {
        console.error('Erro ao inicializar Navbar:', e);
    }

    // 3. Scroll Reveal (Animações de entrada)
    try {
        initScrollReveal();
    } catch (e) {
        console.error('Erro ao inicializar Scroll Reveal:', e);
    }

    // 4. Barra de Progresso de Rolagem
    try {
        initScrollProgress();
    } catch (e) {
        console.error('Erro ao inicializar Scroll Progress:', e);
    }

    // 5. Accordion de FAQ
    try {
        initFaqAccordion();
    } catch (e) {
        console.error('Erro ao inicializar FAQ:', e);
    }

    // 6. WhatsApp Features (Tooltip & Mensagem de Link)
    try {
        initWhatsAppFeatures();
    } catch (e) {
        console.error('Erro ao inicializar WhatsApp Features:', e);
    }

    // Tarefas não-críticas: executar em segundo plano (idle)
    const runNonCritical = () => {
        try { initCustomCursor(); } catch (e) { console.warn('Erro Custom Cursor:', e); }
        try { initParticles(); } catch (e) { console.warn('Erro Particles:', e); }
        try { initCountUp(); } catch (e) { console.warn('Erro CountUp:', e); }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(runNonCritical);
    } else {
        setTimeout(runNonCritical, 200);
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

/* --- FAQ Accordion --- */
function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Fecha todos
            items.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-answer').classList.remove('open');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Abre o clicado (se não estava aberto)
            if (!isOpen) {
                item.classList.add('active');
                answer.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
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

/* --- WhatsApp Features (Tooltip & Mensagem de Link) --- */
function initWhatsAppFeatures() {
    // 1. Atualiza todos os links do WhatsApp com a mensagem personalizada
    const message = "Olá, vim pelo site e gostaria de saber mais";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/5562999789984?text=${encodedMessage}`;
    });

    // 2. Gerencia o Tooltip do Botão Flutuante
    const floatBtn = document.querySelector('.whatsapp-float');
    if (floatBtn) {
        let tooltip = floatBtn.querySelector('.whatsapp-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'whatsapp-tooltip';
            tooltip.textContent = 'Faça seu pedido hoje e entregaremos amanhã no seu estabelecimento!';
            floatBtn.appendChild(tooltip);
        }

        const runTooltipLoop = () => {
            tooltip.classList.remove('visible');
            
            const showTimeout = setTimeout(() => {
                tooltip.classList.add('visible');
            }, 20000);

            const hideTimeout = setTimeout(() => {
                tooltip.classList.remove('visible');
                runTooltipLoop();
            }, 40000);
        };

        runTooltipLoop();
    }
}
