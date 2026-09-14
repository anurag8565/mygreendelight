/**
 * Haptic Feedback & Tactile Micro-Interactions Utility
 * Provides native mobile vibration patterns (Blinkit/Zepto/Apple style)
 * Safe for SSR and unsupported browsers.
 */

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection";

export const triggerHaptic = (pattern: HapticPattern = "light") => {
  if (typeof window === "undefined" || !navigator || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (pattern) {
      case "light":
      case "selection":
        navigator.vibrate(12);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(35);
        break;
      case "success":
        navigator.vibrate([15, 60, 20]);
        break;
      case "warning":
        navigator.vibrate([25, 40, 25]);
        break;
      case "error":
        navigator.vibrate([30, 40, 30, 40, 40]);
        break;
      default:
        navigator.vibrate(12);
        break;
    }
  } catch {
    // Ignore permissions or unsupported hardware
  }
};
