const THEME_STORAGE_KEY = "rawan-theme";
const LANG_STORAGE_KEY = "rawan-lang";

const themeLabels = {
  "theme-dark": {
    icon: "🌙",
    en: "Dark",
    ar: "ليلي"
  },
  "theme-light": {
    icon: "☀️",
    en: "Light",
    ar: "نهاري"
  }
};

const languageLabels = {
  en: {
    next: "AR",
    icon: "🌐"
  },
  ar: {
    next: "EN",
    icon: "🔄"
  }
};

function safeGetFromStorage(key) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
    console.warn("Unable to access localStorage:", error);
  }
  return null;
}

function safeSetInStorage(key, value) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn("Unable to persist to localStorage:", error);
  }
}

window.addEventListener("DOMContentLoaded", function domReady() {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const languageToggle = document.getElementById("languageToggle");
  const footerText = document.querySelectorAll(".site-footer .lang");
  const scrollProgress = document.getElementById("scrollProgress");
  const particles = document.getElementById("particles");

  function updateThemeToggleDisplay(themeKey) {
    const label = themeLabels[themeKey];
    if (!label || !themeToggle) {
      return;
    }

    const iconSpan = themeToggle.querySelector(".toggle-icon");
    const textEn = themeToggle.querySelector(".toggle-text.lang-en");
    const textAr = themeToggle.querySelector(".toggle-text.lang-ar");

    if (iconSpan) iconSpan.textContent = label.icon;
    if (textEn) textEn.textContent = label.en;
    if (textAr) textAr.textContent = label.ar;
  }

  function updateLanguageToggleDisplay(langKey) {
    const label = languageLabels[langKey];
    if (!label || !languageToggle) {
      return;
    }

    const iconSpan = languageToggle.querySelector(".toggle-icon");
    const textEn = languageToggle.querySelector(".toggle-text.lang-en");
    const textAr = languageToggle.querySelector(".toggle-text.lang-ar");

    if (iconSpan) iconSpan.textContent = label.icon;
    if (textEn) textEn.textContent = langKey === "en" ? label.next : "AR";
    if (textAr) textAr.textContent = langKey === "ar" ? label.next : "EN";
  }

  function applyTheme(theme) {
    const targetTheme = theme === "theme-light" ? "theme-light" : "theme-dark";
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(targetTheme);
    safeSetInStorage(THEME_STORAGE_KEY, targetTheme);
    updateThemeToggleDisplay(targetTheme);
  }

  function applyLanguage(lang) {
    const targetLang = lang === "ar" ? "ar" : "en";
    body.classList.toggle("arabic", targetLang === "ar");
    document.documentElement.lang = targetLang;
    document.documentElement.dir = targetLang === "ar" ? "rtl" : "ltr";
    safeSetInStorage(LANG_STORAGE_KEY, targetLang);
    updateLanguageToggleDisplay(targetLang);
  }

  function initializeTheme() {
    const storedTheme = safeGetFromStorage(THEME_STORAGE_KEY);
    if (storedTheme) {
      applyTheme(storedTheme);
      return;
    }

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "theme-dark" : "theme-light");
  }

  function initializeLanguage() {
    const storedLanguage = safeGetFromStorage(LANG_STORAGE_KEY);
    if (storedLanguage) {
      applyLanguage(storedLanguage);
      return;
    }

    applyLanguage("en");
  }

  function injectYear() {
    const currentYear = String(new Date().getFullYear());
    Array.prototype.forEach.call(footerText, function update(node) {
      if (typeof node.textContent === "string") {
        node.textContent = node.textContent.replace("{{year}}", currentYear);
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function onThemeToggle() {
      const isLight = body.classList.contains("theme-light");
      applyTheme(isLight ? "theme-dark" : "theme-light");
    });
  }

  if (languageToggle) {
    languageToggle.addEventListener("click", function onLanguageToggle() {
      const isArabic = body.classList.contains("arabic");
      applyLanguage(isArabic ? "en" : "ar");
    });
  }

  // Scroll Progress Indicator
  function updateScrollProgress() {
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // Scroll-triggered Animations
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Counter Animation
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    });
  }

  // Particle System
  function createParticles() {
    if (!particles) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
      particles.appendChild(particle);
    }
  }

  // Enhanced Hover Effects
  function addHoverEffects() {
    const cards = document.querySelectorAll('.enhanced-hover, .magnetic-hover');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Smooth Scrolling for Navigation
  function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Typewriter Effect
  function addTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent)';
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // Keep cursor blinking
          setInterval(() => {
            element.style.borderRight = element.style.borderRight === 'none' ? '2px solid var(--accent)' : 'none';
          }, 500);
        }
      }, 100);
    });
  }

  // Parallax Effect for Floating Auras
  function addParallaxEffect() {
    const auras = document.querySelectorAll('.aura');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      auras.forEach((aura, index) => {
        const speed = (index + 1) * 0.1;
        aura.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }

  // Intersection Observer for Animations
  function setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger counter animation when metrics section is visible
          if (entry.target.classList.contains('metrics-grid')) {
            animateCounters();
          }
        }
      });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
  }

  // Enhanced Button Interactions
  function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
      
      button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-1px) scale(0.98)';
      });
      
      button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      });
    });
  }

  // Performance Optimization
  function optimizeAnimations() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-base', '0s');
      document.documentElement.style.setProperty('animation-duration', '0s');
    }
  }

  // Initialize all enhancements
  function initializeEnhancements() {
    updateScrollProgress();
    handleScrollAnimations();
    createParticles();
    addHoverEffects();
    addSmoothScrolling();
    addParallaxEffect();
    setupIntersectionObserver();
    addButtonEffects();
    optimizeAnimations();
  }

  // Event Listeners
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleScrollAnimations();
  });

  window.addEventListener('resize', () => {
    handleScrollAnimations();
  });

  // Initialize everything
  initializeTheme();
  initializeLanguage();
  injectYear();
  initializeEnhancements();
});
