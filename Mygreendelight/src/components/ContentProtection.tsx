"use client";

import { useEffect } from "react";

export default function ContentProtection() {
  useEffect(() => {
    // 🚫 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow context menu only inside editable inputs for paste/copy
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      return false;
    };

    // 🚫 2. Disable Dragging of Images and Media
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 🚫 3. Disable Shortcuts (Ctrl+S, Ctrl+P, Ctrl+U, F12, Ctrl+Shift+I/J/C)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // F12 (Devtools)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl + S (Save webpage / Save As)
      if (isCtrlOrCmd && (e.key === "s" || e.key === "S" || e.keyCode === 83)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + P (Print webpage to PDF)
      if (isCtrlOrCmd && (e.key === "p" || e.key === "P" || e.keyCode === 80)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + U (View Page Source)
      if (isCtrlOrCmd && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + I / J / C (Inspect Element & Console)
      if (
        isCtrlOrCmd &&
        e.shiftKey &&
        (e.key === "I" ||
          e.key === "i" ||
          e.key === "J" ||
          e.key === "j" ||
          e.key === "C" ||
          e.key === "c" ||
          e.keyCode === 73 ||
          e.keyCode === 74 ||
          e.keyCode === 67)
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  return null;
}
