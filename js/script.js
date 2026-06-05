document.addEventListener('DOMContentLoaded', () => {

    // ==================== Loading Screen ====================
    const loader = document.getElementById('loader');
    const hero = document.getElementById('hero');

    function removeLoader() {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => { loader.style.display = 'none'; }, 900);
        }
    }

    if (document.readyState === 'complete') {
        removeLoader();
    } else {
        window.addEventListener('load', removeLoader);
        setTimeout(removeLoader, 3000);
    }

    // ==================== Hero Parallax ====================
    if (hero) {
        hero.classList.add('hero-parallax');
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (scrollY < window.innerHeight) {
                const translateY = scrollY * 0.35;
                hero.style.transform = `translateY(${translateY}px)`;
            }
        }, { passive: true });
    }

    // ==================== Navbar Scroll Effect ====================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        if (scrollY > 50) {
            navbar.style.background = 'var(--color-glass)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.background = 'var(--color-glass)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ==================== Scroll to Top ====================
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== Dark Mode Toggle ====================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==================== Scroll Progress Bar ====================
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // ==================== Particles ====================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 30;
        const colors = ['#c8a882', '#d4b896', '#e8d5c0', '#b89a78'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = '0';
            particlesContainer.appendChild(particle);
        }
    }

    // ==================== SPA Hash Router ====================
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('[data-route]');
    const navContainer = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const pageTitles = {
        'hem': 'Salong Wivex | Frisör i Sundsvall',
        'om-oss': 'Om oss | Salong Wivex',
        'tjanster': 'Tjänster | Salong Wivex',
        'galleri': 'Galleri | Salong Wivex',
        'kontakt': 'Kontakt | Salong Wivex',
        'boka-tid': 'Boka tid | Salong Wivex',
        'admin': 'Admin | Salong Wivex'
    };

    let currentRoute = null;
    let isAnimating = false;

    function navigateTo(route) {
        if (isAnimating) return;
        isAnimating = true;

        const currentActive = document.querySelector('.page.active');
        const target = document.querySelector(`[data-page="${route}"]`);
        if (!target) { isAnimating = false; return; }

        navLinks.forEach(l => l.classList.remove('active'));

        if (currentActive && currentActive !== target) {
            currentActive.style.animation = 'none';
            void currentActive.offsetWidth;
            currentActive.classList.remove('active');
        }

        target.classList.add('active');
        target.style.animation = 'none';
        void target.offsetWidth;
        target.style.animation = 'pageEnter 0.6s ease forwards';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) activeLink.classList.add('active');

        document.title = pageTitles[route] || pageTitles['hem'];

        setTimeout(() => {
            target.querySelectorAll('.animate').forEach(el => {
                el.classList.remove('visible');
                void el.offsetWidth;
                el.classList.add('visible');
            });
            isAnimating = false;
        }, 100);
    }

    function handleRoute() {
        let route = window.location.hash.replace('#', '') || 'hem';
        const validRoutes = Object.keys(pageTitles);
        if (!validRoutes.includes(route)) route = 'hem';
        if (route === currentRoute) return;
        currentRoute = route;
        navigateTo(route);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.dataset.route;
            if (route) {
                window.location.hash = route;
                if (navToggle) {
                    navToggle.classList.remove('active');
                    navContainer.classList.remove('active');
                }
            }
        });
    });

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // ==================== Mobile Navigation Toggle ====================
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active') && !e.target.closest('.nav-container')) {
                navToggle.classList.remove('active');
                navContainer.classList.remove('active');
            }
        });
    }

    // ==================== Scroll Reveal Animations ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate').forEach(el => revealObserver.observe(el));

    // ==================== Image Blur-Up Loading ====================
    document.querySelectorAll('.gallery-img img').forEach(img => {
        if (img.complete) {
            img.setAttribute('data-loaded', '');
        } else {
            img.addEventListener('load', () => img.setAttribute('data-loaded', ''), { once: true });
            img.addEventListener('error', () => img.setAttribute('data-loaded', ''), { once: true });
        }
    });

    // ==================== Stats Counter ====================
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;
        const duration = 2000;
        const startTime = performance.now();
        const suffix = el.dataset.target === '98' ? '%' : '+';

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target === 98) {
                el.textContent = current + '%';
            } else {
                el.textContent = current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target === 98) {
                    el.textContent = target + '%';
                } else {
                    el.textContent = target + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => observer.observe(el));
    }

    // ==================== Testimonials Carousel ====================
    let testimonialTimer = null;

    function initTestimonialCarousel() {
        const track = document.getElementById('testimonialTrack');
        const dotsContainer = document.getElementById('testimonialDots');
        if (!track || !dotsContainer) return;
        const cards = track.querySelectorAll('.testimonial-card');
        const dots = dotsContainer.querySelectorAll('.dot');
        const totalCards = cards.length;
        if (totalCards === 0) return;

        let idx = 0;

        function goTo(i) {
            idx = (i + totalCards) % totalCards;
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach((d, j) => d.classList.toggle('active', j === idx));
        }

        function start() {
            stop();
            testimonialTimer = setInterval(() => goTo(idx + 1), 5000);
        }

        function stop() {
            if (testimonialTimer) { clearInterval(testimonialTimer); testimonialTimer = null; }
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goTo(i); start(); });
        });

        track.addEventListener('mouseenter', stop);
        track.addEventListener('mouseleave', start);

        goTo(0);
        start();
    }

    initTestimonialCarousel();

    // ==================== FAB Booking Button ====================
    const fabBtn = document.getElementById('fabBooking');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            window.location.hash = 'boka-tid';
        });
    }

    // ==================== Gallery Lightbox ====================
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close">&times;</button><div class="lightbox-content"></div>';
    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector('.lightbox-content');

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        lightboxContent.innerHTML = '';

        const img = item.querySelector('img');
        if (img && img.src) {
            const clone = document.createElement('img');
            clone.src = img.src;
            clone.alt = img.alt || 'Förstorad bild';
            lightboxContent.appendChild(clone);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = '';
        document.body.style.overflow = '';
    }

    // ==================== Opening Hours Status ====================
    const hours = {
        1: { open: '09:00', close: '18:00' },
        2: { open: '09:00', close: '18:00' },
        3: { open: '09:00', close: '18:00' },
        4: { open: '09:00', close: '18:00' },
        5: { open: '09:00', close: '18:00' },
        6: { open: '10:00', close: '16:00' },
        0: null
    };

    const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusToday = document.getElementById('statusToday');
    const hoursBarDot = document.getElementById('hoursBarDot');
    const hoursBarText = document.getElementById('hoursBarText');

    function getNextOpening(day, timeStr) {
        for (let i = 0; i < 7; i++) {
            const checkDay = (day + i) % 7;
            const h = hours[checkDay];
            if (h) {
                if (i === 0 && timeStr < h.open) return { day: checkDay, time: h.open };
                if (i === 0) continue;
                const dayName = dayNames[checkDay];
                return { day: checkDay, time: h.open, label: i === 1 ? 'imorgon' : dayName.toLowerCase() };
            }
        }
        return null;
    }

    function updateHoursStatus() {
        const now = new Date();
        const day = now.getDay();
        const todayHours = hours[day];
        const timeStr = now.toTimeString().slice(0, 5);

        document.querySelectorAll('.hours-day').forEach(el => {
            el.classList.remove('today');
            if (parseInt(el.dataset.day) === day) {
                el.classList.add('today');
            }
        });

        const todayName = dayNames[day];

        let barStatus = '';
        let barIsOpen = false;

        if (!todayHours) {
            statusDot.className = 'status-dot closed';
            const next = getNextOpening(day, timeStr);
            if (next) {
                const prefix = next.label === 'imorgon' ? 'imorgon' : `på ${next.label}`;
                statusText.textContent = `Stängt idag, öppnar ${prefix} ${next.time}`;
                statusToday.textContent = 'Söndagar är vi stängda.';
                barStatus = `Stängt idag – öppnar ${prefix} ${next.time}`;
            } else {
                statusText.textContent = 'Stängt idag';
                statusToday.textContent = 'Söndagar är vi stängda.';
                barStatus = 'Stängt idag';
            }
        } else {
            statusToday.textContent = `${todayName} ${todayHours.open} – ${todayHours.close}`;

            if (timeStr >= todayHours.open && timeStr < todayHours.close) {
                statusDot.className = 'status-dot open';
                statusText.textContent = 'Öppet nu';
                barIsOpen = true;
                barStatus = `Öppet nu – ${todayHours.open}–${todayHours.close}`;
            } else {
                statusDot.className = 'status-dot closed';
                const next = getNextOpening(day, timeStr);
                if (next) {
                    if (next.label === 'imorgon') {
                        statusText.textContent = `Stängt nu, öppnar imorgon ${next.time}`;
                        barStatus = `Stängt nu – öppnar imorgon ${next.time}`;
                    } else {
                        statusText.textContent = `Stängt nu, öppnar ${next.label} ${next.time}`;
                        barStatus = `Stängt nu – öppnar ${next.label} ${next.time}`;
                    }
                } else {
                    statusText.textContent = 'Stängt nu';
                    barStatus = 'Stängt nu';
                }
            }
        }

        if (hoursBarDot && hoursBarText) {
            hoursBarDot.className = 'hours-bar-dot ' + (barIsOpen ? 'open' : 'closed');
            hoursBarText.textContent = barStatus;
        }
    }

    function renderHoursDisplay() {
        document.querySelectorAll('.hours-day').forEach(el => {
            const day = parseInt(el.dataset.day);
            const timeEl = el.querySelector('.day-time');
            if (!timeEl) return;
            if (day === 0 || !hours[day]) {
                timeEl.textContent = 'Stängt';
                el.classList.add('closed');
            } else {
                timeEl.textContent = hours[day].open + ' – ' + hours[day].close;
                el.classList.remove('closed');
            }
        });
    }

    // Load saved hours from localStorage
    try {
        const savedHours = localStorage.getItem('wivexHours');
        if (savedHours) {
            const parsed = JSON.parse(savedHours);
            for (const d in parsed) {
                if (parsed[d]) hours[d] = parsed[d];
            }
        }
    } catch (e) {}

    renderHoursDisplay();
    updateHoursStatus();
    setInterval(updateHoursStatus, 60000);

    // ==================== Quote Widget ====================
    const quoteText = document.getElementById('quoteText');
    const quotes = [
        'Hår är kronan på verket.',
        'En bra frisyr förändrar allt.',
        'Skönhet börjar inifrån och ut.',
        'Ditt hår förtjänar det bästa.',
        'När håret sitter rätt sitter allt rätt.',
        'Med rätt klippning kan du erövra världen.',
        'Friskt hår, starkt självförtroende.',
        'Varje dag är en bra hårdag.',
        'Kärlek till ditt hår är kärlek till dig själv.',
        'Håret är din bästa accessoar.',
        'En frisör förändrar inte bara håret – utan hela människan.',
    ];

    if (quoteText) {
        let quoteIndex = 0;
        quoteText.textContent = quotes[0];

        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            quoteText.style.opacity = '0';
            setTimeout(() => {
                quoteText.textContent = quotes[quoteIndex];
                quoteText.style.opacity = '1';
            }, 300);
        }, 8000);
    }

    // ==================== Multi-Step Booking Form ====================
    let currentStep = 1;
    const totalSteps = 3;

    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');

    function showStep(step) {
        formSteps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`[data-form-step="${step}"]`);
        if (targetStep) targetStep.classList.add('active');

        steps.forEach(s => {
            s.classList.remove('active', 'completed');
            const stepNum = parseInt(s.dataset.step);
            if (stepNum === step) {
                s.classList.add('active');
            } else if (stepNum < step) {
                s.classList.add('completed');
            }
        });

        currentStep = step;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);
            if (next > 0 && next <= totalSteps) {
                if (currentStep === 1) {
                    const selected = document.querySelector('input[name="bookingService"]:checked');
                    if (!selected) {
                        showFormStatus('Vänligen välj en tjänst.', 'error');
                        return;
                    }
                }
                if (currentStep === 2) {
                    const date = document.getElementById('stepDate').value;
                    const time = document.getElementById('stepTime').value;
                    if (!date || !time) {
                        showFormStatus('Vänligen välj datum och tid.', 'error');
                        return;
                    }
                }
                formStatus.style.display = 'none';
                showStep(next);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            if (prevStep > 0 && prevStep <= totalSteps) {
                formStatus.style.display = 'none';
                showStep(prevStep);
            }
        });
    });

    function validateStep(step) {
        if (step === 1) {
            return document.querySelector('input[name="bookingService"]:checked') !== null;
        }
        if (step === 2) {
            const date = document.getElementById('stepDate').value;
            const time = document.getElementById('stepTime').value;
            return date && time;
        }
        return true;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const disabledOverlay = document.querySelector('.booking-disabled');
            if (disabledOverlay) {
                showFormStatus('Bokning är stängd för tillfället. Ring 060-15 21 90 för att boka.', 'error');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone) {
                showFormStatus('Vänligen fyll i namn och telefonnummer.', 'error');
                return;
            }

            if (phone.length < 6) {
                showFormStatus('Ange ett giltigt telefonnummer.', 'error');
                return;
            }

            const selectedService = document.querySelector('input[name="bookingService"]:checked');
            const service = selectedService ? selectedService.value : 'Ej vald';
            const date = document.getElementById('stepDate').value;
            const time = document.getElementById('stepTime').value;

            const submitBtn = bookingForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar...';
            submitBtn.disabled = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mailtoLink = `mailto:info@wivex.se?subject=Bokning från ${encodeURIComponent(name)}&body=${encodeURIComponent(
                    `Namn: ${name}
Telefon: ${phone}
E-post: ${email || 'Ej angiven'}
Tjänst: ${service}
Datum: ${date}
Tid: ${time || 'Ej vald'}
Meddelande: ${message || 'Inget meddelande'}`
                )}`;

                showFormStatus('Tack för din bokningsförfrågan! Vi kontaktar dig snarast för att bekräfta tiden.', 'success');
                bookingForm.reset();
                showStep(1);
                window.location.href = mailtoLink;
            } catch (err) {
                showFormStatus('Något gick fel. Försök igen eller ring oss på 060-15 21 90.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block';
        if (type === 'success') {
            setTimeout(() => { formStatus.style.display = 'none'; }, 8000);
        }
    }

    // ==================== Set min date for booking ====================
    const dateInput = document.getElementById('stepDate');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    // ==================== Admin Dashboard ====================
    const ADMIN_PASSWORD = atob('V2l2ZXgyMDI2'); // Wivex2026

    const DEFAULT_SERVICES = [
        { id: 's1', name: 'Damklippning', desc: 'Klippning, tvätt och styling med professionella produkter.', price: 'Från 450 kr', icon: 'fa-cut' },
        { id: 's2', name: 'Herrklippning', desc: 'Klippning och styling med maskin och sax.', price: 'Från 350 kr', icon: 'fa-cut' },
        { id: 's3', name: 'Färgning', desc: 'Hel- och slingfärgning med högkvalitativa färger.', price: 'Från 800 kr', icon: 'fa-palette' },
        { id: 's4', name: 'Slingning', desc: 'Balayage, slingor och nyanser för ett naturligt resultat.', price: 'Från 900 kr', icon: 'fa-highlighter' },
        { id: 's5', name: 'Styling', desc: 'Festfrisyrer, bröllopsstyling och uppsättningar.', price: 'Från 400 kr', icon: 'fa-magic' },
        { id: 's6', name: 'Hårbehandling', desc: 'Återfuktande och reparerande behandlingar för friskt hår.', price: 'Från 300 kr', icon: 'fa-spa' }
    ];

    const DEFAULT_TESTIMONIALS = [
        { id: 't1', name: 'Anders M.', text: 'Bästa herrfrisören i Sundsvall! Alltid lika nöjd med resultatet, otroligt proffsiga och lyhörda. Rekommenderas varmt!', subtitle: 'stamkund sedan 2021' },
        { id: 't2', name: 'Erik J.', text: 'Fantastiskt bemötande och proffsigt utfört! Gick från långt till kort och blev så nöjd. Miljön är riktigt trevlig och avslappnad.', subtitle: 'rekommenderar salongen' },
        { id: 't3', name: 'Magnus P.', text: 'Äntligen hittat rätt herrsalong i Sundsvall! Duktiga på styling och alltid lyhörda för vad man vill ha. Bokar alltid tid här nu.', subtitle: 'nöjd kund' }
    ];

    let siteData = null;

    function initSiteData() {
        try {
            const stored = localStorage.getItem('wivexSiteData');
            if (stored) {
                siteData = JSON.parse(stored);
                return;
            }
        } catch (e) {}

        siteData = {
            services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)),
            testimonials: JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS))
        };
        localStorage.setItem('wivexSiteData', JSON.stringify(siteData));
    }

    function persistSiteData() {
        localStorage.setItem('wivexSiteData', JSON.stringify(siteData));
    }

    function renderServicesGrid() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        grid.innerHTML = siteData.services.map(s => `
            <div class="service-card glass animate scale-in">
                <div class="service-icon"><i class="fas ${s.icon}"></i></div>
                <h3>${escapeHtml(s.name)}</h3>
                <p>${escapeHtml(s.desc)}</p>
                <div class="service-footer">
                    <span class="price">${escapeHtml(s.price)}</span>
                    <a href="#boka-tid" class="service-book">Boka <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');
    }

    function renderBookingServices() {
        const container = document.getElementById('bookingServices');
        if (!container) return;
        container.innerHTML = siteData.services.map(s => {
            const val = s.name.toLowerCase().replace(/\s+/g, '');
            return `
                <label class="booking-service-option">
                    <input type="radio" name="bookingService" value="${escapeHtml(val)}"${siteData.services[0].id === s.id ? ' required' : ''}>
                    <span class="booking-service-card glass">
                        <i class="fas ${s.icon}"></i>
                        <strong>${escapeHtml(s.name)}</strong>
                        <small>${escapeHtml(s.price)}</small>
                    </span>
                </label>
            `;
        }).join('');
    }

    function renderTestimonialsTrack() {
        const track = document.getElementById('testimonialTrack');
        const dots = document.getElementById('testimonialDots');
        if (!track) return;
        track.innerHTML = siteData.testimonials.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <p>"${escapeHtml(t.text)}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar"><i class="fas fa-user"></i></div>
                    <div>
                        <strong>${escapeHtml(t.name)}</strong>
                        <span>${escapeHtml(t.subtitle)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        if (dots) {
            dots.innerHTML = siteData.testimonials.map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join('');
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function applySiteData() {
        renderServicesGrid();
        renderBookingServices();
        renderTestimonialsTrack();
        renderHoursDisplay();
        reobserveAnimations();
        const dateInput = document.getElementById('stepDate');
        if (dateInput) {
            dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
    }

    function reobserveAnimations() {
        document.querySelectorAll('.animate:not(.observed)').forEach(el => {
            el.classList.add('observed');
            revealObserver.observe(el);
        });
    }

    // ---- Admin Login & Dashboard ----
    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const adminLogoutBtn = document.getElementById('adminLogout');

    function showAdminLogin() {
        if (adminLogin) adminLogin.style.display = 'block';
        if (adminDashboard) adminDashboard.style.display = 'none';
        sessionStorage.removeItem('wivexAdmin');
    }

    function showAdminDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        sessionStorage.setItem('wivexAdmin', '1');
        renderAdminServicesTable();
        renderAdminTestimonialsTable();
        loadAdminHours();
        loadAdminContact();
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPassword.value === ADMIN_PASSWORD) {
                showAdminDashboard();
                adminError.style.display = 'none';
                adminPassword.value = '';
            } else {
                adminError.textContent = 'Fel lösenord. Försök igen.';
                adminError.style.display = 'block';
                adminPassword.value = '';
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            showAdminLogin();
        });
    }

    // Auto-logout when leaving admin page
    window.addEventListener('hashchange', () => {
        const route = window.location.hash.replace('#', '') || 'hem';
        if (route !== 'admin') {
            sessionStorage.removeItem('wivexAdmin');
        }
    });

    // Check session on admin page load
    function checkAdminSession() {
        if (sessionStorage.getItem('wivexAdmin') === '1') {
            showAdminDashboard();
        } else {
            showAdminLogin();
        }
    }

    // ---- Admin Panel Tabs ----
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById('panel-' + tab.dataset.tab);
            if (panel) panel.classList.add('active');
        });
    });

    // ---- Admin Flash Messages ----
    function adminFlash(msg, type) {
        const el = document.createElement('div');
        el.className = 'admin-flash ' + type;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; setTimeout(() => el.remove(), 300); }, 2500);
    }

    // ---- Admin: Services ----
    function renderAdminServicesTable() {
        const tbody = document.getElementById('adminServicesBody');
        if (!tbody) return;
        tbody.innerHTML = siteData.services.map(s => `
            <tr>
                <td><i class="fas ${s.icon}" style="margin-right:6px;color:var(--color-accent)"></i>${escapeHtml(s.name)}</td>
                <td>${escapeHtml(s.desc)}</td>
                <td>${escapeHtml(s.price)}</td>
                <td>${escapeHtml(s.icon)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-sm btn-edit" onclick="adminEditService('${s.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-sm btn-danger" onclick="adminDeleteService('${s.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // These need to be global for onclick handlers
    window.adminEditService = function(id) {
        const s = siteData.services.find(x => x.id === id);
        if (!s) return;
        showServiceModal(s);
    };

    window.adminDeleteService = function(id) {
        if (!confirm('Ta bort denna tjänst?')) return;
        siteData.services = siteData.services.filter(x => x.id !== id);
        persistSiteData();
        renderAdminServicesTable();
        renderServicesGrid();
        renderBookingServices();
        adminFlash('Tjänsten har tagits bort', 'success');
        pushToGitHub(false);
    };

    const serviceModalHTML = `
        <div class="admin-modal-overlay" id="serviceModalOverlay">
            <div class="admin-modal">
                <h3 id="serviceModalTitle">Lägg till tjänst</h3>
                <div class="form-group">
                    <label>Namn</label>
                    <input type="text" id="svcName" placeholder="t.ex. Herrklippning">
                </div>
                <div class="form-group">
                    <label>Beskrivning</label>
                    <textarea id="svcDesc" rows="2" placeholder="Kort beskrivning av tjänsten"></textarea>
                </div>
                <div class="form-group">
                    <label>Pris</label>
                    <input type="text" id="svcPrice" placeholder="t.ex. Från 350 kr">
                </div>
                <div class="form-group">
                    <label>Ikon</label>
                    <select id="svcIcon" class="admin-icon-select">
                        <option value="fa-cut">✂️ Klippning (fa-cut)</option>
                        <option value="fa-palette">🎨 Färg (fa-palette)</option>
                        <option value="fa-highlighter">🖍️ Slingning (fa-highlighter)</option>
                        <option value="fa-magic">✨ Styling (fa-magic)</option>
                        <option value="fa-spa">🌸 Behandling (fa-spa)</option>
                        <option value="fa-user">👤 Hårborttagning (fa-user)</option>
                        <option value="fa-hand-sparkles">🤲 Handvård (fa-hand-sparkles)</option>
                        <option value="fa-child">👶 Barnklippning (fa-child)</option>
                        <option value="fa-crown">👑 Premium (fa-crown)</option>
                        <option value="fa-bolt">⚡ Snabbklipp (fa-bolt)</option>
                        <option value="fa-leaf">🌿 Naturlig (fa-leaf)</option>
                        <option value="fa-star">⭐ Övrigt (fa-star)</option>
                    </select>
                </div>
                <div class="admin-modal-actions">
                    <button class="btn-outline" id="serviceModalCancel">Avbryt</button>
                    <button class="btn-primary" id="serviceModalSave">Spara</button>
                </div>
            </div>
        </div>
    `;

    // Inject modal HTML once
    if (!document.getElementById('serviceModalOverlay')) {
        document.body.insertAdjacentHTML('beforeend', serviceModalHTML);
    }

    let editingServiceId = null;

    function showServiceModal(svc) {
        const overlay = document.getElementById('serviceModalOverlay');
        const title = document.getElementById('serviceModalTitle');
        const nameInput = document.getElementById('svcName');
        const descInput = document.getElementById('svcDesc');
        const priceInput = document.getElementById('svcPrice');
        const iconInput = document.getElementById('svcIcon');

        if (svc) {
            editingServiceId = svc.id;
            title.textContent = 'Redigera tjänst';
            nameInput.value = svc.name;
            descInput.value = svc.desc;
            priceInput.value = svc.price;
            iconInput.value = svc.icon;
        } else {
            editingServiceId = null;
            title.textContent = 'Lägg till tjänst';
            nameInput.value = '';
            descInput.value = '';
            priceInput.value = '';
            iconInput.value = 'fa-cut';
        }
        overlay.classList.add('active');
    }

    document.getElementById('serviceModalCancel').addEventListener('click', () => {
        document.getElementById('serviceModalOverlay').classList.remove('active');
    });

    document.getElementById('serviceModalSave').addEventListener('click', () => {
        const name = document.getElementById('svcName').value.trim();
        const desc = document.getElementById('svcDesc').value.trim();
        const price = document.getElementById('svcPrice').value.trim();
        const icon = document.getElementById('svcIcon').value.trim();
        if (!name || !desc || !price || !icon) {
            adminFlash('Fyll i alla fält', 'error');
            return;
        }
        if (editingServiceId) {
            const s = siteData.services.find(x => x.id === editingServiceId);
            if (s) { s.name = name; s.desc = desc; s.price = price; s.icon = icon; }
            adminFlash('Tjänsten har uppdaterats', 'success');
        } else {
            const newId = 's' + Date.now();
            siteData.services.push({ id: newId, name, desc, price, icon });
            adminFlash('Tjänsten har lagts till', 'success');
        }
        persistSiteData();
        renderAdminServicesTable();
        renderServicesGrid();
        renderBookingServices();
        document.getElementById('serviceModalOverlay').classList.remove('active');
        pushToGitHub(false);
    });

    // Close modal on overlay click
    document.getElementById('serviceModalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.remove('active');
        }
    });

    document.getElementById('adminAddService').addEventListener('click', () => showServiceModal(null));

    // ---- Admin: Testimonials ----
    function renderAdminTestimonialsTable() {
        const tbody = document.getElementById('adminTestimonialsBody');
        if (!tbody) return;
        tbody.innerHTML = siteData.testimonials.map(t => `
            <tr>
                <td><strong>${escapeHtml(t.name)}</strong></td>
                <td>${escapeHtml(t.text.substring(0, 60))}${t.text.length > 60 ? '...' : ''}</td>
                <td>${escapeHtml(t.subtitle)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-sm btn-edit" onclick="adminEditTestimonial('${t.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-sm btn-danger" onclick="adminDeleteTestimonial('${t.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.adminEditTestimonial = function(id) {
        const t = siteData.testimonials.find(x => x.id === id);
        if (!t) return;
        showTestimonialModal(t);
    };

    window.adminDeleteTestimonial = function(id) {
        if (!confirm('Ta bort denna kundröst?')) return;
        siteData.testimonials = siteData.testimonials.filter(x => x.id !== id);
        persistSiteData();
        renderAdminTestimonialsTable();
        renderTestimonialsTrack();
        initTestimonialCarousel();
        adminFlash('Kundrösten har tagits bort', 'success');
        pushToGitHub(false);
    };

    const testimonialModalHTML = `
        <div class="admin-modal-overlay" id="testimonialModalOverlay">
            <div class="admin-modal">
                <h3 id="testimonialModalTitle">Lägg till kundröst</h3>
                <div class="form-group">
                    <label>Namn</label>
                    <input type="text" id="testName" placeholder="t.ex. Anders M.">
                </div>
                <div class="form-group">
                    <label>Text (citat)</label>
                    <textarea id="testText" rows="3" placeholder="Kundens åsikt..."></textarea>
                </div>
                <div class="form-group">
                    <label>Undertext</label>
                    <input type="text" id="testSubtitle" placeholder="t.ex. stamkund sedan 2021">
                </div>
                <div class="admin-modal-actions">
                    <button class="btn-outline" id="testimonialModalCancel">Avbryt</button>
                    <button class="btn-primary" id="testimonialModalSave">Spara</button>
                </div>
            </div>
        </div>
    `;

    if (!document.getElementById('testimonialModalOverlay')) {
        document.body.insertAdjacentHTML('beforeend', testimonialModalHTML);
    }

    let editingTestimonialId = null;

    function showTestimonialModal(t) {
        const overlay = document.getElementById('testimonialModalOverlay');
        const title = document.getElementById('testimonialModalTitle');
        const nameInput = document.getElementById('testName');
        const textInput = document.getElementById('testText');
        const subtitleInput = document.getElementById('testSubtitle');

        if (t) {
            editingTestimonialId = t.id;
            title.textContent = 'Redigera kundröst';
            nameInput.value = t.name;
            textInput.value = t.text;
            subtitleInput.value = t.subtitle;
        } else {
            editingTestimonialId = null;
            title.textContent = 'Lägg till kundröst';
            nameInput.value = '';
            textInput.value = '';
            subtitleInput.value = '';
        }
        overlay.classList.add('active');
    }

    document.getElementById('testimonialModalCancel').addEventListener('click', () => {
        document.getElementById('testimonialModalOverlay').classList.remove('active');
    });

    document.getElementById('testimonialModalSave').addEventListener('click', () => {
        const name = document.getElementById('testName').value.trim();
        const text = document.getElementById('testText').value.trim();
        const subtitle = document.getElementById('testSubtitle').value.trim();
        if (!name || !text) {
            adminFlash('Fyll i namn och text', 'error');
            return;
        }
        if (editingTestimonialId) {
            const t = siteData.testimonials.find(x => x.id === editingTestimonialId);
            if (t) { t.name = name; t.text = text; t.subtitle = subtitle; }
            adminFlash('Kundrösten har uppdaterats', 'success');
        } else {
            const newId = 't' + Date.now();
            siteData.testimonials.push({ id: newId, name, text, subtitle });
            adminFlash('Kundrösten har lagts till', 'success');
        }
        persistSiteData();
        renderAdminTestimonialsTable();
        renderTestimonialsTrack();
        initTestimonialCarousel();
        document.getElementById('testimonialModalOverlay').classList.remove('active');
        pushToGitHub(false);
    });

    document.getElementById('testimonialModalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.remove('active');
        }
    });

    document.getElementById('adminAddTestimonial').addEventListener('click', () => showTestimonialModal(null));

    // ---- Admin: Opening Hours ----
    function loadAdminHours() {
        for (let d = 1; d <= 6; d++) {
            const openInput = document.getElementById('hour' + d + 'open');
            const closeInput = document.getElementById('hour' + d + 'close');
            if (openInput && hours[d]) openInput.value = hours[d].open;
            if (closeInput && hours[d]) closeInput.value = hours[d].close;
        }
    }

    document.getElementById('adminSaveHours').addEventListener('click', () => {
        for (let d = 1; d <= 6; d++) {
            const openInput = document.getElementById('hour' + d + 'open');
            const closeInput = document.getElementById('hour' + d + 'close');
            if (openInput && closeInput) {
                hours[d] = { open: openInput.value, close: closeInput.value };
            }
        }
        localStorage.setItem('wivexHours', JSON.stringify(hours));
        renderHoursDisplay();
        updateHoursStatus();
        adminFlash('Öppettider har sparats', 'success');
        pushToGitHub(false);
    });

    // ---- Admin: Contact Info ----
    function applySavedContact() {
        const saved = localStorage.getItem('wivexContact');
        if (saved) {
            try {
                const c = JSON.parse(saved);
                applyContactToDOM(c);
                return;
            } catch (e) {}
        }
        applyContactToDOM(null);
    }

    function loadAdminContact() {
        const saved = localStorage.getItem('wivexContact');
        if (saved) {
            try {
                const c = JSON.parse(saved);
                document.getElementById('adminAddress').value = c.address || '';
                document.getElementById('adminPhone').value = c.phone || '';
                document.getElementById('adminEmail').value = c.email || '';
                applyContactToDOM(c);
                return;
            } catch (e) {}
        }
        applyContactToDOM(null);
    }

    function applyContactToDOM(c) {
        const addr = c ? c.address : 'Torggatan 16, 852 32 Sundsvall';
        const phone = c ? c.phone : '060-15 21 90';
        const email = c ? c.email : 'info@wivex.se';

        document.querySelectorAll('.contact-item p a[href^="tel"]').forEach(el => {
            el.textContent = phone;
            el.href = 'tel:+46' + phone.replace(/[^0-9]/g, '');
        });
        document.querySelectorAll('.contact-item p a[href^="mailto"]').forEach(el => {
            el.textContent = email;
            el.href = 'mailto:' + email;
        });
        document.querySelectorAll('.contact-item p:not(a)').forEach(el => {
            if (el.textContent.includes('Torggatan') || el.textContent.includes('Sundsvall')) {
                el.textContent = addr;
            }
        });
        document.querySelectorAll('.footer-contact li').forEach(el => {
            const icon = el.querySelector('i');
            if (!icon) return;
            if (icon.classList.contains('fa-map-marker-alt')) {
                el.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ' ' + addr; });
            }
            if (icon.classList.contains('fa-phone')) {
                const a = el.querySelector('a[href^="tel"]');
                if (a) { a.textContent = phone; a.href = 'tel:+46' + phone.replace(/[^0-9]/g, ''); }
            }
            if (icon.classList.contains('fa-envelope')) {
                const a = el.querySelector('a[href^="mailto"]');
                if (a) { a.textContent = email; a.href = 'mailto:' + email; }
            }
        });
        document.querySelectorAll('.hours-contact-item span').forEach(el => {
            if (el.textContent.includes('Torggatan')) el.textContent = addr;
            if (el.querySelector('a[href^="tel"]')) {
                const a = el.querySelector('a[href^="tel"]');
                if (a) { a.textContent = phone; a.href = 'tel:+46' + phone.replace(/[^0-9]/g, ''); }
            }
        });
    }

    document.getElementById('adminSaveContact').addEventListener('click', () => {
        const c = {
            address: document.getElementById('adminAddress').value.trim(),
            phone: document.getElementById('adminPhone').value.trim(),
            email: document.getElementById('adminEmail').value.trim()
        };
        localStorage.setItem('wivexContact', JSON.stringify(c));
        applyContactToDOM(c);
        adminFlash('Kontaktinformation har sparats', 'success');
        pushToGitHub(false);
    });

    // ---- GitHub Integration ----
    const GITHUB_OWNER = 'mohamadnour19';
    const GITHUB_REPO = 'wivexsalong';
    const GITHUB_FILE = 'data.json';

    function getGitHubToken() {
        return localStorage.getItem('wivexGitToken') || '';
    }

    function setGitHubToken(token) {
        localStorage.setItem('wivexGitToken', token);
    }

    function updateGitHubStatus(connected) {
        const dot = document.getElementById('githubStatusDot');
        const text = document.getElementById('githubStatusText');
        if (!dot || !text) return;
        if (connected) {
            dot.className = 'connected';
            text.textContent = 'Ansluten till GitHub';
        } else {
            dot.className = '';
            text.textContent = 'Inte ansluten';
        }
    }

    function loadGitHubUI() {
        const token = getGitHubToken();
        if (token) {
            document.getElementById('githubToken').value = token;
            updateGitHubStatus(true);
        }
    }

    document.getElementById('githubSaveToken').addEventListener('click', () => {
        const token = document.getElementById('githubToken').value.trim();
        if (!token) {
            adminFlash('Ange en GitHub-token', 'error');
            return;
        }
        setGitHubToken(token);
        updateGitHubStatus(true);
        adminFlash('GitHub-token sparad', 'success');
    });

    function collectAllData() {
        const contact = (() => {
            const saved = localStorage.getItem('wivexContact');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) {}
            }
            return { address: 'Torggatan 16, 852 32 Sundsvall', phone: '060-15 21 90', email: 'info@wivex.se' };
        })();

        const h = {};
        for (let d = 1; d <= 6; d++) {
            if (hours[d]) h[d] = { open: hours[d].open, close: hours[d].close };
        }
        h[0] = null;

        return {
            services: siteData.services,
            testimonials: siteData.testimonials,
            hours: h,
            contact: contact
        };
    }

    // ---- Auto-push to GitHub ----
    async function pushToGitHub(showFlash = true) {
        const token = getGitHubToken();
        if (!token) {
            if (showFlash) adminFlash('💾 Sparad lokalt – lägg till GitHub-token för att synka för alla', 'success');
            return false;
        }

        try {
            const data = collectAllData();
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

            let sha = null;
            try {
                const getResp = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
                    headers: { 'Authorization': 'token ' + token }
                });
                if (getResp.ok) {
                    const existing = await getResp.json();
                    sha = existing.sha;
                }
            } catch (e) {}

            const body = {
                message: 'Uppdatera data från adminpanelen',
                content: content
            };
            if (sha) body.sha = sha;

            const resp = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'token ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.message || 'Okänt fel');
            }

            const syncEl = document.getElementById('githubLastSync');
            if (syncEl) {
                syncEl.textContent = 'Senast synkroniserad: ' + new Date().toLocaleString('sv-SE');
            }
            if (showFlash) adminFlash('✅ Sparad för alla! Syns inom 1–2 min.', 'success');
            return true;
        } catch (e) {
            if (showFlash) adminFlash('✅ Sparad lokalt – GitHub-fel: ' + e.message, 'success');
            return false;
        }
    }

    document.getElementById('githubSaveAll').addEventListener('click', async () => {
        const btn = document.getElementById('githubSaveAll');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sparar...';
        btn.disabled = true;
        await pushToGitHub(true);
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    });

    // Load remote data from GitHub on startup
    async function loadRemoteData() {
        try {
            const resp = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_FILE}`);
            if (!resp.ok) return;
            const remote = await resp.json();
            if (remote.services) {
                siteData.services = remote.services;
                persistSiteData();
            }
            if (remote.testimonials) {
                siteData.testimonials = remote.testimonials;
                persistSiteData();
            }
            if (remote.hours) {
                for (const d in remote.hours) {
                    if (remote.hours[d]) hours[d] = remote.hours[d];
                }
                localStorage.setItem('wivexHours', JSON.stringify(hours));
            }
            if (remote.contact) {
                localStorage.setItem('wivexContact', JSON.stringify(remote.contact));
            }
        } catch (e) {
            // Silent fallback to local data
        }
    }

    // ---- Init admin data & apply to site ----
    initSiteData();
    applySavedContact();

    (async function initFromRemote() {
        await loadRemoteData();
        applySiteData();
        setTimeout(initTestimonialCarousel, 50);
    })();

    // ---- Admin session check ----
    if (window.location.hash === '#admin') {
        checkAdminSession();
        setTimeout(loadGitHubUI, 100);
    }

});