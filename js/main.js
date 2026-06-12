/* Oakleaf Group — Capabilities microsite interactions */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Scroll progress bar + sticky nav visibility
     ---------------------------------------------------------- */
  const progressBar = document.getElementById("progress-bar");
  const siteNav = document.getElementById("site-nav");
  const hero = document.getElementById("hero");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      siteNav.classList.toggle("is-visible", window.scrollY > hero.offsetHeight * 0.55);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ----------------------------------------------------------
     Scrollspy — highlight active section in nav
     ---------------------------------------------------------- */
  const spyLinks = new Map();
  navLinks.querySelectorAll("a[data-spy]").forEach((a) => spyLinks.set(a.dataset.spy, a));

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const key = entry.target.dataset.spySection;
        spyLinks.forEach((a, k) => a.classList.toggle("is-active", k === key));
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  document.querySelectorAll("[data-spy-section]").forEach((s) => spyObserver.observe(s));

  /* ----------------------------------------------------------
     Reveal on scroll (staggered within each section)
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    // stagger siblings that reveal together
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      const i = groups.get(parent);
      el.style.setProperty("--reveal-delay", Math.min(i * 0.09, 0.45) + "s");
      groups.set(parent, i + 1);
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     In-view trigger for charts / bars (adds .in-view to section)
     ---------------------------------------------------------- */
  const inViewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        inViewObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  document
    .querySelectorAll(".intel__chart, .split-bar, .placements__stats, .global__cards")
    .forEach((el) => inViewObserver.observe(el));

  // width-driven bars read their target from data-width
  document.querySelectorAll("[data-width]").forEach((el) => {
    el.style.setProperty("--w", el.dataset.width);
  });

  /* ----------------------------------------------------------
     Animated counters
     ---------------------------------------------------------- */
  const formatValue = (value, el) => {
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    let out = value.toFixed(decimals);
    if (el.dataset.format === "comma") out = Number(out).toLocaleString("en-GB");
    return out;
  };

  const counters = document.querySelectorAll("[data-count]");
  if (prefersReducedMotion) {
    counters.forEach((el) => { el.textContent = formatValue(parseFloat(el.dataset.count), el); });
  } else {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          countObserver.unobserve(el);
          const target = parseFloat(el.dataset.count);
          const duration = 1800;
          const start = performance.now();
          const easeOut = (t) => 1 - Math.pow(1 - t, 4);
          (function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = formatValue(target * easeOut(p), el);
            if (p < 1) requestAnimationFrame(tick);
          })(start);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ----------------------------------------------------------
     Hero parallax — mouse + scroll
     ---------------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const layers = hero.querySelectorAll("[data-parallax]");
    let mx = 0, my = 0, raf = null;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        layers.forEach((el) => {
          const depth = parseFloat(el.dataset.parallax);
          el.style.transform = `translate3d(${(-mx * depth).toFixed(1)}px, ${(-my * depth).toFixed(1)}px, 0)`;
        });
        raf = null;
      });
    });
    hero.addEventListener("mouseleave", () => {
      layers.forEach((el) => { el.style.transform = ""; });
    });

    const imgWrap = hero.querySelector("[data-parallax-scroll] img");
    if (imgWrap) {
      window.addEventListener("scroll", () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        imgWrap.style.setProperty("--scroll-shift", (y * -0.12).toFixed(1) + "px");
      }, { passive: true });
    }
  }

  /* ----------------------------------------------------------
     Capability cards — expand / collapse
     ---------------------------------------------------------- */
  document.querySelectorAll(".cap-card").forEach((card) => {
    const head = card.querySelector(".cap-card__head");
    head.addEventListener("click", () => {
      const open = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
    });
  });

  /* ----------------------------------------------------------
     Client logo wall — sector filtering
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const logoCards = document.querySelectorAll(".logo-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      logoCards.forEach((card) => {
        const show = f === "all" || card.dataset.sector === f;
        if (show) {
          card.classList.remove("is-hidden");
          requestAnimationFrame(() => card.classList.remove("is-dimmed"));
        } else {
          card.classList.add("is-dimmed");
          setTimeout(() => card.classList.add("is-hidden"), 280);
        }
      });
    });
  });

  /* ----------------------------------------------------------
     Testimonial carousel
     ---------------------------------------------------------- */
  const track = document.getElementById("carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsWrap = document.getElementById("carousel-dots");
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    current = Math.max(0, Math.min(i, slides.length - 1));
    const slide = slides[current];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = slides.slice(0, current).reduce((acc, s) => acc + s.offsetWidth + gap, 0);
    track.style.transform = `translateX(${-offset}px)`;
    slides.forEach((s, j) => s.classList.toggle("is-current", j === current));
    dots.forEach((d, j) => {
      d.classList.toggle("is-active", j === current);
      d.setAttribute("aria-selected", String(j === current));
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }
  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // keyboard support
  document.getElementById("carousel").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { goTo(current - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { goTo(current + 1); e.preventDefault(); }
  });

  // touch swipe
  let touchX = null;
  track.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) goTo(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  window.addEventListener("resize", () => goTo(current));
  goTo(0);

  /* ----------------------------------------------------------
     Follow-up request form
     ---------------------------------------------------------- */
  const FORM_RECIPIENT = "karlhelliwell@oakleaf.group";
  const form = document.getElementById("follow-up-form");
  const status = document.getElementById("form-status");

  function setStatus(message, ok) {
    status.textContent = message;
    status.classList.toggle("is-ok", ok);
    status.classList.toggle("is-error", !ok);
  }

  // floating CTA: scroll to the form and focus the first field
  document.getElementById("float-follow-up").addEventListener("click", () => {
    setTimeout(() => document.getElementById("ff-name").focus({ preventScroll: true }), 650);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    if (data.get("_honey")) return; // bot caught by honeypot

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      "industry sector": data.get("sector"),
      _subject: "Follow-up request — Oakleaf Capabilities site",
      _template: "table",
      _captcha: "false",
    };

    const submitBtn = form.querySelector(".contact-form__submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("https://formsubmit.co/ajax/" + FORM_RECIPIENT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
      form.querySelector(".contact-form__grid").style.display = "none";
      submitBtn.style.display = "none";
      setStatus("Thank you, " + payload.name.split(" ")[0] + " — your request has been sent. One of our specialists will be in touch shortly.", true);
    } catch (err) {
      // fall back to the user's email client with a prefilled message
      const body = encodeURIComponent(
        "Follow-up request\n\nFull name: " + payload.name +
        "\nEmail: " + payload.email +
        "\nPhone: " + payload.phone +
        "\nIndustry sector: " + payload["industry sector"]
      );
      window.location.href = "mailto:" + FORM_RECIPIENT +
        "?subject=" + encodeURIComponent(payload._subject) + "&body=" + body;
      setStatus("We couldn't send your request directly, so we've opened your email client instead — just press send.", false);
      submitBtn.disabled = false;
      submitBtn.textContent = "Request a follow-up";
    }
  });
})();
