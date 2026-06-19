(function() {
    window.setupMoviePlayer = function(stream) {
        var video = document.querySelector("[data-player]");
        var cover = document.querySelector("[data-player-cover]");
        var button = document.querySelector("[data-play-button]");
        var loaded = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function bindStream() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }

            video.src = stream;
        }

        function showCover() {
            if (cover) {
                cover.classList.remove("is-hidden");
            }
        }

        function hideCover() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        }

        function play() {
            bindStream();
            hideCover();
            video.setAttribute("controls", "controls");

            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function() {
                    showCover();
                });
            }
        }

        if (button) {
            button.addEventListener("click", play);
        }

        if (cover) {
            cover.addEventListener("click", play);
        }

        video.addEventListener("click", function() {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("ended", showCover);

        window.addEventListener("pagehide", function() {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
