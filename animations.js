document.addEventListener("DOMContentLoaded", function () {
  // --- Part 1: Universal Intersection Observer ---
  // This single observer handles all animations on the page.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  // Find all elements with the .animate-on-scroll class and observe them.
  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });

  // --- Part 2: Function to Apply Staggered Animation ---
  // This reusable function applies the sequential delay to any grid of cards.
  const applyStaggeredAnimation = (gridSelector) => {
    const grid = document.querySelector(gridSelector);
    if (grid) {
      const cards = grid.children;
      const delayInterval = 200; // 200ms delay between cards

      Array.from(cards).forEach((card, index) => {
        const delay = index * delayInterval;
        card.style.transitionDelay = `${delay}ms`;
      });
    }
  };

  // --- Part 3: Apply the animation to ALL sections ---
  applyStaggeredAnimation("#team .grid"); // Applies to the Team section
  applyStaggeredAnimation("#services .grid"); // Applies to the Services section
  applyStaggeredAnimation("#portfolio .grid"); // Applies to the Portfolio section
});
