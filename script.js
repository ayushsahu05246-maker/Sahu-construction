// ===========================
// 🔥 FIREBASE CONFIGURATION
// ===========================
// IMPORTANT: Replace with YOUR Firebase credentials from Firebase Console
// Get them from: https://console.firebase.google.com → Project Settings → Your apps → Web
const firebaseConfig = {
  apiKey: "AIzaSyDfIgjtx-XJem4Yq4omeEzWt1eJxZUidGg",
  authDomain: "construction-website-496a4.firebaseapp.com",
 projectId: "construction-website-496a4",
  storageBucket: "construction-website-496a4.firebasestorage.app",
  messagingSenderId: "731350440882",
  appId: "1:731350440882:web:99827889e021b9bb0562ab",
 
};

// Initialize Firebase
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// ===========================
// Global Variables
// ===========================
let currentTestimonial = 0;
let isAutoPlaying = true;
let autoPlayInterval;

// ===========================
// Preloader
// ===========================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initAOS();
  }, 1500);
});

// ===========================
// Custom Cursor (Desktop Only)
// ===========================
const initCustomCursor = () => {
  if (window.innerWidth <= 1024) return;

  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth follow effect for outline
  const animateOutline = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';

    requestAnimationFrame(animateOutline);
  };
  animateOutline();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('hover');
    });
  });
};

// ===========================
// Scroll Progress Bar
// ===========================
const updateScrollProgress = () => {
  const scrollProgress = document.getElementById('scrollProgress');
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
};

// ===========================
// Navigation
// ===========================
const initNavigation = () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('siteHeader');

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Scroll effect on header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  const setActiveLink = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', setActiveLink);
};

// ===========================
// Smooth Scroll
// ===========================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===========================
// Parallax Effect
// ===========================
const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax-layer');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
};

// ===========================
// Portfolio Filter
// ===========================
const initPortfolioFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects with animation
      projectCards.forEach((card, index) => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          setTimeout(() => {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s ease forwards';
          }, index * 100);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
};

// ===========================
// 3D Card Tilt Effect
// ===========================
const init3DCards = () => {
  const cards = document.querySelectorAll('.card-3d');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
};

// ===========================
// Testimonials Carousel
// ===========================
const initTestimonialsCarousel = () => {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const indicatorsContainer = document.getElementById('carouselIndicators');

  if (!track || testimonials.length === 0) return;

  // Create indicators
  testimonials.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('indicator-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    indicatorsContainer.appendChild(dot);
  });

  const indicators = document.querySelectorAll('.indicator-dot');

  const updateCarousel = () => {
    const offset = -currentTestimonial * 100;
    track.style.transform = `translateX(${offset}%)`;

    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentTestimonial);
    });
  };

  const goToTestimonial = (index) => {
    currentTestimonial = index;
    updateCarousel();
    resetAutoPlay();
  };

  const nextTestimonial = () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateCarousel();
  };

  const prevTestimonial = () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateCarousel();
  };

  const startAutoPlay = () => {
    if (isAutoPlaying) {
      autoPlayInterval = setInterval(nextTestimonial, 5000);
    }
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  nextBtn.addEventListener('click', () => {
    nextTestimonial();
    resetAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevTestimonial();
    resetAutoPlay();
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });

  track.addEventListener('mouseleave', () => {
    startAutoPlay();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) {
      nextTestimonial();
      resetAutoPlay();
    }
    if (touchEndX - touchStartX > 50) {
      prevTestimonial();
      resetAutoPlay();
    }
  };

  startAutoPlay();
};

