/* ═══════════════════════════════════════════════════════════════════
   script.js — Luminary Complete Website
   ═══════════════════════════════════════════════════════════════════ */

/* ── 1. STICKY GLASSMORPHIC NAV ─────────────────────────────────────
   Adds `.scrolled` class to the nav once the user scrolls past 60px,
   which activates the frosted-glass background defined in CSS.
──────────────────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── 2. MOBILE HAMBURGER / NAV DRAWER ──────────────────────────────
   Toggles the full-screen mobile navigation drawer.
   Also prevents body scroll while the drawer is open.
──────────────────────────────────────────────────────────────────── */
const burger    = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');

  burger.setAttribute('aria-expanded', isOpen);
  mobileNav.classList.toggle('open', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);

  // Lock body scroll when drawer is visible
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Called by inline onclick on each mobile nav link
function closeMobile() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Make closeMobile available globally (used by inline onclick handlers)
window.closeMobile = closeMobile;


/* ── 3. ANIMATED STAT COUNTERS ──────────────────────────────────────
   Each `.stat-num` element has a `data-target` attribute.
   When it enters the viewport, the number counts up from 0 with an
   ease-out-quart curve. A "%" suffix is added for the satisfaction
   stat; all others get "+".
──────────────────────────────────────────────────────────────────── */

/**
 * Ease-out quart: starts fast, decelerates near the end.
 * @param {number} t - Progress value 0–1
 * @returns {number} Eased value 0–1
 */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Animates a counter element from 0 to its data-target value.
 * @param {HTMLElement} el - The element to animate
 */
function animateCounter(el) {
  const target   = +el.dataset.target;
  const duration = 2000; // ms
  const start    = performance.now();
  const suffix   = target === 97 ? '%' : '+';

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuart(progress) * target);

    el.textContent = value + suffix;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Use IntersectionObserver so counters only fire when visible
const counters = document.querySelectorAll('.stat-num[data-target]');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target); // fire once only
    }
  });
}, { threshold: 0.5 });

// Delay observation slightly so it doesn't clash with entry animations
setTimeout(() => {
  counters.forEach(counter => counterObserver.observe(counter));
}, 1400);


/* ── 4. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────
   Provides smooth scrolling behavior for all internal anchor links.
──────────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#" or empty
    if (href === '#' || href === '') return;
    
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      const navHeight = mainNav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: targetPosition - navHeight,
        behavior: 'smooth'
      });
    }
  });
});


/* ── 5. CONTACT FORM HANDLING ──────────────────────────────────────
   Handles form validation and submission with user feedback.
──────────────────────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Form input fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const serviceInput = document.getElementById('service');
const messageInput = document.getElementById('message');

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateField(input, condition) {
  if (!condition) {
    input.classList.add('error');
    return false;
  }
  input.classList.remove('error');
  return true;
}

function validateForm() {
  let isValid = true;
  
  // Validate name
  if (!validateField(nameInput, nameInput.value.trim().length > 0)) {
    isValid = false;
  }
  
  // Validate email
  if (!validateField(emailInput, validateEmail(emailInput.value.trim()))) {
    isValid = false;
  }
  
  // Validate service selection
  if (!validateField(serviceInput, serviceInput.value.trim().length > 0)) {
    isValid = false;
  }
  
  // Validate message
  if (!validateField(messageInput, messageInput.value.trim().length > 0)) {
    isValid = false;
  }
  
  return isValid;
}

// Clear errors on input
[nameInput, emailInput, serviceInput, messageInput].forEach(input => {
  input.addEventListener('input', function() {
    this.classList.remove('error');
  });
});

// Form submission
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (validateForm()) {
    // Simulate form submission (replace with actual API call)
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
      // Hide form and show success message
      contactForm.classList.add('hidden');
      formSuccess.classList.add('active');
      
      // Reset form
      contactForm.reset();
      
      // Reset button (for future use)
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Log form data (in production, this would be sent to a server)
      const formData = new FormData(contactForm);
      console.log('Form submitted:', Object.fromEntries(formData));
      
    }, 1500);
  }
});


/* ── 6. SCROLL ANIMATIONS FOR SECTIONS ─────────────────────────────
   Adds fade-in animations to sections as they enter the viewport.
──────────────────────────────────────────────────────────────────── */
const animatedSections = document.querySelectorAll(
  '.work-section, .services-section, .studio-section, .testimonials-section, .contact-section, .clients-section'
);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

animatedSections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  sectionObserver.observe(section);
});


/* ── 7. PROJECT CARD HOVER EFFECTS ─────────────────────────────────
   Enhanced hover interactions for portfolio cards.
──────────────────────────────────────────────────────────────────── */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    projectCards.forEach(c => {
      if (c !== this) {
        c.style.opacity = '0.6';
      }
    });
  });
  
  card.addEventListener('mouseleave', function() {
    projectCards.forEach(c => {
      c.style.opacity = '1';
    });
  });
});


/* ── 8. HERO PARALLAX ON MOUSE MOVE ────────────────────────────────
   Gives the hero content a very subtle tilt as the mouse moves,
   adding a sense of depth without being distracting.
──────────────────────────────────────────────────────────────────── */
const hero = document.querySelector('.hero');

if (hero) {
  window.addEventListener('mousemove', e => {
    // Normalise mouse to -0.5 → +0.5 range
    const xRatio = (e.clientX / window.innerWidth  - 0.5);
    const yRatio = (e.clientY / window.innerHeight - 0.5);

    // Apply a gentle translation (max ±3px horizontally, ±1.8px vertically)
    hero.style.transform = `translate(${xRatio * 3}px, ${yRatio * 1.8}px)`;
  }, { passive: true });
}


/* ── 9. ACTIVE NAV LINK HIGHLIGHTING ───────────────────────────────
   Highlights the navigation link corresponding to the current section.
──────────────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNavLink() {
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.color = 'var(--cream)';
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavLink);
