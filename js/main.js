/* Don's Building, Paving & Installations — demo interactions */
(function () {
  "use strict";

  // Header shrink
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile drawer
  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  function closeDrawer() { if (drawer) { drawer.classList.remove("open"); document.body.style.overflow = ""; } }
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      drawer.classList.add("open"); document.body.style.overflow = "hidden";
    });
    drawer.querySelectorAll("a,.close").forEach(function (el) { el.addEventListener("click", closeDrawer); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + "ms";
    io.observe(el);
  });

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ---- Video autoplay management (mobile-safe) ----
  var vids = Array.prototype.slice.call(document.querySelectorAll("video"));
  vids.forEach(function (v) { v.muted = true; v.setAttribute("playsinline", ""); });

  var vio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.25 });
  vids.forEach(function (v) { vio.observe(v); });

  // iOS Low Power Mode: resume on first interaction
  function kick() {
    vids.forEach(function (v) {
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
    document.removeEventListener("touchstart", kick);
    document.removeEventListener("click", kick);
  }
  document.addEventListener("touchstart", kick, { once: true, passive: true });
  document.addEventListener("click", kick, { once: true });

  // Reel sound toggles
  document.querySelectorAll(".reel").forEach(function (reel) {
    var vid = reel.querySelector("video");
    var btn = reel.querySelector(".sound");
    if (!vid || !btn) return;
    var mutedIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    var onIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
    function paint() { btn.innerHTML = vid.muted ? mutedIcon : onIcon; }
    paint();
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var turningOn = vid.muted;
      document.querySelectorAll(".reel").forEach(function (r) {
        var ov = r.querySelector("video"), ob = r.querySelector(".sound");
        if (ov && ov !== vid) { ov.muted = true; if (ob) ob.innerHTML = mutedIcon; }
      });
      vid.muted = !turningOn ? true : false;
      if (!vid.muted) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
      paint();
    });
  });

  // Lightbox
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var figs = Array.prototype.slice.call(document.querySelectorAll(".gallery figure"));
    var idx = 0;
    function show(i) {
      idx = (i + figs.length) % figs.length;
      lbImg.src = figs[idx].getAttribute("data-full") || figs[idx].querySelector("img").src;
    }
    figs.forEach(function (f, i) {
      f.addEventListener("click", function () { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; });
    });
    function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; lbImg.src = ""; }
    lb.querySelector(".x").addEventListener("click", closeLb);
    lb.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  // Quote form -> WhatsApp handoff (static site: no backend, so the form must
  // actually deliver rather than pretend to succeed).
  var form = document.getElementById("quoteForm");
  if (form) {
    var WA = "27835231697";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      function val(id) { var el = document.getElementById(id); return el && el.value ? el.value.trim() : ""; }
      var body = [
        "New quote request from the website",
        "",
        "Name: "    + (val("name")    || "-"),
        "Phone: "   + (val("phone")   || "-"),
        "Email: "   + (val("email")   || "-"),
        "Service: " + (val("service") || "-"),
        "Area: "    + (val("city")    || "-"),
        "",
        "Details:",
        (val("msg") || "-")
      ].join("\n");

      var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(body);
      var ok = form.querySelector(".ok");
      if (ok) {
        var link = ok.querySelector(".wa-send");
        if (link) link.setAttribute("href", url);
        ok.style.display = "block";
        ok.scrollIntoView({ block: "nearest" });
      }
      window.open(url, "_blank", "noopener");
    });
  }
})();
