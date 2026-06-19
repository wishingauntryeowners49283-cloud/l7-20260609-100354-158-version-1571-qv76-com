(function () {
    function setupMoviePlayer(config) {
        var video = document.getElementById(config.videoId);
        var button = document.getElementById(config.buttonId);
        var errorBox = document.getElementById(config.errorId);
        var source = config.source;
        var loaded = false;
        var hls = null;

        if (!video || !button || !source) {
            return;
        }

        function showError() {
            if (errorBox) {
                errorBox.hidden = false;
            }
            button.classList.remove("is-hidden");
        }

        function attachVideo() {
            if (loaded) {
                return Promise.resolve();
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return Promise.resolve();
            }

            if (window.Hls && window.Hls.isSupported()) {
                return new Promise(function (resolve, reject) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            reject(data);
                        }
                    });
                });
            }

            return Promise.reject(new Error("unavailable"));
        }

        function startPlayback() {
            button.disabled = true;
            attachVideo().then(function () {
                if (errorBox) {
                    errorBox.hidden = true;
                }
                video.controls = true;
                button.classList.add("is-hidden");
                button.disabled = false;
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        button.classList.remove("is-hidden");
                    });
                }
            }).catch(function () {
                button.disabled = false;
                loaded = false;
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
                showError();
            });
        }

        button.addEventListener("click", startPlayback);
        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                startPlayback();
            } else {
                video.pause();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
}());
