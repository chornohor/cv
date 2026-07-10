const imageCarouselRows = document.querySelectorAll("[data-images-carousel-row]");
const imageCarouselReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

imageCarouselRows.forEach((row) => {
  const track = row.querySelector("[data-images-carousel-track]");
  const firstGroup = track?.querySelector(".images-carousel__group");

  if (!track || !firstGroup) {
    return;
  }

  let groupWidth = firstGroup.scrollWidth;
  let offset = row.dataset.direction === "right" ? groupWidth / 2 : 0;
  let startX = 0;
  let startOffset = 0;
  let lastTime = performance.now();
  let isDragging = false;
  const speed = 34;
  const direction = row.dataset.direction === "right" ? -1 : 1;

  const normalizeOffset = (value) => {
    if (!groupWidth) {
      return 0;
    }

    return ((value % groupWidth) + groupWidth) % groupWidth;
  };

  const updateTransform = () => {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const fillTrack = () => {
    track
      .querySelectorAll("[data-images-carousel-clone]")
      .forEach((clone) => clone.remove());

    groupWidth = firstGroup.scrollWidth;

    if (!groupWidth) {
      return;
    }

    const groupsNeeded = Math.max(3, Math.ceil(row.clientWidth / groupWidth) + 2);

    for (let index = 1; index < groupsNeeded; index += 1) {
      const clone = firstGroup.cloneNode(true);

      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-images-carousel-clone", "");
      clone.querySelectorAll("img").forEach((image) => image.setAttribute("alt", ""));
      track.append(clone);
    }
  };

  const recalculate = () => {
    fillTrack();
    offset = normalizeOffset(offset);
    updateTransform();
  };

  const animate = (time) => {
    const delta = time - lastTime;
    lastTime = time;

    if (!isDragging && !imageCarouselReducedMotion.matches) {
      offset = normalizeOffset(offset + direction * speed * (delta / 1000));
      updateTransform();
    }

    requestAnimationFrame(animate);
  };

  row.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startOffset = offset;
    row.classList.add("is-dragging");
    row.setPointerCapture(event.pointerId);
  });

  row.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    const dragDistance = event.clientX - startX;
    offset = normalizeOffset(startOffset - dragDistance);
    updateTransform();
  });

  const stopDragging = (event) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    row.classList.remove("is-dragging");

    if (row.hasPointerCapture(event.pointerId)) {
      row.releasePointerCapture(event.pointerId);
    }
  };

  row.addEventListener("pointerup", stopDragging);
  row.addEventListener("pointercancel", stopDragging);
  row.addEventListener("dragstart", (event) => event.preventDefault());
  window.addEventListener("resize", recalculate);

  recalculate();
  requestAnimationFrame(animate);
});
