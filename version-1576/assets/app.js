(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    ready(function () {
        var navToggle = document.querySelector('[data-nav-toggle]');
        var navMenu = document.querySelector('[data-nav-menu]');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function () {
                navMenu.classList.toggle('open');
            });
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        var searchInput = document.querySelector('[data-search-input]');

        if (searchInput && query) {
            searchInput.value = query;
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
        var noResults = document.querySelector('[data-no-results]');
        var currentFilter = 'all';

        function applyFilters() {
            var keyword = normalize(searchInput ? searchInput.value : query);
            var visible = 0;

            cards.forEach(function (card) {
                var cardText = normalize(card.getAttribute('data-search'));
                var category = card.getAttribute('data-category') || '';
                var keywordMatch = !keyword || cardText.indexOf(keyword) !== -1;
                var filterMatch = currentFilter === 'all' || category === currentFilter;

                if (keywordMatch && filterMatch) {
                    card.style.display = '';
                    visible += 1;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.classList.toggle('visible', visible === 0 && cards.length > 0);
            }
        }

        if (cards.length > 0) {
            applyFilters();
        }

        if (searchInput && cards.length > 0) {
            searchInput.addEventListener('input', applyFilters);
        }

        Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (button) {
            button.addEventListener('click', function () {
                currentFilter = button.getAttribute('data-filter') || 'all';
                Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                applyFilters();
            });
        });

        Array.prototype.slice.call(document.querySelectorAll('[data-search-form]')).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (cards.length > 0) {
                    event.preventDefault();
                    applyFilters();
                    var grid = document.querySelector('[data-movie-grid]');
                    if (grid) {
                        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var current = 0;
            var timer = null;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('active', dotIndex === current);
                });
            }

            function startTimer() {
                clearInterval(timer);
                timer = setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    showSlide(parseInt(dot.getAttribute('data-hero-dot'), 10));
                    startTimer();
                });
            });

            showSlide(0);
            startTimer();
        }
    });
})();
