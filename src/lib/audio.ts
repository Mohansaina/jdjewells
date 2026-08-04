// Web Audio API Synth Engine for luxury background soundscapes and interaction cues
class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plays a soft, beautiful ambient chord (C Maj9 chord: C3, G3, C4, E4, B4, D5)
  public startAmbient() {
    this.initCtx();
    if (this.isAmbientPlaying || !this.ctx) return;

    this.isAmbientPlaying = true;
    const now = this.ctx.currentTime;

    // Global gain node for volume control
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, now);
    this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 3.0); // Slow fade-in

    // Lowpass filter to keep it warm and non-distracting
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    filter.connect(this.ctx.destination);
    this.ambientGain.connect(filter);

    // Frequencies for C Maj9 chord
    const frequencies = [130.81, 196.00, 261.63, 329.63, 493.88, 587.33];

    this.ambientOscs = frequencies.map((freq, index) => {
      if (!this.ctx) throw new Error();
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Low frequency modulation (LFO) for organic volume movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, now);
      lfoGain.gain.setValueAtTime(0.15, now);

      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      oscGain.gain.setValueAtTime(0.1, now);
      osc.connect(oscGain);
      oscGain.connect(this.ambientGain!);

      osc.start(now);

      return { osc, gain: oscGain };
    });
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;

    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.5); // Fade out

    setTimeout(() => {
      this.ambientOscs.forEach(o => {
        try { o.osc.stop(); } catch {}
      });
      this.ambientOscs = [];
      this.isAmbientPlaying = false;
    }, 1600);
  }

  // High-fidelity micro-chime sound effect for hovering over luxury products
  public playHoverChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15); // Quick downward slide

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.015, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35); // Smooth tail release

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Micro click interface sound when clicking buttons
  public playClickCue() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }
}

// Export singleton instance
export const audio = new AudioEngine();
