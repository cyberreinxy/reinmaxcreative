document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the element is on screen
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
        // If the element is OFF screen
        else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  // We observe the grid itself, which will control all children
  const grid = document.querySelector(".pillar-grid");
  if (grid) {
    observer.observe(grid);
  }
});
