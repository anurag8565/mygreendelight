/**
 * Real-time Audio Alert Generator (SubziQuick Order Chime)
 * Uses native Web Audio API with zero external file dependencies
 */

class AudioAlertManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction or call
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_sound_muted", String(muted));
    }
  }

  public getIsMuted(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_sound_muted");
      if (stored !== null) return stored === "true";
    }
    return this.isMuted;
  }

  /**
   * High-clarity double chime: Ding-Dong!
   */
  public playNewOrderAlert() {
    if (this.getIsMuted()) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: 659.25 Hz (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.18);
      gain2.gain.setValueAtTime(0.4, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.6);

      // Note 3: 1318.51 Hz (E6 - celebratory high chime)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(1318.51, now + 0.38);
      gain3.gain.setValueAtTime(0.45, now + 0.38);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.38);
      osc3.stop(now + 0.9);

      // Optional Web Speech Voice
      if ("speechSynthesis" in window) {
        try {
          const utterance = new SpeechSynthesisUtterance("New order received!");
          utterance.rate = 1.1;
          utterance.volume = 0.8;
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Audio Alert play error:", err);
    }
  }
}

export const audioAlert = new AudioAlertManager();
