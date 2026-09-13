import confetti from "canvas-confetti";

/**
 * Fires a lightweight, elegant celebratory green & gold confetti burst.
 * Designed specifically for SubziQuick quick-commerce rewards & free delivery unlocks.
 */
export const triggerFreeDeliveryConfetti = () => {
  if (typeof window === "undefined") return;

  try {
    // Primary center burst
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#0f8646", "#10b981", "#fbbf24", "#34d399", "#ffffff"],
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true,
    });

    // Gentle side sparkle trails
    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 45,
        origin: { x: 0.15, y: 0.65 },
        colors: ["#0f8646", "#34d399", "#f59e0b"],
        ticks: 180,
        gravity: 1.2,
        scalar: 0.8,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: 25,
        angle: 120,
        spread: 45,
        origin: { x: 0.85, y: 0.65 },
        colors: ["#0f8646", "#34d399", "#f59e0b"],
        ticks: 180,
        gravity: 1.2,
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    }, 120);
  } catch (err) {
    console.warn("Confetti animation skipped:", err);
  }
};
