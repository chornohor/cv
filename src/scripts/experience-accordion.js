document.querySelectorAll("#experience .experience-block").forEach((block) => {
	const toggleBlock = () => {
		block.classList.toggle("experience-block--opened");
		block.setAttribute(
			"aria-expanded",
			String(block.classList.contains("experience-block--opened"))
		);
	};

	block.addEventListener("click", () => {
		toggleBlock();
	});

	block.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		toggleBlock();
	});
});
