(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var backgrounds = Array.prototype.slice.call(root.querySelectorAll(".hero-bg"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
      backgrounds.forEach(function (background, bgIndex) {
        background.classList.toggle("is-active", bgIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-hero-dot"));
        show(index);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function cardText(card) {
    return [
      card.getAttribute("data-title") || "",
      card.getAttribute("data-year") || "",
      card.getAttribute("data-category") || "",
      card.getAttribute("data-region") || "",
      card.getAttribute("data-type") || "",
      card.getAttribute("data-tags") || "",
      card.textContent || ""
    ].join(" ").toLowerCase();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var category = scope.querySelector("[data-filter-category]");
      var year = scope.querySelector("[data-filter-year]");
      var sort = scope.querySelector("[data-filter-sort]");
      var grid = scope.querySelector("[data-movie-grid]");
      var empty = scope.querySelector("[data-empty-state]");
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query && input) {
        input.value = query;
      }

      function apply() {
        var term = input ? input.value.trim().toLowerCase() : "";
        var categoryValue = category ? category.value : "";
        var yearValue = year ? year.value : "";
        var sortValue = sort ? sort.value : "";
        var visible = [];
        cards.forEach(function (card) {
          var matchesTerm = !term || cardText(card).indexOf(term) !== -1;
          var matchesCategory = !categoryValue || card.getAttribute("data-category") === categoryValue;
          var matchesYear = !yearValue || card.getAttribute("data-year") === yearValue;
          var shouldShow = matchesTerm && matchesCategory && matchesYear;
          card.style.display = shouldShow ? "" : "none";
          if (shouldShow) {
            visible.push(card);
          }
        });
        if (sortValue) {
          visible.sort(function (a, b) {
            var aYear = Number(a.getAttribute("data-year") || 0);
            var bYear = Number(b.getAttribute("data-year") || 0);
            var aRating = Number(a.getAttribute("data-rating") || 0);
            var bRating = Number(b.getAttribute("data-rating") || 0);
            if (sortValue === "year-asc") {
              return aYear - bYear;
            }
            if (sortValue === "rating-desc") {
              return bRating - aRating || bYear - aYear;
            }
            return bYear - aYear || bRating - aRating;
          });
          visible.forEach(function (card) {
            grid.appendChild(card);
          });
        }
        if (empty) {
          empty.classList.toggle("is-visible", visible.length === 0);
        }
      }

      [input, category, year, sort].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  ready(function () {
    initMobileNav();
    initHero();
    initFilters();
  });
})();
