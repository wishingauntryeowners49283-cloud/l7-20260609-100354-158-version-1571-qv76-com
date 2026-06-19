(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initHeroSlider() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = selectAll(".hero-slide", slider);
        var dots = selectAll(".hero-dot", slider);
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var index = 0;
        var timer;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initLocalFilter() {
        var list = document.querySelector("[data-local-list]");
        if (!list) {
            return;
        }
        var input = document.querySelector("[data-local-search]");
        var buttons = selectAll("[data-local-filter]");
        var cards = selectAll(".movie-card", list);
        var currentType = "all";

        function apply() {
            var keyword = normalize(input ? input.value : "");
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-category")
                ].join(" "));
                var typeMatch = currentType === "all" || normalize(card.getAttribute("data-type")) === normalize(currentType);
                var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                card.hidden = !(typeMatch && keywordMatch);
            });
        }

        if (input) {
            input.addEventListener("input", apply);
        }
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                currentType = button.getAttribute("data-local-filter") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                apply();
            });
        });
        apply();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderSearchCard(movie) {
        return [
            '<article class="movie-card">',
            '<a class="card-media" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + ' 在线观看">',
            '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
            '<span class="card-badge">' + escapeHtml(movie.year) + '</span>',
            '<span class="card-type">' + escapeHtml(movie.type) + '</span>',
            '<span class="card-play">▶</span>',
            '</a>',
            '<div class="card-body">',
            '<h2 class="card-title"><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>',
            '<p class="card-text">' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="card-meta">',
            '<span class="meta-pill red">' + escapeHtml(movie.category) + '</span>',
            '<span class="meta-pill">' + escapeHtml(movie.region) + '</span>',
            '</div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function initSearchPage() {
        var form = document.querySelector("[data-search-page-form]");
        var input = document.querySelector("[data-search-page-input]");
        var target = document.querySelector("[data-search-page-results]");
        if (!form || !input || !target || !window.SITE_MOVIES) {
            return;
        }

        function run() {
            var keyword = normalize(input.value);
            if (!keyword) {
                target.innerHTML = '<div class="empty-state">输入片名、类型、地区或标签，即可筛选影片。</div>';
                return;
            }
            var results = window.SITE_MOVIES.filter(function (movie) {
                var text = normalize([
                    movie.title,
                    movie.oneLine,
                    movie.genre,
                    movie.tags,
                    movie.type,
                    movie.region,
                    movie.category,
                    movie.year
                ].join(" "));
                return text.indexOf(keyword) !== -1;
            });
            if (!results.length) {
                target.innerHTML = '<div class="empty-state">没有找到相关影片，换个关键词再试。</div>';
                return;
            }
            target.innerHTML = '<div class="movie-grid">' + results.map(renderSearchCard).join("") + '</div>';
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            run();
        });
        input.addEventListener("input", run);
        var params = new URLSearchParams(window.location.search);
        if (params.get("q")) {
            input.value = params.get("q");
        }
        run();
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMobileMenu();
        initHeroSlider();
        initLocalFilter();
        initSearchPage();
    });
})();
