document.querySelectorAll("[data-feature-deep-dive]").forEach((feature) => {
	const projects = feature.querySelectorAll("[data-feature-project]");
	const trackItems = feature.querySelectorAll("[data-feature-track-item]");
	const prevButton = feature.querySelector("[data-feature-prev]");
	const nextButton = feature.querySelector("[data-feature-next]");

	if (!projects.length || !prevButton || !nextButton) {
		return;
	}

	let activeIndex = 0;

	const goToProject = (index) => {
		if (index < 0 || index > projects.length - 1 || index === activeIndex) {
			return;
		}

		activeIndex = index;
		updateFeature();
	};

	const goToPrevProject = () => {
		goToProject(activeIndex - 1);
	};

	const goToNextProject = () => {
		goToProject(activeIndex + 1);
	};

	const updateFeature = () => {
		projects.forEach((project, index) => {
			project.hidden = index !== activeIndex;
		});

		trackItems.forEach((item, index) => {
			item.classList.toggle("feature__track__item--active", index === activeIndex);
		});

		prevButton.classList.toggle("circle-label--outlined", activeIndex === 0);
		nextButton.classList.toggle(
			"circle-label--outlined",
			activeIndex === projects.length - 1,
		);
	};

	prevButton.addEventListener("click", () => {
		goToPrevProject();
	});

	nextButton.addEventListener("click", () => {
		goToNextProject();
	});

	projects.forEach((project) => {
		let startX = 0;
		let startY = 0;
		let isPointerDown = false;

		project.style.touchAction = "pan-y";

		project.addEventListener("dragstart", (event) => {
			event.preventDefault();
		});

		project.addEventListener("pointerdown", (event) => {
			if (event.pointerType === "mouse" && event.button !== 0) {
				return;
			}

			startX = event.clientX;
			startY = event.clientY;
			isPointerDown = true;
			project.setPointerCapture(event.pointerId);
		});

		project.addEventListener("pointerup", (event) => {
			if (!isPointerDown) {
				return;
			}

			const deltaX = event.clientX - startX;
			const deltaY = event.clientY - startY;
			const isHorizontalSwipe = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY);

			isPointerDown = false;

			if (!isHorizontalSwipe) {
				return;
			}

			if (deltaX < 0) {
				goToNextProject();
				return;
			}

			goToPrevProject();
		});

		project.addEventListener("pointercancel", () => {
			isPointerDown = false;
		});
	});

	updateFeature();
});
