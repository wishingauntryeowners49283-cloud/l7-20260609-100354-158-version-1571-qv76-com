(function () {
  function getElement(id) {
    return document.getElementById(id);
  }

  function attach(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
    video.src = source;
  }

  function mount(videoId, coverId, buttonId, source) {
    function run() {
      var video = getElement(videoId);
      var cover = getElement(coverId);
      var button = getElement(buttonId);
      if (!video || !source) {
        return;
      }
      var started = false;

      function play() {
        if (!started) {
          started = true;
          attach(video, source);
        }
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var request = video.play();
        if (request && typeof request.catch === "function") {
          request.catch(function () {
            if (cover) {
              cover.classList.remove("is-hidden");
            }
          });
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          play();
        });
      }
      if (cover) {
        cover.addEventListener("click", play);
      }
      video.addEventListener("click", function () {
        if (!started) {
          play();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  window.VideoPage = {
    mount: mount
  };
})();
