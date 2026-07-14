document.querySelectorAll("[data-projects-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector("[data-projects-viewport]");
  const tabs = carousel.querySelectorAll("[data-project-tab]");
  const cards = carousel.querySelectorAll(".project-card");
  const progress = carousel.querySelector("[data-projects-progress]");

  if (!viewport) {
    return;
  }

  let isPointerDown = false;
  let isDragging = false;
  let shouldSuppressClick = false;
  let startX = 0;
  let startScrollLeft = 0;

  const startDragging = (clientX) => {
    isPointerDown = true;
    isDragging = false;
    shouldSuppressClick = false;
    startX = clientX;
    startScrollLeft = viewport.scrollLeft;
  };

  const moveDragging = (clientX, event) => {
    if (!isPointerDown) {
      return;
    }

    const distance = clientX - startX;

    if (!isDragging && Math.abs(distance) > 6) {
      isDragging = true;
      shouldSuppressClick = true;
      viewport.classList.add("is-dragging");
    }

    if (!isDragging) {
      return;
    }

    event.preventDefault();
    viewport.scrollLeft = startScrollLeft - distance;
  };

  const updateProgress = () => {
    if (!progress) {
      return;
    }

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const ratio = maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0;
    const minWidth = 0.12;
    const width = minWidth + (1 - minWidth) * ratio;

    progress.style.width = `${width * 100}%`;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.projectTab;

      tabs.forEach((currentTab) => currentTab.classList.remove("is-active"));
      tab.classList.add("is-active");

      cards.forEach((card) => {
        card.hidden = targetId !== "all" && card.id !== targetId;
      });

      viewport.scrollLeft = 0;
      updateProgress();
    });
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    startDragging(event.clientX);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    if (isPointerDown && !isDragging) {
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 6) {
        viewport.setPointerCapture(event.pointerId);
      }
    }

    moveDragging(event.clientX, event);
  });

  const stopDragging = (event) => {
    if (!isPointerDown) {
      return;
    }

    isPointerDown = false;
    isDragging = false;
    viewport.classList.remove("is-dragging");

    if (event.pointerId !== undefined && viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  viewport.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      startDragging(event.touches[0].clientX);
    },
    { passive: true },
  );
  viewport.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      moveDragging(event.touches[0].clientX, event);
    },
    { passive: false },
  );
  viewport.addEventListener("touchend", stopDragging);
  viewport.addEventListener("touchcancel", stopDragging);
  viewport.addEventListener("pointerup", stopDragging);
  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("dragstart", (event) => event.preventDefault());
  viewport.addEventListener("scroll", updateProgress);
  viewport.addEventListener(
    "click",
    (event) => {
      if (shouldSuppressClick) {
        event.preventDefault();
        shouldSuppressClick = false;
      }
    },
    true,
  );

  updateProgress();
});
