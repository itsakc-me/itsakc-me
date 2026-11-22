document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");

  if (navLinks) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.querySelectorAll("a").forEach((link) => {
      const linkPage = link.getAttribute("href")?.split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  if (nav && navLinks) {
    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span>";
    nav.insertBefore(toggle, navLinks);
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const updateNav = () => {
    nav?.classList.toggle("nav-scrolled", window.scrollY > 18);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const revealElements = document.querySelectorAll(
    ".fade-up, .card, .project-card, .testimonial-card, .reach-orion-card"
  );

  if ("IntersectionObserver" in window && !reducedMotion) {
    revealElements.forEach((element) => element.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-5px) perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.classList.remove("button-pop");
      void button.offsetWidth;
      button.classList.add("button-pop");
    });
  });

  const hero = document.querySelector(".hero");
  if (hero && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.querySelectorAll(".bouncing-ball").forEach((ball, index) => {
        const depth = (index + 1) * 8;
        ball.style.translate = `${x * depth}px ${y * depth}px`;
      });
    });
    hero.addEventListener("pointerleave", () => {
      hero.querySelectorAll(".bouncing-ball").forEach((ball) => {
        ball.style.translate = "";
      });
    });
  }

  if (!reducedMotion && window.Lenis) {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(2, -10 * t),
      smoothTouch: false,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);
    document.addEventListener("pointermove", (event) => {
      cursor.style.left = `${event.clientX - cursor.clientWidth / 2}px`;
      cursor.style.top = `${event.clientY - cursor.clientHeight / 2}px`;
    });
    document.querySelectorAll("a, button, .skill-orb").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });
  }

  // Keep content visible by default; animation libraries can fail or be blocked
  // without removing/obscuring user-facing content.
});
