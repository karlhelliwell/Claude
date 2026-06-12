/* Oakleaf Partnership — homepage interactions.
   No dependencies. Everything degrades gracefully without JS. */
(() => {
  "use strict";

  /* ---------- Sticky header state ---------- */
  const header = document.getElementById("site-header");
  let scrollTicking = false;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
  updateHeader();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    toggle.querySelector(".menu-toggle__label").textContent = open ? "Close" : "Menu";
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Close the menu when a link inside it is followed
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  // Reset if the viewport grows past the desktop breakpoint
  matchMedia("(min-width: 64em)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- Scroll reveals ---------- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Testimonial carousel ---------- */
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const slides = carousel.querySelectorAll(".carousel__slide");
    const count = carousel.querySelector("[data-carousel-count]");
    let index = 0;

    const show = (next) => {
      slides[index].classList.remove("is-active");
      index = (next + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      count.textContent = `${index + 1} / ${slides.length}`;
    };

    carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => show(index - 1));
    carousel.querySelector("[data-carousel-next]").addEventListener("click", () => show(index + 1));
  }

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
