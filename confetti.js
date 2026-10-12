/**
 * Lightweight Romantic Confetti Generator
 * Zero dependency canvas confetti with hearts and sparkle stars
 */

const ConfettiCelebration = (() => {
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationId = null;

  function initCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'celebration-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    }
  }

  function resize() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * 50;
      this.size = 12 + Math.random() * 16;
      this.speedY = 2 + Math.random() * 4;
      this.speedX = -2 + Math.random() * 4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
      this.opacity = 1;
      // Jenis partikel: H = heart, S = star, C = circle, R = ribbon
      const types = ['heart', 'heart', 'star', 'ribbon', 'ribbon'];
      this.type = types[Math.floor(Math.random() * types.length)];
      const colors = ['#FF2E93', '#FF6B8B', '#FF85A1', '#FFD166', '#8338EC', '#3A86FF', '#FF0054', '#FFAAA6'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 1.5;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height * 0.8) {
        this.opacity -= 0.015;
      }
    }

    draw() {
      if (!ctx || this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
        ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
        ctx.fill();
      } else if (this.type === 'star') {
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText('✨', -this.size / 2, this.size / 2);
      } else {
        // ribbon / confetti strip
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }

      ctx.restore();
    }
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(loop);
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
  }

  return {
    launch(count = 120) {
      initCanvas();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      if (!animationId) {
        loop();
      }
    },
    stop() {
      particles = [];
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
  };
})();
