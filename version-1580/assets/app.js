(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setupMobileNav() {
        var toggle = document.querySelector(".mobile-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            var opened = menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        show(0);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
        panels.forEach(function (panel) {
            var scope = panel.closest(".page-section") || document;
            var keyword = panel.querySelector(".filter-keyword");
            var region = panel.querySelector(".filter-region");
            var category = panel.querySelector(".filter-category");
            var year = panel.querySelector(".filter-year");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-row"));

            function apply() {
                var keywordValue = normalize(keyword && keyword.value);
                var regionValue = normalize(region && region.value);
                var categoryValue = normalize(category && category.value);
                var yearValue = normalize(year && year.value);

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-category"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre")
                    ].join(" "));
                    var matchesKeyword = !keywordValue || haystack.indexOf(keywordValue) !== -1;
                    var matchesRegion = !regionValue || normalize(card.getAttribute("data-region")).indexOf(regionValue) !== -1;
                    var matchesCategory = !categoryValue || normalize(card.getAttribute("data-category")) === categoryValue;
                    var matchesYear = !yearValue || normalize(card.getAttribute("data-year")).indexOf(yearValue) !== -1;
                    card.classList.toggle("hidden-card", !(matchesKeyword && matchesRegion && matchesCategory && matchesYear));
                });
            }

            [keyword, region, category, year].forEach(function (field) {
                if (field) {
                    field.addEventListener("input", apply);
                    field.addEventListener("change", apply);
                }
            });

            panel.addEventListener("reset", function () {
                window.setTimeout(apply, 0);
            });
        });
    }

    window.initMoviePlayer = function (streamUrl) {
        var video = document.getElementById("movieVideo");
        var button = document.getElementById("playButton");
        if (!video || !streamUrl) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }

        function beginPlayback() {
            if (button) {
                button.classList.add("is-hidden");
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", beginPlayback);
        }

        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("is-hidden");
            }
        });
    };

    ready(function () {
        setupMobileNav();
        setupHero();
        setupFilters();
    });
})();
