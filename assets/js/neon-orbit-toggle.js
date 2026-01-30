(() => {
  const root = document.documentElement;

  const enableOrbit = () => {
    const current = getComputedStyle(root)
      .getPropertyValue("--neon-orbit-state")
      .trim();

    if (current === "running") {
      root.style.setProperty("--neon-orbit-state", "paused");
      // Force reflow to restart the animation on re-enable.
      void root.offsetWidth;
    }

    root.style.setProperty("--neon-orbit-state", "running");
  };

  const triggers = document.querySelectorAll(".neon-orbit-trigger");
  if (!triggers.length) return;

  triggers.forEach((el) => {
    el.addEventListener("dblclick", (event) => {
      event.preventDefault();
      enableOrbit();
    });

    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        enableOrbit();
      }
    });
  });
})();
