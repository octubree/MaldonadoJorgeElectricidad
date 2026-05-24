(() => {
  // <stdin>
  (function() {
    const toggleButtons = document.querySelectorAll(".toggle-button");
    function hideAllExcept(targetElement) {
      document.querySelectorAll(".hidden").forEach((element) => {
        if (element !== targetElement) {
          element.classList.add("close");
          element.classList.remove("open");
        }
      });
    }
    function toggleElement(targetElement) {
      const isHidden = targetElement.classList.contains("close");
      hideAllExcept(targetElement);
      targetElement.classList.toggle("close", !isHidden);
      targetElement.classList.toggle("open", isHidden);
    }
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const targetIds = this.getAttribute("data-target").split(" ");
        targetIds.forEach((targetId) => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            toggleElement(targetElement);
          }
        });
      });
    });
    document.addEventListener("click", function(event) {
      const targetElements = Array.from(document.querySelectorAll(".open"));
      const clickedOutsideAllTargets = targetElements.every((element) => {
        return !element.contains(event.target) && !event.target.closest(".toggle-button");
      });
      if (clickedOutsideAllTargets) {
        targetElements.forEach((element) => {
          element.classList.remove("open");
          element.classList.add("close");
        });
      }
    });
  })();
  (function() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (!scrollToTopBtn) {
      return;
    }
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
        // Smooth scroll animation
      });
    });
  })();
})();
