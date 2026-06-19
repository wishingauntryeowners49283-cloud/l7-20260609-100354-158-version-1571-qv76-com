(function () {
    function bindStream(video, streamUrl) {
        if (!video || !streamUrl || video.getAttribute("data-ready") === "true") {
            return;
        }
        video.setAttribute("data-ready", "true");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            video.hlsInstance = hls;
            return;
        }
        video.src = streamUrl;
    }

    window.setupMoviePlayer = function (config) {
        var video = document.getElementById(config.videoId);
        var overlay = document.getElementById(config.overlayId);
        var streamUrl = config.streamUrl;
        if (!video || !streamUrl) {
            return;
        }

        function startPlayback() {
            bindStream(video, streamUrl);
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }

        bindStream(video, streamUrl);
        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
    };
})();