// ===========================
// 🔥 FIREBASE CONTACT FORM
// ===========================
const initFormValidation = () => {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return '';
    },
    phone: (value) => {
      if (!value.trim()) return 'Phone number is required';
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
      if (value.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
      return '';
    },
    service: (value) => {
      if (!value) return 'Please select a service';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    }
  };

  const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  };

  const clearError = (input) => {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  };

  const validateField = (input) => {
    const validator = validators[input.name];
    if (!validator) return true;

    const error = validator(input.value);
    if (error) {
      showError(input, error);
      return false;
    } else {
      clearError(input);
      return true;
    }
  };

  // Real-time validation
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', () => {
      if (input.value) {
        validateField(input);
      }
    });

    // Clear error on input
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
  });

  // 🔥 FIREBASE FORM SUBMISSION
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (input.hasAttribute('required') || input.value) {
        if (!validateField(input)) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      showFormStatus('Please fix the errors above', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      budget: formData.get('budget') || 'Not specified',
      message: formData.get('message'),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'new',
      userAgent: navigator.userAgent,
      source: 'website_contact_form'
    };

    try {
      // 🔥 Save to Firebase Firestore
      const docRef = await db.collection('contactRequests').add(data);
      
      // Success
      showFormStatus('🎉 Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
      form.reset();
      
      console.log('✅ Form submitted successfully. Document ID:', docRef.id);

      // Optional: Track with analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          event_category: 'Contact',
          event_label: data.service
        });
      }

    } catch (error) {
      showFormStatus('❌ Oops! Something went wrong. Please try again or contact us directly at info@buildpro.com', 'error');
      console.error('❌ Firebase submission error:', error);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  const showFormStatus = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    // Auto-hide after 7 seconds
    setTimeout(() => {
      formStatus.className = 'form-status';
    }, 7000);

    // Scroll to status
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
};

// ===========================
// 🔥 FIREBASE NEWSLETTER FORM
// ===========================
const initNewsletterForm = () => {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const button = form.querySelector('button');
    const originalHTML = button.innerHTML;
    button.style.pointerEvents = 'none';
    button.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>';

    try {
      // 🔥 Save to Firebase Firestore
      await db.collection('newsletter').add({
        email: email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        source: 'website_footer',
        status: 'subscribed'
      });

      alert('✅ Thank you for subscribing to our newsletter!');
      input.value = '';
      console.log('✅ Newsletter subscription saved:', email);

    } catch (error) {
      console.error('❌ Newsletter error:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      button.style.pointerEvents = 'auto';
      button.innerHTML = originalHTML;
    }
  });
};

// ===========================
// Back to Top Button
// ===========================
const initBackToTop = () => {
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// ===========================
// Lazy Loading Images
// ===========================
const initLazyLoading = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  images.forEach(img => imageObserver.observe(img));
};

// ===========================
// Animated Counter (on scroll)
// ===========================
const initAnimatedCounters = () => {
  const counters = document.querySelectorAll('.stat-value');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const animateCounter = (element) => {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    if (!target) return;

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const suffix = element.textContent.replace(/[0-9]/g, '');

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
      }
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        animateCounter(entry.target);
        entry.target.dataset.counted = 'true';
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
};

// ===========================
// Initialize AOS (Animate On Scroll)
// ===========================
const initAOS = () => {
  const elements = document.querySelectorAll('[data-aos]');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

// ===========================
// Keyboard Accessibility
// ===========================
const initAccessibility = () => {
  // Add focus outline for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Add CSS for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    body:not(.keyboard-nav) *:focus {
      outline: none;
    }
    body.keyboard-nav *:focus {
      outline: 3px solid var(--primary);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
};

// ===========================
// Performance Monitoring
// ===========================
const initPerformanceMonitoring = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('📊 Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connect Time: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);
      }, 0);
    });
  }
};

// ===========================
// Initialize All Features
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  initNavigation();
  initSmoothScroll();
  initCustomCursor();
  initParallax();
  
  // Interactive features
  initPortfolioFilter();
  init3DCards();
  initTestimonialsCarousel();
  initFormValidation();
  initNewsletterForm();
  initBackToTop();
  
  // Performance optimizations
  initLazyLoading();
  initAnimatedCounters();
  
  // Accessibility
  initAccessibility();
  
  // Monitoring (dev only)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
  }
  
  console.log('🏗️ BuildPro Construction Website - Initialized');
  console.log('🔥 Firebase Integration - Active');
  console.log('✨ All advanced features loaded successfully');
});

// ===========================
// Window Event Listeners
// ===========================
window.addEventListener('scroll', () => {
  updateScrollProgress();
});

window.addEventListener('resize', () => {
  // Reinitialize features on resize if needed
  if (window.innerWidth > 1024) {
    initCustomCursor();
  }
});

// ===========================
// Additional Utility Functions
// ===========================

// Debounce function for performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if element is in viewport
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// ===========================
// Export for module usage (optional)
// ===========================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport
  };
}
