const impactBlock = document.querySelector(".impact-block");

if (impactBlock) {
	const impactItems = ["impact1", "impact2", "impact3"]
		.map((id) => document.getElementById(id))
		.filter(Boolean);

	const revealImpactItems = () => {
		impactItems.forEach((item, index) => {
			window.setTimeout(() => {
				item.classList.remove("impact-block--mutted");
			}, (index + 1) * 1000);
		});
	};

	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries[0].isIntersecting) {
				return;
			}

			revealImpactItems();
			observer.disconnect();
		},
		{
			threshold: 0.35,
		}
	);

	observer.observe(impactBlock);
}
