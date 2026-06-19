(function () {
    var hlsCallbacks = [];
    var hlsLoading = false;

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function showError(shell, message) {
        var error = shell.querySelector('[data-player-error]');
        if (error) {
            error.textContent = message || '视频加载失败，请稍后再试';
        }
    }

    function loadHls(callback, shell) {
        if (window.Hls) {
            callback();
            return;
        }

        hlsCallbacks.push(callback);

        if (hlsLoading) {
            return;
        }

        hlsLoading = true;
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
        script.async = true;
        script.onload = function () {
            var callbacks = hlsCallbacks.slice();
            hlsCallbacks = [];
            callbacks.forEach(function (item) {
                item();
            });
        };
        script.onerror = function () {
            hlsCallbacks = [];
            showError(shell, '视频加载失败，请稍后再试');
        };
        document.head.appendChild(script);
    }

    function initialize(shell) {
        var video = shell.querySelector('video[data-video-url]');
        if (!video || video.dataset.ready === 'true') {
            return;
        }

        var source = video.getAttribute('data-video-url');
        if (!source) {
            showError(shell, '视频加载失败，请稍后再试');
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.dataset.ready = 'true';
            return;
        }

        loadHls(function () {
            if (!window.Hls || !window.Hls.isSupported()) {
                showError(shell, '视频加载失败，请稍后再试');
                return;
            }

            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video.dataset.ready = 'true';
            shell._hlsInstance = hls;
        }, shell);
    }

    function play(shell) {
        var video = shell.querySelector('video[data-video-url]');
        var overlay = shell.querySelector('[data-play-button]');

        initialize(shell);

        if (video) {
            var attempt = function () {
                var playResult = video.play();
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {
                        showError(shell, '请再次点击播放');
                    });
                }
            };

            if (video.dataset.ready === 'true') {
                attempt();
            } else {
                setTimeout(attempt, 650);
            }
        }

        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
            var overlay = shell.querySelector('[data-play-button]');
            var video = shell.querySelector('video[data-video-url]');

            initialize(shell);

            if (overlay) {
                overlay.addEventListener('click', function () {
                    play(shell);
                });
            }

            if (video) {
                video.addEventListener('play', function () {
                    if (overlay) {
                        overlay.classList.add('hidden');
                    }
                });
                video.addEventListener('click', function () {
                    if (video.paused) {
                        play(shell);
                    }
                });
            }
        });
    });
})();
