(() => {
  const clickWindowMs = 350;
  const stateByScope = new WeakMap();

  const getVar = (el, name) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  const getScope = (trigger) =>
    trigger.closest(".neon-name") || document.documentElement;

  const getState = (scope) => {
    const existing = stateByScope.get(scope);
    if (existing) return existing;
    const defaults = {
      dotBefore: getVar(scope, "--neon-umlaut-dot-color-before"),
      dotAfter: getVar(scope, "--neon-umlaut-dot-color-after"),
      glowStrongBefore: getVar(scope, "--neon-umlaut-dot-glow-strong-before"),
      glowStrongAfter: getVar(scope, "--neon-umlaut-dot-glow-strong-after"),
      glowMidBefore: getVar(scope, "--neon-umlaut-dot-glow-mid-before"),
      glowMidAfter: getVar(scope, "--neon-umlaut-dot-glow-mid-after"),
      glowSoftBefore: getVar(scope, "--neon-umlaut-dot-glow-soft-before"),
      glowSoftAfter: getVar(scope, "--neon-umlaut-dot-glow-soft-after"),
    };
    const state = {
      defaults,
      clickCount: 0,
      clickTimer: null,
      orbitMode: "default",
      finishTimer: null,
      popinTimer: null,
      orbitStartTimeMs: 0,
    };
    stateByScope.set(scope, state);
    return state;
  };

  const setColorMode = (scope, state, mode) => {
    const style = scope.style;
    if (mode === "accent") {
      style.setProperty(
        "--neon-umlaut-dot-color-before",
        getVar(scope, "--neon-umlaut-accent-before") || "#00ffff"
      );
      style.setProperty(
        "--neon-umlaut-dot-color-after",
        getVar(scope, "--neon-umlaut-accent-after") || "#ff00cc"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-strong-before",
        getVar(scope, "--neon-umlaut-accent-glow-before") || "rgba(0, 255, 255, 0.85)"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-mid-before",
        getVar(scope, "--neon-umlaut-accent-glow-mid-before") || "rgba(0, 255, 255, 0.7)"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-soft-before",
        getVar(scope, "--neon-umlaut-accent-glow-soft-before") || "rgba(0, 255, 255, 0.5)"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-strong-after",
        getVar(scope, "--neon-umlaut-accent-glow-after") || "rgba(255, 0, 204, 0.85)"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-mid-after",
        getVar(scope, "--neon-umlaut-accent-glow-mid-after") || "rgba(255, 0, 204, 0.7)"
      );
      style.setProperty(
        "--neon-umlaut-dot-glow-soft-after",
        getVar(scope, "--neon-umlaut-accent-glow-soft-after") || "rgba(255, 0, 204, 0.5)"
      );
      return;
    }
    style.setProperty("--neon-umlaut-dot-color-before", state.defaults.dotBefore);
    style.setProperty("--neon-umlaut-dot-color-after", state.defaults.dotAfter);
    style.setProperty("--neon-umlaut-dot-glow-strong-before", state.defaults.glowStrongBefore);
    style.setProperty("--neon-umlaut-dot-glow-strong-after", state.defaults.glowStrongAfter);
    style.setProperty("--neon-umlaut-dot-glow-mid-before", state.defaults.glowMidBefore);
    style.setProperty("--neon-umlaut-dot-glow-mid-after", state.defaults.glowMidAfter);
    style.setProperty("--neon-umlaut-dot-glow-soft-before", state.defaults.glowSoftBefore);
    style.setProperty("--neon-umlaut-dot-glow-soft-after", state.defaults.glowSoftAfter);
  };

  const clearTimers = (state) => {
    if (state.clickTimer) {
      window.clearTimeout(state.clickTimer);
      state.clickTimer = null;
    }
    if (state.finishTimer) {
      window.clearTimeout(state.finishTimer);
      state.finishTimer = null;
    }
    if (state.popinTimer) {
      window.clearTimeout(state.popinTimer);
      state.popinTimer = null;
    }
  };

  const stopOrbitSmooth = (scope, state) => {
    clearTimers(state);
    scope.style.setProperty("--neon-orbit-color-mode", "default");
    setColorMode(scope, state, "default");
    scope.classList.remove("orbit-running");
    scope.classList.remove("orbit-finish");
    scope.classList.remove("orbit-popin");
  };

  const getAngle = (el, pseudo) => {
    if (!el) return null;
    const transform = getComputedStyle(el, pseudo).transform;
    if (!transform || transform === "none") return null;
    const values =
      transform.match(/matrix3d\\(([^)]+)\\)/) ||
      transform.match(/matrix\\(([^)]+)\\)/);
    if (!values) return null;
    const parts = values[1].split(",").map((v) => parseFloat(v.trim()));
    const [a, b] = parts;
    return Math.atan2(b, a) * (180 / Math.PI);
  };

  const toMs = (value) => {
    if (!value) return 0;
    const num = parseFloat(value);
    if (Number.isNaN(num)) return 0;
    return value.includes("ms") ? num : num * 1000;
  };

  const finishOrbitSequence = (scope, state, target) => {
    clearTimers(state);

    let angleBefore = getAngle(target, "::before");
    let angleAfter = getAngle(target, "::after");

    if (angleBefore === null || angleAfter === null) {
      const periodMs = toMs(getVar(scope, "--neon-orbit-period")) || 6400;
      const rampMs = toMs(getVar(scope, "--neon-orbit-ramp-duration")) || 1200;
      const startDelayMs = toMs(getVar(scope, "--neon-orbit-start-delay")) || 600;
      const elapsed =
        performance.now() - state.orbitStartTimeMs - startDelayMs - rampMs;
      const phase = ((Math.max(0, elapsed) % periodMs) / periodMs) * 360;
      if (angleBefore === null) angleBefore = 180 + phase;
      if (angleAfter === null) angleAfter = 0 + phase;
    }

    scope.style.setProperty("--neon-orbit-start-angle-before", `${angleBefore}deg`);
    scope.style.setProperty("--neon-orbit-start-angle-after", `${angleAfter}deg`);

    requestAnimationFrame(() => {
      scope.classList.remove("orbit-running");
      scope.classList.add("orbit-finish");
      scope.classList.remove("orbit-popin");
    });

    const finishDuration =
      getVar(scope, "--neon-orbit-finish-duration") || "3.4s";
    const popDuration =
      getVar(scope, "--neon-orbit-pop-duration") || "0.4s";

    state.finishTimer = window.setTimeout(() => {
      scope.classList.remove("orbit-finish");
      scope.classList.add("orbit-popin");

      state.popinTimer = window.setTimeout(() => {
        scope.classList.remove("orbit-popin");
        stopOrbitSmooth(scope, state);
        state.orbitMode = "default";
        state.clickCount = 0;
        scope.style.setProperty("--neon-orbit-opacity", "1");
        void scope.offsetWidth;
      }, parseFloat(popDuration) * 1000);
    }, parseFloat(finishDuration) * 1000);
  };

  const startOrbit = (scope, state, mode) => {
    clearTimers(state);
    state.orbitStartTimeMs = performance.now();
    scope.style.setProperty("--neon-orbit-color-mode", mode);
    setColorMode(scope, state, mode);
    scope.classList.add("orbit-running");
    scope.classList.remove("orbit-finish");
    scope.classList.remove("orbit-popin");
  };

  const toggleOrbit = (scope, state, mode, target) => {
    if (scope.classList.contains("orbit-finish") || scope.classList.contains("orbit-popin")) {
      return;
    }
    const running = scope.classList.contains("orbit-running");
    if (running) {
      if (state.orbitMode === "accent") {
        finishOrbitSequence(scope, state, target);
        return;
      }
      stopOrbitSmooth(scope, state);
      return;
    }
    state.orbitMode = mode;
    startOrbit(scope, state, mode);
  };

  const handleClicks = (scope, state, target) => {
    if (state.clickCount === 2) {
      if (state.orbitMode === "accent") {
        state.clickCount = 0;
        state.clickTimer = null;
        return;
      }
      toggleOrbit(scope, state, "default", target);
    } else if (state.clickCount >= 3) {
      toggleOrbit(scope, state, "accent", target);
    }
    state.clickCount = 0;
    state.clickTimer = null;
  };

  const triggers = document.querySelectorAll(".neon-orbit-trigger");
  if (!triggers.length) return;

  triggers.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const scope = getScope(event.currentTarget);
      const state = getState(scope);
      const target = scope.querySelector(".neon-umlaut");
      if (!target) return;
      state.clickCount += 1;
      if (state.clickTimer) {
        window.clearTimeout(state.clickTimer);
      }
      state.clickTimer = window.setTimeout(
        () => handleClicks(scope, state, target),
        clickWindowMs
      );
    });

    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const scope = getScope(event.currentTarget);
      const state = getState(scope);
      const target = scope.querySelector(".neon-umlaut");
      if (!target) return;
      state.clickCount += 1;
      if (state.clickTimer) {
        window.clearTimeout(state.clickTimer);
      }
      state.clickTimer = window.setTimeout(
        () => handleClicks(scope, state, target),
        clickWindowMs
      );
    });
  });
})();
