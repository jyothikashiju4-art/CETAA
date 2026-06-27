/* =========================================================
   CETAA — Behaviour layer
   Each block below is independent and defensive: if an
   element isn't on the page, that block simply does nothing.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- 1. Scroll progress bar at very top of page ---- */
  var progressBar = document.getElementById("scroll-progress");
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  /* ---- 2. Nav: solid background after scrolling past hero ---- */
  var nav = document.querySelector(".site-nav");
  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 80) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }

  window.addEventListener("scroll", function () {
    updateProgress();
    updateNav();
  });
  updateProgress();
  updateNav();

  /* ---- 3. Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("is-open"); });
    });
  }

  /* ---- 4. Subtle parallax drift on hero image ---- */
  var heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    window.addEventListener("scroll", function () {
      var offset = window.scrollY * 0.18;
      heroBg.style.transform = "scale(1.05) translateY(" + offset + "px)";
    }, { passive: true });
  }

  /* ---- 5. Reveal-on-scroll for any element with .reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      observer.observe(el);
    });
  }

  /* ---- 6. Animated stat counters (count up once visible) ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = Math.floor(eased * target);
          el.textContent = value.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---- 7. Fundraising progress fill (renovation page) ---- */
  var fill = document.querySelector(".progress-fill");
  if (fill) {
    var pct = fill.getAttribute("data-pct") || "0";
    var fillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(function () { fill.style.width = pct + "%"; });
          fillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fillObserver.observe(fill);
  }

  /* ---- 8. Set active nav link to current page ---- */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here) a.classList.add("is-active");
  });

});
