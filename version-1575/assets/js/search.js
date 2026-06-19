(function () {
    var data = window.MOVIE_SEARCH_DATA || [];
    var results = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    var input = document.querySelector("[data-search-input]");
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();

    if (input) {
        input.value = query;
    }

    function matches(item, keyword) {
        if (!keyword) {
            return true;
        }
        var haystack = [
            item.title,
            item.year,
            item.type,
            item.region,
            item.genre,
            item.category,
            item.summary,
            (item.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return haystack.indexOf(keyword.toLowerCase()) !== -1;
    }

    function card(item) {
        var tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<article class=\"movie-card\">",
            "<a href=\"" + item.href + "\" class=\"card-link\">",
            "<div class=\"poster-frame\"><img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\"><span class=\"poster-badge\">" + item.rating + "</span></div>",
            "<div class=\"card-body\"><div class=\"card-meta\"><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.type) + "</span><span>" + escapeHtml(item.region) + "</span></div>",
            "<h3>" + escapeHtml(item.title) + "</h3><p>" + escapeHtml(item.summary) + "</p><div class=\"card-tags\">" + tags + "</div></div>",
            "</a></article>"
        ].join("");
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[char];
        });
    }

    if (results) {
        var matched = data.filter(function (item) {
            return matches(item, query);
        });
        if (!query) {
            matched = data.slice(0, 96);
        }
        if (title) {
            title.textContent = query ? "搜索结果：" + query : "推荐片单";
        }
        results.innerHTML = matched.map(card).join("") || "<div class=\"empty-state\">未找到相关影片</div>";
    }
}());
