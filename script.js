(function () {
  var slider = document.getElementById("project-slider");
  var prevBtn = document.getElementById("slider-prev");
  var nextBtn = document.getElementById("slider-next");
  var dotsWrap = document.getElementById("slider-dots");
  if (slider && dotsWrap) {
    var cards = Array.prototype.slice.call(slider.children);
    var currentIndex = 0;
    var autoplayTimer;

    cards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === 0);
      card.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      var d = document.createElement("span");
      d.className = "sd" + (i === 0 ? " on" : "");
      d.addEventListener("click", function () {
        showSlide(i);
      });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function showSlide(index) {
      currentIndex = (index + cards.length) % cards.length;
      cards.forEach(function (card, i) {
        card.classList.toggle("is-active", i === currentIndex);
        card.classList.toggle("is-leaving", i !== currentIndex);
        card.setAttribute("aria-hidden", i === currentIndex ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("on", i === currentIndex);
      });
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        showSlide(currentIndex - 1);
        restartAutoplay();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        showSlide(currentIndex + 1);
        restartAutoplay();
      });

    slider.addEventListener("mouseenter", function () {
      clearInterval(autoplayTimer);
    });
    slider.addEventListener("mouseleave", restartAutoplay);
    slider.addEventListener("focusin", function () {
      clearInterval(autoplayTimer);
    });
    slider.addEventListener("focusout", restartAutoplay);
    slider.addEventListener("touchstart", function (event) {
      slider.dataset.touchStart = event.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener("touchend", function (event) {
      var start = Number(slider.dataset.touchStart);
      var distance = event.changedTouches[0].clientX - start;
      if (Math.abs(distance) > 45) showSlide(currentIndex + (distance < 0 ? 1 : -1));
      restartAutoplay();
    });
    slider.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    });
    showSlide(0);
    restartAutoplay();
  }

  var toast = document.getElementById("copy-toast");
  var toastTimer;
  document.querySelectorAll(".copyable").forEach(function (el) {
    el.addEventListener("click", function () {
      var value = el.getAttribute("data-copy");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(function () {});
      } else {
        try {
          var tmp = document.createElement("textarea");
          tmp.value = value;
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
        } catch (e) {}
      }
      if (toast) {
        toast.textContent = "Պատճենված է՝ " + value;
        toast.style.opacity = "1";
        toast.style.transform = "translate(-50%, 0)";
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          toast.style.opacity = "0";
          toast.style.transform = "translate(-50%, 20px)";
        }, 2200);
      }
      // mailto:/tel: navigation proceeds normally alongside the copy
    });
  });
})();
