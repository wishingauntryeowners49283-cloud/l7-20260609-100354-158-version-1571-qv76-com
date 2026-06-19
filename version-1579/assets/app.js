(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-site-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function() {
                nav.classList.toggle("is-open");
            });
        }

        setupHero();
        setupFilters();
        setupQuickSearch();
    });

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;

        if (slides.length < 2) {
            return;
        }

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                var next = parseInt(dot.getAttribute("data-hero-dot"), 10);
                show(next);
            });
        });

        window.setInterval(function() {
            show(index + 1);
        }, 6200);
    }

    function setupQuickSearch() {
        var forms = document.querySelectorAll("[data-quick-search]");
        forms.forEach(function(form) {
            form.addEventListener("submit", function(event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    return;
                }
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
            });
        });
    }

    function setupFilters() {
        var panels = document.querySelectorAll("[data-filter-panel]");
        panels.forEach(function(panel) {
            var section = panel.closest("section") || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));
            var keyword = panel.querySelector("[data-filter-keyword]");
            var category = panel.querySelector("[data-filter-category]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var result = panel.querySelector("[data-filter-result]");
            var params = new URLSearchParams(window.location.search);

            if (keyword && params.get("q")) {
                keyword.value = params.get("q");
            }

            function yearMatches(cardYear, selected) {
                if (!selected) {
                    return true;
                }
                var value = parseInt(cardYear, 10);
                var base = parseInt(selected, 10);
                if (base >= 2020) {
                    return value === base;
                }
                return value >= base && value <= base + 9;
            }

            function apply() {
                var word = keyword ? keyword.value.trim().toLowerCase() : "";
                var selectedCategory = category ? category.value : "";
                var selectedYear = year ? year.value : "";
                var selectedType = type ? type.value : "";
                var count = 0;

                cards.forEach(function(card) {
                    var text = card.getAttribute("data-search") || "";
                    var cardCategory = card.getAttribute("data-category") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var matched = true;

                    if (word && text.indexOf(word) === -1) {
                        matched = false;
                    }
                    if (selectedCategory && cardCategory !== selectedCategory) {
                        matched = false;
                    }
                    if (!yearMatches(cardYear, selectedYear)) {
                        matched = false;
                    }
                    if (selectedType && cardType.indexOf(selectedType) === -1) {
                        matched = false;
                    }

                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        count += 1;
                    }
                });

                if (result) {
                    result.textContent = "匹配结果：" + count;
                }
            }

            [keyword, category, year, type].forEach(function(control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            });

            apply();
        });
    }
})();
