/* ========================================================================
   main.js: nav behavior + scroll reveal. No dependencies except Bootstrap's
   collapse (optional; guarded).

   In <head>, before the stylesheet, so reveal styles never flash:
   <script>document.documentElement.classList.add("js")</script>
   ======================================================================== */

(function () {
  "use strict";

  const nav = document.querySelector(".navbar");

  // ---------- Navbar: solid background after scrolling ----------
  if (nav) {
    let scrolled = false;

    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== scrolled) {
        scrolled = next;
        nav.classList.toggle("is-scrolled", scrolled);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Current page: mark the matching nav link ----------
  // Multi-page site, so match on the URL path. Nested pages count too
  // (/case-studies/foo highlights /case-studies).
  // In Astro: set aria-current in the nav component from Astro.url.pathname
  // and delete this block.
  const clean = (p) => p.replace(/\/index\.html$/, "/").replace(/(.)\/$/, "$1");
  const here = clean(location.pathname);

  document.querySelectorAll(".navbar .nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;

    const path = clean(url.pathname);
    const current =
      path === here || (path !== "/" && here.startsWith(path + "/"));

    a.classList.toggle("active", current);
    if (current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  // ---------- Mobile: close the menu after choosing a link ----------
  const collapse = document.getElementById("navbarNav");

  if (collapse) {
    collapse.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-link, .btn")) return;
      if (!collapse.classList.contains("show")) return;
      if (!window.bootstrap) return;
      window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    });
  }

  // ---------- Scroll reveal: [data-scroll] ----------
  const reveals = document.querySelectorAll("[data-scroll]");

  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      const reveal = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay;
            el.classList.add("is-visible");
            obs.unobserve(el); // once only; no re-animating on scroll back
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      reveals.forEach((el) => reveal.observe(el));
    }
  }

  // ---------- Logo marquee: seamless loop ----------
  // CSS slides both tracks by one loop period. The period is measured here
  // (distance from a logo to its twin in the second track), so the loop stays
  // exact whatever the logo sizes, gaps or load order do.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion) {
    document.querySelectorAll(".marquee").forEach((marquee) => {
      const inner = marquee.querySelector(".marquee-inner");
      const tracks = inner ? inner.querySelectorAll(".marquee-track") : [];
      if (!tracks.length) return;

      // Keep the first list; any hand-made duplicate gets rebuilt below
      const first = tracks[0];
      tracks.forEach((t, i) => {
        if (i > 0) t.remove();
      });

      // Off-screen lazy images have no width yet, which skews the loop
      const imgs = Array.from(first.querySelectorAll("img"));
      imgs.forEach((img) => {
        img.loading = "eager";
      });

      const twin = first.cloneNode(true);
      twin.setAttribute("aria-hidden", "true");
      twin.querySelectorAll("img").forEach((img) => {
        img.alt = "";
      });
      inner.appendChild(twin);

      marquee.style.setProperty("--logo-count", first.children.length);

      const measure = () => {
        const shift =
          twin.getBoundingClientRect().left -
          first.getBoundingClientRect().left;
        if (shift > 0)
          marquee.style.setProperty("--marquee-shift", shift + "px");
      };

      // Start only after every logo has its real size
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))).then(() => {
        measure();
        marquee.classList.add("is-ready");
        if ("ResizeObserver" in window) {
          new ResizeObserver(measure).observe(first);
        }
      });
    });
  }

  // ---------- Footer year ----------
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
