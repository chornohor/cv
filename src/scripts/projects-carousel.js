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
    if (event.button !== 0) {
      return;
    }

    isPointerDown = true;
    isDragging = false;
    shouldSuppressClick = false;
    startX = event.clientX;
    startScrollLeft = viewport.scrollLeft;
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isPointerDown) {
      return;
    }

    const distance = event.clientX - startX;

    if (!isDragging && Math.abs(distance) > 6) {
      isDragging = true;
      shouldSuppressClick = true;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    }

    if (!isDragging) {
      return;
    }

    event.preventDefault();
    viewport.scrollLeft = startScrollLeft - distance;
  });

  const stopDragging = (event) => {
    if (!isPointerDown) {
      return;
    }

    isPointerDown = false;
    isDragging = false;
    viewport.classList.remove("is-dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

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
