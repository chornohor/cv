document.querySelectorAll(".design-principles").forEach((principles) => {
	const items = principles.querySelectorAll(".design-principles-item");

	items.forEach((item) => {
		item.addEventListener("click", () => {
			items.forEach((currentItem) => {
				currentItem.classList.remove("design-principles-item--active");
			});

			item.classList.add("design-principles-item--active");
		});
	});
});
