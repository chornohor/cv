document.querySelectorAll("[data-expertise-switcher]").forEach((switcher) => {
  const items = Array.from(
    switcher.querySelectorAll(".expertise-switcher__item"),
  );

  items.forEach((item) => {
    const tab = item.querySelector(".expertise-switcher__tab");

    tab?.addEventListener("click", () => {
      items.forEach((currentItem) => {
        const currentTab = currentItem.querySelector(".expertise-switcher__tab");
        const isActive = currentItem === item;

        currentItem.classList.toggle("is-active", isActive);
        currentTab?.setAttribute("aria-expanded", String(isActive));
      });
    });
  });
});
