/**
 * ============================================
 * ملف JavaScript الرئيسي — Portfolio Offline
 * جميع الوظائف تعمل بدون إنترنت
 * ============================================
 */

(function () {
  "use strict";

  /* ——— إعدادات قابلة للتعديل بسهولة ——— */
  const CONFIG = {
    loaderMinTime: 2200,
    particleCount: 60,
    roseCount: 12,
    flowerCount: 8,
  };

  /* ============================================
     شاشة التحميل — إخفاء بعد اكتمال التحميل
     ============================================ */
  function initLoader() {
    const loader = document.getElementById("loader");
    const body = document.body;
    body.classList.add("loading");

    const start = Date.now();

    function hideLoader() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, CONFIG.loaderMinTime - elapsed);

      setTimeout(function () {
        loader.classList.add("hidden");
        body.classList.remove("loading");
      }, remaining);
    }

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
    }
  }

  /* ============================================
     المؤشر المخصص — يتبع حركة الفأرة
     ============================================ */
  function initCustomCursor() {
    const dot = document.querySelector(".cursor--dot");
    const ring = document.querySelector(".cursor--ring");
    if (!dot || !ring || window.matchMedia("(max-width: 768px)").matches) {
      document.body.classList.add("custom-cursor-off");
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll(
      "a, button, .skill-card, .cert-card, .glass-card, input, textarea"
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        ring.classList.add("hover");
      });
      el.addEventListener("mouseleave", function () {
        ring.classList.remove("hover");
      });
    });
  }

  /* ============================================
     كرات التوهج المتحركة في الخلفية
     ============================================ */
  function initGlowOrbs() {
    const container = document.getElementById("glow-orbs");
    if (!container) return;

    for (let i = 0; i < 3; i++) {
      const orb = document.createElement("div");
      orb.className = "glow-orb";
      container.appendChild(orb);
    }
  }

  /* ============================================
     جسيمات Particles — رسم على Canvas
     ============================================ */
  function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height;
    let animationId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(
        CONFIG.particleCount,
        Math.floor((width * height) / 15000)
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function getParticleColor() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      return isLight ? "107, 34, 64" : "196, 90, 122";
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const rgb = getParticleColor();

      particles.forEach(function (p, i) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + rgb + ", " + p.opacity + ")";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle =
              "rgba(" + rgb + ", " + (0.15 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", function () {
      resize();
      createParticles();
    });

    return function refreshTheme() {
      /* يُستدعى عند تبديل الثيم لتحديث ألوان الجسيمات */
    };
  }

  /* ============================================
     SVG الوردة — شكل محلي بدون صور خارجية
     ============================================ */
  function roseSVG(size) {
    return (
      '<svg viewBox="0 0 40 40" width="' +
      size +
      '" height="' +
      size +
      '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="20" cy="20" r="6" fill="#c45a7a" opacity="0.9"/>' +
      '<ellipse cx="20" cy="12" rx="5" ry="8" fill="#9e3a5c" transform="rotate(0 20 20)"/>' +
      '<ellipse cx="20" cy="12" rx="5" ry="8" fill="#d4789a" transform="rotate(72 20 20)"/>' +
      '<ellipse cx="20" cy="12" rx="5" ry="8" fill="#9e3a5c" transform="rotate(144 20 20)"/>' +
      '<ellipse cx="20" cy="12" rx="5" ry="8" fill="#d4789a" transform="rotate(216 20 20)"/>' +
      '<ellipse cx="20" cy="12" rx="5" ry="8" fill="#9e3a5c" transform="rotate(288 20 20)"/>' +
      "</svg>"
    );
  }

  function flowerSVG(size) {
    return (
      '<svg viewBox="0 0 32 32" width="' +
      size +
      '" height="' +
      size +
      '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="16" cy="16" r="4" fill="#e8a0b8"/>' +
      '<circle cx="16" cy="8" r="5" fill="#c45a7a" opacity="0.8"/>' +
      '<circle cx="24" cy="16" r="5" fill="#d4789a" opacity="0.7"/>' +
      '<circle cx="16" cy="24" r="5" fill="#9e3a5c" opacity="0.8"/>' +
      '<circle cx="8" cy="16" r="5" fill="#c45a7a" opacity="0.7"/>' +
      "</svg>"
    );
  }

  /* ============================================
     ورود وزهور طافية — Floating Animation
     ============================================ */
  function initFloatingElements() {
    const rosesLayer = document.getElementById("roses-layer");
    const flowersLayer = document.getElementById("flowers-layer");
    if (!rosesLayer || !flowersLayer) return;

    function spawn(layer, className, svgFn, count) {
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = className;
        const size = 20 + Math.random() * 35;
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.left = Math.random() * 100 + "%";
        el.style.animationDuration = 15 + Math.random() * 20 + "s";
        el.style.animationDelay = Math.random() * 20 + "s";
        el.innerHTML = svgFn(size);
        layer.appendChild(el);
      }
    }

    spawn(rosesLayer, "floating-rose", roseSVG, CONFIG.roseCount);
    spawn(flowersLayer, "floating-flower", flowerSVG, CONFIG.flowerCount);
  }

  /* ============================================
     ظهور العناصر عند التمرير Scroll Reveal
     ============================================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const timeline = document.querySelector(".timeline");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });

    if (timeline) {
      const tlObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              timeline.classList.add("visible");
            }
          });
        },
        { threshold: 0.2 }
      );
      tlObserver.observe(timeline);
    }
  }

  /* ============================================
     تأثير Parallax أثناء التمرير
     ============================================ */
  function initParallax() {
    const hero = document.querySelector(".hero__content");
    const orbs = document.querySelectorAll(".glow-orb");

    let ticking = false;

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          if (hero) {
            hero.style.transform = "translateY(" + scrollY * 0.25 + "px)";
            hero.style.opacity = Math.max(0.3, 1 - scrollY / 700);
          }
          orbs.forEach(function (orb, i) {
            const speed = 0.05 + i * 0.03;
            orb.style.transform =
              "translateY(" + scrollY * speed + "px)";
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ============================================
     شريط التنقل — ثابت وتفعيل الرابط النشط
     ============================================ */
  function initNavbar() {
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav__link");
    const sections = document.querySelectorAll("section[id]");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");

    window.addEventListener("scroll", function () {
      if (window.scrollY > 60) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      let current = "";
      sections.forEach(function (section) {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    });

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        toggle.classList.toggle("active");
        menu.classList.toggle("open");
        const expanded = menu.classList.contains("open");
        toggle.setAttribute("aria-expanded", expanded);
      });

      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          toggle.classList.remove("active");
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ============================================
     تبديل الوضع الداكن / الفاتح
     ============================================ */
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const saved = localStorage.getItem("portfolio-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    if (saved === "light" || (!saved && prefersLight)) {
      document.documentElement.setAttribute("data-theme", "light");
    }

    if (btn) {
      btn.addEventListener("click", function () {
        const html = document.documentElement;
        const isLight = html.getAttribute("data-theme") === "light";
        if (isLight) {
          html.removeAttribute("data-theme");
          localStorage.setItem("portfolio-theme", "dark");
        } else {
          html.setAttribute("data-theme", "light");
          localStorage.setItem("portfolio-theme", "light");
        }
      });
    }
  }

  /* ============================================
     نموذج التواصل — يعمل بدون خادم (محلي)
     ============================================ */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "يرجى تعبئة جميع الحقول.";
        note.style.color = "#e8a0b8";
        return;
      }

      /* فتح بريد المستخدم الافتراضي مع محتوى الرسالة */
      const subject = encodeURIComponent("رسالة من الموقع — " + name);
      const body = encodeURIComponent(
        "الاسم: " + name + "\nالبريد: " + email + "\n\nالرسالة:\n" + message
      );
      const mailto = "mailto:your@email.com?subject=" + subject + "&body=" + body;

      note.textContent = "تم تجهيز الرسالة! سيتم فتح تطبيق البريد...";
      note.style.color = "";

      setTimeout(function () {
        window.location.href = mailto;
        form.reset();
      }, 600);
    });
  }

  /* ============================================
     سنة التذييل تلقائياً
     ============================================ */
  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     تشغيل جميع الوظائف عند جاهزية الصفحة
     ============================================ */
  function init() {
    initLoader();
    initCustomCursor();
    initGlowOrbs();
    initParticles();
    initFloatingElements();
    initScrollReveal();
    initParallax();
    initNavbar();
    initThemeToggle();
    initContactForm();
    initFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
