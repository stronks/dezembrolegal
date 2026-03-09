/* =============================================
   DEZEMBRO LEGAL - JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Mobile Menu Toggle ----
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.overlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            nav.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll to Top Button ----
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Active Nav Link ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const toggle = question.querySelector('.faq-toggle');

            // Close all other open items
            document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('open');
                    openAnswer.previousElementSibling.querySelector('.faq-toggle').classList.remove('open');
                }
            });

            answer.classList.toggle('open');
            if (toggle) toggle.classList.toggle('open');
        });
    });

    // ---- Scroll Animations (Intersection Observer) ----
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }

    // ---- Cadastro Forms ----
    const cadastroPessoaForm = document.getElementById('cadastroPessoaForm');
    if (cadastroPessoaForm) {
        cadastroPessoaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.querySelector('.cadastro-success');
            if (successMsg) {
                successMsg.classList.add('show');
                cadastroPessoaForm.style.display = 'none';
            }
        });
    }

    const cadastroAdvogadoForm = document.getElementById('cadastroAdvogadoForm');
    if (cadastroAdvogadoForm) {
        cadastroAdvogadoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.querySelector('.cadastro-success');
            if (successMsg) {
                successMsg.classList.add('show');
                cadastroAdvogadoForm.style.display = 'none';
            }
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Gallery Modal / Lightbox ----
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const modalDownload = document.getElementById('modalDownload');
        const modalCounter = document.getElementById('modalCounter');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.modal-nav.prev');
        const nextBtn = modal.querySelector('.modal-nav.next');

        let currentGallery = [];
        let currentIndex = 0;

        function openModal(galleryName, index) {
            const thumbs = document.querySelectorAll(`.gallery-thumb[data-gallery-name="${galleryName}"]`);
            currentGallery = Array.from(thumbs).map(t => t.getAttribute('data-src'));
            currentIndex = index;
            showImage();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showImage() {
            const src = currentGallery[currentIndex];
            modalImage.src = src;
            modalImage.alt = `Foto ${currentIndex + 1}`;
            modalDownload.href = src;
            modalDownload.download = src.split('/').pop();
            modalCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            showImage();
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showImage();
        }

        // Open modal on thumbnail click
        document.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const galleryName = thumb.getAttribute('data-gallery-name');
                const index = parseInt(thumb.getAttribute('data-index'), 10);
                openModal(galleryName, index);
            });
        });

        // Close
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Navigation
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

        // Download via fetch+blob for proper file download
        modalDownload.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const response = await fetch(modalDownload.href);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = modalDownload.download;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                // Fallback: open in new tab
                window.open(modalDownload.href, '_blank');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

});
