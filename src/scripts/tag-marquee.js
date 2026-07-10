const marquees = document.querySelectorAll("[data-tag-marquee]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

marquees.forEach((marquee) => {
  const track = marquee.querySelector("[data-tag-marquee-track]");
  const firstGroup = track?.querySelector(".tag-marquee__group");

  if (!track || !firstGroup) {
    return;
  }

  let groupWidth = firstGroup.scrollWidth;
  let offset = marquee.dataset.direction === "right" ? groupWidth / 2 : 0;
  let startX = 0;
  let startOffset = 0;
  let lastTime = performance.now();
  let isDragging = false;
  const speed = 28;
  const direction = marquee.dataset.direction === "right" ? -1 : 1;

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
      .querySelectorAll("[data-tag-marquee-clone]")
      .forEach((clone) => clone.remove());

    groupWidth = firstGroup.scrollWidth;

    if (!groupWidth) {
      return;
    }

    const groupsNeeded = Math.max(3, Math.ceil(marquee.clientWidth / groupWidth) + 2);

    for (let index = 1; index < groupsNeeded; index += 1) {
      const clone = firstGroup.cloneNode(true);

      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-tag-marquee-clone", "");
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

    if (!isDragging && !prefersReducedMotion.matches) {
      offset = normalizeOffset(offset + direction * speed * (delta / 1000));
      updateTransform();
    }

    requestAnimationFrame(animate);
  };

  marquee.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startOffset = offset;
    marquee.classList.add("is-dragging");
    marquee.setPointerCapture(event.pointerId);
  });

  marquee.addEventListener("pointermove", (event) => {
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
    marquee.classList.remove("is-dragging");

    if (marquee.hasPointerCapture(event.pointerId)) {
      marquee.releasePointerCapture(event.pointerId);
    }
  };

  marquee.addEventListener("pointerup", stopDragging);
  marquee.addEventListener("pointercancel", stopDragging);
  window.addEventListener("resize", recalculate);

  recalculate();
  requestAnimationFrame(animate);
});
