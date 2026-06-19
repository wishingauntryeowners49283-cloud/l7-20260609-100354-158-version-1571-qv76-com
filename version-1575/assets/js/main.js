(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                show(active - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                restart();
            });
        }

        restart();
    }

    var filterList = document.querySelector("[data-filter-list]");
    var filterInput = document.querySelector("[data-filter-input]");
    var filterYear = document.querySelector("[data-filter-year]");
    var filterType = document.querySelector("[data-filter-type]");

    if (filterList) {
        var cards = Array.prototype.slice.call(filterList.querySelectorAll("[data-movie-card]"));

        function filterCards() {
            var query = filterInput ? filterInput.value.trim().toLowerCase() : "";
            var year = filterYear ? filterYear.value : "";
            var type = filterType ? filterType.value : "";

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-type") || "",
                    card.getAttribute("data-year") || ""
                ].join(" ").toLowerCase();
                var okQuery = !query || haystack.indexOf(query) !== -1;
                var okYear = !year || card.getAttribute("data-year") === year;
                var okType = !type || card.getAttribute("data-type") === type;
                card.classList.toggle("is-hidden", !(okQuery && okYear && okType));
            });
        }

        [filterInput, filterYear, filterType].forEach(function (control) {
            if (control) {
                control.addEventListener("input", filterCards);
                control.addEventListener("change", filterCards);
            }
        });
    }
}());
