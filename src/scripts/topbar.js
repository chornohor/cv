const topbar = document.querySelector(".topbar");
const topbarToggle = document.querySelector(".topbar__toggle");
const topbarLinks = document.querySelectorAll(".nav a");

if (topbar && topbarToggle) {
	const closeMenu = () => {
		topbar.classList.remove("is-open");
		topbarToggle.setAttribute("aria-expanded", "false");
		topbarToggle.setAttribute("aria-label", "Open menu");
	};

	const openMenu = () => {
		topbar.classList.add("is-open");
		topbarToggle.setAttribute("aria-expanded", "true");
		topbarToggle.setAttribute("aria-label", "Close menu");
	};

	topbarToggle.addEventListener("click", () => {
		if (topbar.classList.contains("is-open")) {
			closeMenu();
			return;
		}

		openMenu();
	});

	topbarLinks.forEach((link) => {
		link.addEventListener("click", closeMenu);
	});

	window.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu();
		}
	});
}
