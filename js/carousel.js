(function () {
  document.querySelectorAll('.process-carousel').forEach(function (carousel) {
    var slides = Array.from(carousel.querySelectorAll('.process-slide'));
    var dots = Array.from(carousel.querySelectorAll('.carousel-dots button'));
    var pause = carousel.querySelector('.carousel-pause');
    var index = 0, timer, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.classList.toggle('active', i === index); slide.setAttribute('aria-hidden', String(i !== index)); });
      dots.forEach(function (dot, i) { dot.classList.toggle('active', i === index); dot.setAttribute('aria-pressed', String(i === index)); });
    }
    function stop() { clearInterval(timer); }
    function start() { stop(); if (!paused && !document.hidden) timer = setInterval(function () { show(index + 1); }, 4800); }
    function move(next) { show(next); start(); }
    function paintPause() { pause.innerHTML = paused ? '&#9654;' : '&#10074;&#10074;'; pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); pause.title = paused ? 'Play slideshow' : 'Pause slideshow'; }
    carousel.querySelector('.prev').addEventListener('click', function () { move(index - 1); });
    carousel.querySelector('.next').addEventListener('click', function () { move(index + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { move(i); }); });
    pause.addEventListener('click', function () { paused = !paused; paintPause(); start(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    carousel.addEventListener('keydown', function (event) { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(index + (event.key === 'ArrowRight' ? 1 : -1)); } });
    var touchX;
    carousel.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; stop(); }, { passive:true });
    carousel.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1)); start(); }, { passive:true });
    document.addEventListener('visibilitychange', start);
    paintPause(); start();
  });
  document.querySelectorAll('.gallery figure').forEach(function (figure) { figure.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); figure.click(); } }); });
})();
