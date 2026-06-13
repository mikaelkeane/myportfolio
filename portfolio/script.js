/* ============================================
   MIKAEL KEANE HERMAWAN — PORTFOLIO
   Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initSmoothScroll();
  initMobileMenu();
  initActiveNavTracking();
  initLightbox();
  initDeskInteractive();
  initGalleryTouch();
});

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after revealing — no need to re-trigger
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Initial check
  updateNavbar();
}

/* ---------- Smooth Scroll for Nav Links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      closeMobileMenu();
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  toggle.classList.remove('active');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Active Nav Link Tracking ---------- */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Project Card Expand/Collapse ---------- */
function toggleProject(button) {
  const card = button.closest('.project-card');
  const isExpanded = card.classList.contains('expanded');

  // Close all other open cards
  document.querySelectorAll('.project-card.expanded').forEach((openCard) => {
    if (openCard !== card) {
      openCard.classList.remove('expanded');
      const btn = openCard.querySelector('.project-expand-btn');
      if (btn) {
        btn.textContent = '';
        btn.innerHTML = 'View Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      }
    }
  });

  // Toggle current card
  card.classList.toggle('expanded');

  if (card.classList.contains('expanded')) {
    button.innerHTML = 'Hide Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

    // Smooth scroll to card if it's partially out of view
    setTimeout(() => {
      const rect = card.getBoundingClientRect();
      if (rect.top < 80 || rect.bottom > window.innerHeight) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const scrollTarget = card.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }, 100);
  } else {
    button.innerHTML = 'View Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  }
}

/* ---------- Project Image Gallery ---------- */
function changeSlide(galleryId, direction) {
  const gallery = document.getElementById(galleryId);
  const images = gallery.querySelectorAll('.gallery-img');
  const dots = document.getElementById(galleryId + '-dots').querySelectorAll('.gallery-dot');
  
  let currentIndex = 0;
  images.forEach((img, i) => {
    if (img.classList.contains('active')) currentIndex = i;
  });

  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = images.length - 1;
  if (newIndex >= images.length) newIndex = 0;

  images[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');
  images[newIndex].classList.add('active');
  dots[newIndex].classList.add('active');
  
  // Slide the gallery track horizontally
  gallery.style.transform = `translateX(-${newIndex * 100}%)`;
}

function goToSlide(galleryId, index) {
  const gallery = document.getElementById(galleryId);
  const images = gallery.querySelectorAll('.gallery-img');
  const dots = document.getElementById(galleryId + '-dots').querySelectorAll('.gallery-dot');

  images.forEach((img) => img.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  images[index].classList.add('active');
  dots[index].classList.add('active');
  
  // Slide the gallery track horizontally
  gallery.style.transform = `translateX(-${index * 100}%)`;
}

/* ---------- Lightbox Modal ---------- */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!modal || !modalImg || !closeBtn) return;

  let currentGalleryImages = [];
  let currentImageIndex = -1;
  let currentGalleryId = null;

  // Make project images zoomable on hover/click
  document.querySelectorAll('.project-gallery img, .project-image > img').forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const gallery = img.closest('.project-gallery');
      currentGalleryId = gallery ? gallery.id : null;
      
      if (gallery) {
        currentGalleryImages = Array.from(gallery.querySelectorAll('img'));
        currentImageIndex = currentGalleryImages.indexOf(img);
      } else {
        currentGalleryImages = [img];
        currentImageIndex = 0;
      }
      
      updateLightboxContent();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent background page scroll
    });
  });

  function updateLightboxContent() {
    if (currentImageIndex < 0 || currentImageIndex >= currentGalleryImages.length) return;
    const activeImg = currentGalleryImages[currentImageIndex];
    modalImg.src = activeImg.src;
    modalImg.alt = activeImg.alt;

    // Show/hide navigation controls based on image count in the gallery
    if (currentGalleryImages.length > 1) {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    } else {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    // Sync back to behind-the-scenes gallery dots/active class
    if (currentGalleryId) {
      goToSlide(currentGalleryId, currentImageIndex);
    }
  }

  function navigateLightbox(direction) {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
      currentImageIndex = currentGalleryImages.length - 1;
    } else if (currentImageIndex >= currentGalleryImages.length) {
      currentImageIndex = 0;
    }
    updateLightboxContent();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal click listener from closing it
      navigateLightbox(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal click listener from closing it
      navigateLightbox(1);
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
      currentGalleryImages = [];
      currentImageIndex = -1;
      currentGalleryId = null;
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    // If we click outside the image and not on navigation buttons, close modal
    if (e.target === modal || e.target === closeBtn || (!e.target.closest('.lightbox-content') && !e.target.closest('.lightbox-nav'))) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  });
}

/* ---------- Interactive Desk Setup ---------- */
function initDeskInteractive() {
  const keyboard = document.querySelector('.mechanical-keyboard');
  const pc = document.querySelector('.pc-case');

  if (keyboard) {
    keyboard.addEventListener('click', () => {
      // Fast RGB animation cycle on click
      const glow = keyboard.querySelector('.keyboard-rgb-glow');
      if (glow) {
        glow.style.animationDuration = '1s';
        setTimeout(() => {
          glow.style.animationDuration = '6s';
        }, 3000);
      }
      
      // Simulate typing visual by briefly flashing key backlights
      const keys = keyboard.querySelectorAll('.key-row span');
      keys.forEach(key => {
        if (Math.random() > 0.4) {
          key.style.background = '#FF007F';
          setTimeout(() => {
            key.style.background = '';
          }, Math.random() * 400 + 100);
        }
      });
    });
  }

  if (pc) {
    pc.addEventListener('click', () => {
      // Toggle a hyper RGB mode
      const pulseGlows = pc.querySelectorAll('.rgb-pulse');
      const ringGlows = pc.querySelectorAll('.rgb-ring');
      
      pulseGlows.forEach(el => el.classList.toggle('rgb-fast-pulse'));
      ringGlows.forEach(el => el.classList.toggle('rgb-fast-pulse'));
    });
  }
}

/* ---------- Touch Swipe Navigation for Image Galleries ---------- */
function initGalleryTouch() {
  document.querySelectorAll('.project-image-gallery').forEach((galleryContainer) => {
    const gallery = galleryContainer.querySelector('.project-gallery');
    if (!gallery) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    galleryContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
    }, { passive: true });

    galleryContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    galleryContainer.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      
      // Swipe threshold of 45px to navigate slides
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          changeSlide(gallery.id, 1);
        } else {
          changeSlide(gallery.id, -1);
        }
      }
    });
  });
}
