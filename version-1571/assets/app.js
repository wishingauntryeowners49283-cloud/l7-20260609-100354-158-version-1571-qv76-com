(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = qs('.menu-toggle');
    var menu = qs('.mobile-nav');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var next = qs('[data-hero-next]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  function initSearch() {
    qsa('[data-search-form]').forEach(function (form) {
      var input = qs('input', form);
      var scopeSelector = form.getAttribute('data-search-form');
      var scope = scopeSelector ? qs(scopeSelector) : document;
      var cards = qsa('.movie-card', scope);
      var empty = qs('.empty-state', scope && scope.parentNode ? scope.parentNode : document);

      function apply() {
        var value = (input.value || '').trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
          var matched = !value || text.indexOf(value) !== -1;
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });

      if (input) {
        input.addEventListener('input', apply);
      }
    });
  }

  function initPlayer() {
    qsa('.player-wrap').forEach(function (wrap) {
      var video = qs('video', wrap);
      var button = qs('.player-button', wrap);
      var src = wrap.getAttribute('data-video');
      var hlsInstance = null;

      function prepare() {
        if (!video || !src) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          if (!hlsInstance) {
            hlsInstance = new window.Hls();
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
          }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          if (!video.getAttribute('src')) {
            video.setAttribute('src', src);
          }
        } else if (!video.getAttribute('src')) {
          video.setAttribute('src', src);
        }
      }

      function play() {
        prepare();
        var promise = video.play();
        wrap.classList.add('playing');
        if (promise && promise.catch) {
          promise.catch(function () {
            wrap.classList.remove('playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }

      wrap.addEventListener('click', function (event) {
        if (event.target && event.target.closest && event.target.closest('button')) {
          return;
        }
        play();
      });

      if (video) {
        video.addEventListener('play', function () {
          wrap.classList.add('playing');
        });
        video.addEventListener('pause', function () {
          if (!video.ended) {
            wrap.classList.remove('playing');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initSearch();
    initPlayer();
  });
})();
