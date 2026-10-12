/**
 * Web Audio API Sound Synthesizer
 * Zero-dependency, zero external asset requirement, works offline 100%!
 */

const SoundEngine = (() => {
  let audioCtx = null;
  let isMuted = localStorage.getItem('couple_game_muted') === 'true';

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, delay = 0) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  return {
    isMuted: () => isMuted,
    setMuted: (val) => {
      isMuted = val;
      localStorage.setItem('couple_game_muted', val ? 'true' : 'false');
    },
    toggleMute: () => {
      isMuted = !isMuted;
      localStorage.setItem('couple_game_muted', isMuted ? 'true' : 'false');
      return isMuted;
    },

    // UI Click
    playClick() {
      playTone(600, 'sine', 0.06, 0.08);
    },

    // Dadu menggelinding (serangkaian klik cepat)
    playDiceRoll() {
      if (isMuted) return;
      const count = 7;
      for (let i = 0; i < count; i++) {
        const freq = 280 + Math.random() * 200;
        playTone(freq, 'triangle', 0.05, 0.09, i * 0.07);
      }
    },

    // Langkah pion melompat
    playPawnHop() {
      playTone(523.25, 'sine', 0.1, 0.12); // C5
    },

    // Menaiki tangga (nada naik gembira arpeggio)
    playLadder() {
      if (isMuted) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        playTone(freq, 'sine', 0.22, 0.14, idx * 0.1);
      });
    },

    // Meluncur di ular (nada meluncur turun lucu)
    playSnake() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(550, start);
        osc.frequency.exponentialRampToValueAtTime(150, start + 0.4);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.45);
      } catch (e) {}
    },

    // Buka kartu pertanyaan/tantangan
    playCardFlip() {
      if (isMuted) return;
      playTone(587.33, 'triangle', 0.18, 0.12, 0); // D5
      playTone(880, 'sine', 0.25, 0.1, 0.08); // A5
    },

    // Kemenangan (fanfare meriah)
    playVictory() {
      if (isMuted) return;
      const notes = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.15 },
        { f: 783.99, d: 0.15, t: 0.3 },
        { f: 1046.50, d: 0.4, t: 0.45 },
        { f: 880.00, d: 0.2, t: 0.75 },
        { f: 1046.50, d: 0.6, t: 0.95 }
      ];
      notes.forEach(n => {
        playTone(n.f, 'triangle', n.d, 0.18, n.t);
      });
    }
  };
})();
