/**
 * Quantum Dino Runner - Retro Canvas Mini-Game
 * ============================================
 * An endless runner inspired by Chrome's classic "No Internet" Dino game,
 * upgraded with cyberpunk anime physics, Web Audio 8-bit sound synthesis,
 * obstacle varieties, collectibles, local high score, and mobile touch support.
 */

(function () {
  'use strict';

  // --- Sound Synthesizer (Web Audio API) ---
  class SoundFx {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('quantum_dino_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('quantum_dino_muted', String(this.muted));
      return this.muted;
    }

    playJump() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playScore() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [587.33, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.09, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.08);
      });
    }

    playPickup() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.08, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.06);
      });
    }

    playHit() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.28);
    }
  }

  // --- Main Game Class ---
  class QuantumDinoGame {
    constructor() {
      this.canvas = document.getElementById('quantumDinoCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      // Elements
      this.container = document.getElementById('dinoGameContainer');
      this.scoreEl = document.getElementById('dinoScore');
      this.hiScoreEl = document.getElementById('dinoHiScore');
      this.speedEl = document.getElementById('dinoSpeedLevel');
      this.muteBtn = document.getElementById('dinoMuteBtn');
      this.restartBtn = document.getElementById('dinoRestartBtn');
      this.overlay = document.getElementById('dinoOverlay');
      this.overlayTitle = document.getElementById('dinoOverlayTitle');
      this.overlaySubtitle = document.getElementById('dinoOverlaySubtitle');

      // Mobile Touch Buttons
      this.jumpBtn = document.getElementById('dinoTouchJump');
      this.duckBtn = document.getElementById('dinoTouchDuck');

      // Audio
      this.sound = new SoundFx();

      // Virtual Canvas Dimensions
      this.V_WIDTH = 800;
      this.V_HEIGHT = 260;
      this.GROUND_Y = 210;

      // High Score
      this.hiScore = parseInt(localStorage.getItem('quantum_dino_hi_score') || '0', 10);

      // State
      this.state = 'IDLE'; // IDLE, RUNNING, GAMEOVER, PAUSED
      this.score = 0;
      this.distance = 0;
      this.speed = 6;
      this.baseSpeed = 6;
      this.lastTimestamp = 0;
      this.lastScoreBeep = 0;

      // Dino Player
      this.dino = {
        x: 60,
        y: this.GROUND_Y - 44,
        w: 40,
        h: 44,
        vy: 0,
        jumpForce: -11.5,
        gravity: 0.58,
        isGrounded: true,
        isDucking: false,
        animFrame: 0,
        animTimer: 0,
        normalH: 44,
        duckH: 26,
        color: '#00d4ff'
      };

      // Entities
      this.obstacles = [];
      this.collectibles = [];
      this.clouds = [];
      this.groundParticles = [];
      this.stars = [];
      this.particles = [];

      // Timing & Spawn
      this.nextObstacleDistance = 0;
      this.nextCollectibleDistance = 0;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      this.updateHiScoreDisplay();
      this.updateMuteButton();

      // Initialize background stars & clouds
      for (let i = 0; i < 8; i++) {
        this.clouds.push({
          x: Math.random() * this.V_WIDTH,
          y: 25 + Math.random() * 65,
          speed: 0.3 + Math.random() * 0.4,
          w: 40 + Math.random() * 30
        });
      }

      for (let i = 0; i < 20; i++) {
        this.stars.push({
          x: Math.random() * this.V_WIDTH,
          y: Math.random() * 120,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.2
        });
      }

      this.bindEvents();
      this.setupObserver();
      this.draw(); // initial render
    }

    resize() {
      if (!this.canvas || !this.container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = this.V_WIDTH * dpr;
      this.canvas.height = this.V_HEIGHT * dpr;
      this.ctx.scale(dpr, dpr);
    }

    bindEvents() {
      // Keyboard input
      window.addEventListener('keydown', (e) => {
        if (!this.isGameVisible()) return;

        if (e.code === 'Space' || e.code === 'ArrowUp') {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          if (activeTag !== 'input' && activeTag !== 'textarea') {
            e.preventDefault();
            this.handleJump();
          }
        } else if (e.code === 'ArrowDown') {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          if (activeTag !== 'input' && activeTag !== 'textarea') {
            e.preventDefault();
            this.handleDuck(true);
          }
        } else if (e.code === 'KeyP') {
          this.togglePause();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowDown') {
          this.handleDuck(false);
        }
      });

      // Canvas / Container clicks & taps
      this.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handleJump();
      });

      // Start / Restart button
      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.startOrRestart();
        });
      }

      // Overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', () => {
          this.startOrRestart();
        });
      }

      // Mute Toggle
      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sound.toggleMute();
          this.updateMuteButton();
        });
      }

      // Mobile Touch Buttons
      if (this.jumpBtn) {
        this.jumpBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.handleJump();
        });
      }

      if (this.duckBtn) {
        this.duckBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.handleDuck(true);
        });
        this.duckBtn.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.handleDuck(false);
        });
      }
    }

    setupObserver() {
      // Pause game automatically when user scrolls away to save CPU
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && this.state === 'RUNNING') {
              this.state = 'PAUSED';
              this.showOverlay('PAUSED', 'Click or Press P to Resume');
            }
          });
        }, { threshold: 0.15 });

        observer.observe(this.container);
      }
    }

    isGameVisible() {
      if (!this.container) return false;
      const rect = this.container.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    updateMuteButton() {
      if (!this.muteBtn) return;
      this.muteBtn.textContent = this.sound.muted ? '🔇 Muted' : '🔊 Sound';
      this.muteBtn.setAttribute('aria-pressed', String(!this.sound.muted));
    }

    updateHiScoreDisplay() {
      if (this.hiScoreEl) {
        this.hiScoreEl.textContent = String(this.hiScore).padStart(5, '0');
      }
    }

    handleJump() {
      if (this.state === 'IDLE' || this.state === 'GAMEOVER') {
        this.startOrRestart();
        return;
      }
      if (this.state === 'PAUSED') {
        this.state = 'RUNNING';
        this.hideOverlay();
        this.lastTimestamp = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        return;
      }
      if (this.state === 'RUNNING' && this.dino.isGrounded) {
        this.dino.vy = this.dino.jumpForce;
        this.dino.isGrounded = false;
        this.sound.playJump();
        this.createJumpParticles();
      }
    }

    handleDuck(isDucking) {
      if (this.state !== 'RUNNING') return;
      this.dino.isDucking = isDucking;
      if (isDucking) {
        this.dino.h = this.dino.duckH;
        if (this.dino.isGrounded) {
          this.dino.y = this.GROUND_Y - this.dino.duckH;
        } else {
          this.dino.vy += 3.5;
        }
      } else {
        this.dino.h = this.dino.normalH;
        if (this.dino.isGrounded) {
          this.dino.y = this.GROUND_Y - this.dino.normalH;
        }
      }
    }

    togglePause() {
      if (this.state === 'RUNNING') {
        this.state = 'PAUSED';
        this.showOverlay('PAUSED', 'Press P or Click to Resume');
      } else if (this.state === 'PAUSED') {
        this.state = 'RUNNING';
        this.hideOverlay();
        this.lastTimestamp = performance.now();
        requestAnimationFrame((t) => this.loop(t));
      }
    }

    startOrRestart() {
      this.state = 'RUNNING';
      this.score = 0;
      this.distance = 0;
      this.speed = this.baseSpeed;
      this.lastScoreBeep = 0;

      // Reset Player
      this.dino.y = this.GROUND_Y - this.dino.normalH;
      this.dino.h = this.dino.normalH;
      this.dino.vy = 0;
      this.dino.isGrounded = true;
      this.dino.isDucking = false;

      // Clear Entities
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.groundParticles = [];

      this.nextObstacleDistance = 80 + Math.random() * 50;
      this.nextCollectibleDistance = 140 + Math.random() * 80;

      this.hideOverlay();
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    showOverlay(title, subtitle) {
      if (!this.overlay) return;
      if (this.overlayTitle) this.overlayTitle.textContent = title;
      if (this.overlaySubtitle) this.overlaySubtitle.textContent = subtitle;
      this.overlay.classList.add('visible');
    }

    hideOverlay() {
      if (this.overlay) {
        this.overlay.classList.remove('visible');
      }
    }

    // --- Game Loop ---
    loop(timestamp) {
      if (this.state !== 'RUNNING') return;

      const dt = Math.min((timestamp - this.lastTimestamp) / 16.667, 2.5);
      this.lastTimestamp = timestamp;

      this.update(dt);
      this.draw();

      if (this.state === 'RUNNING') {
        requestAnimationFrame((t) => this.loop(t));
      }
    }

    update(dt) {
      // Advance distance & score
      this.distance += this.speed * dt;
      this.score = Math.floor(this.distance / 10);

      // Speed acceleration
      this.speed = this.baseSpeed + Math.min(this.score / 280, 8.5);

      // Milestone audio feedback (every 100 points)
      const currentHundred = Math.floor(this.score / 100);
      if (currentHundred > this.lastScoreBeep && this.score > 0) {
        this.lastScoreBeep = currentHundred;
        this.sound.playScore();
      }

      // Update HUD
      if (this.scoreEl) {
        this.scoreEl.textContent = String(this.score).padStart(5, '0');
      }
      if (this.speedEl) {
        this.speedEl.textContent = `${(this.speed / this.baseSpeed).toFixed(1)}x`;
      }

      // Update Player Physics
      if (!this.dino.isGrounded) {
        this.dino.vy += this.dino.gravity * dt;
        this.dino.y += this.dino.vy * dt;

        if (this.dino.y >= this.GROUND_Y - this.dino.h) {
          this.dino.y = this.GROUND_Y - this.dino.h;
          this.dino.vy = 0;
          this.dino.isGrounded = true;
        }
      }

      // Run animation frames
      this.dino.animTimer += dt;
      if (this.dino.animTimer > 5.5) {
        this.dino.animTimer = 0;
        this.dino.animFrame = (this.dino.animFrame + 1) % 2;
      }

      // Spawn Obstacles
      this.nextObstacleDistance -= this.speed * dt;
      if (this.nextObstacleDistance <= 0) {
        this.spawnObstacle();
        this.nextObstacleDistance = 220 + Math.random() * 180 + this.speed * 12;
      }

      // Spawn Collectibles
      this.nextCollectibleDistance -= this.speed * dt;
      if (this.nextCollectibleDistance <= 0) {
        this.spawnCollectible();
        this.nextCollectibleDistance = 350 + Math.random() * 400;
      }

      // Update Obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed * dt;

        if (obs.isFlying) {
          obs.wingTimer += dt;
          if (obs.wingTimer > 6) {
            obs.wingTimer = 0;
            obs.wingUp = !obs.wingUp;
          }
        }

        if (this.checkCollision(this.dino, obs)) {
          this.triggerGameOver();
          return;
        }

        if (obs.x + obs.w < -20) {
          this.obstacles.splice(i, 1);
        }
      }

      // Update Collectibles
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.x -= this.speed * dt;
        item.floatOffset = Math.sin((this.distance + item.x) * 0.05) * 5;

        if (this.checkCollision(this.dino, item)) {
          this.sound.playPickup();
          this.distance += item.points * 10;
          this.createPickupParticles(item.x + item.w / 2, item.y + item.h / 2, item.color);
          this.collectibles.splice(i, 1);
          continue;
        }

        if (item.x + item.w < -20) {
          this.collectibles.splice(i, 1);
        }
      }

      // Update Background Clouds
      this.clouds.forEach((cloud) => {
        cloud.x -= cloud.speed * dt * (this.speed / 6);
        if (cloud.x + cloud.w < -30) {
          cloud.x = this.V_WIDTH + 20;
          cloud.y = 20 + Math.random() * 70;
        }
      });

      // Ground Texture Dots
      if (Math.random() < 0.35) {
        this.groundParticles.push({
          x: this.V_WIDTH,
          y: this.GROUND_Y + 4 + Math.random() * 35,
          w: Math.random() * 6 + 2,
          speed: this.speed
        });
      }
      for (let i = this.groundParticles.length - 1; i >= 0; i--) {
        const gp = this.groundParticles[i];
        gp.x -= gp.speed * dt;
        if (gp.x < -10) this.groundParticles.splice(i, 1);
      }

      // Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= 0.03 * dt;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    spawnObstacle() {
      const types = ['cactus_single', 'cactus_double', 'cactus_triple', 'bug_ground'];
      if (this.score > 220 && Math.random() < 0.4) {
        types.push('pterodactyl_low', 'pterodactyl_high');
      }

      const selected = types[Math.floor(Math.random() * types.length)];

      if (selected === 'cactus_single') {
        this.obstacles.push({
          type: selected,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 38,
          w: 20,
          h: 38,
          color: '#00ff88'
        });
      } else if (selected === 'cactus_double') {
        this.obstacles.push({
          type: selected,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 42,
          w: 38,
          h: 42,
          color: '#00ff88'
        });
      } else if (selected === 'cactus_triple') {
        this.obstacles.push({
          type: selected,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 44,
          w: 54,
          h: 44,
          color: '#00ff88'
        });
      } else if (selected === 'bug_ground') {
        this.obstacles.push({
          type: selected,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 28,
          w: 32,
          h: 28,
          color: '#ff2d95'
        });
      } else if (selected === 'pterodactyl_low') {
        this.obstacles.push({
          type: selected,
          isFlying: true,
          wingUp: false,
          wingTimer: 0,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 50,
          w: 36,
          h: 24,
          color: '#7b2fff'
        });
      } else if (selected === 'pterodactyl_high') {
        this.obstacles.push({
          type: selected,
          isFlying: true,
          wingUp: false,
          wingTimer: 0,
          x: this.V_WIDTH + 10,
          y: this.GROUND_Y - 74,
          w: 36,
          h: 24,
          color: '#7b2fff'
        });
      }
    }

    spawnCollectible() {
      const isPill = Math.random() < 0.45;
      this.collectibles.push({
        type: isPill ? 'pill' : 'coffee',
        points: isPill ? 100 : 50,
        x: this.V_WIDTH + 10,
        y: this.GROUND_Y - 65 - Math.random() * 30,
        w: 22,
        h: 22,
        floatOffset: 0,
        color: isPill ? '#ff2d95' : '#00d4ff'
      });
    }

    checkCollision(dino, obj) {
      const padX = 5;
      const padY = 4;
      const objY = obj.floatOffset ? obj.y + obj.floatOffset : obj.y;

      return (
        dino.x + padX < obj.x + obj.w - padX &&
        dino.x + dino.w - padX > obj.x + padX &&
        dino.y + padY < objY + obj.h - padY &&
        dino.y + dino.h - padY > objY + padY
      );
    }

    triggerGameOver() {
      this.state = 'GAMEOVER';
      this.sound.playHit();
      this.createCrashParticles(this.dino.x + this.dino.w / 2, this.dino.y + this.dino.h / 2);

      if (this.score > this.hiScore) {
        this.hiScore = this.score;
        localStorage.setItem('quantum_dino_hi_score', String(this.hiScore));
        this.updateHiScoreDisplay();
      }

      this.showOverlay('GAME OVER', `Final Score: ${this.score} · Press SPACE or TAP to Retry`);
      this.draw();
    }

    // --- Particle Effects ---
    createJumpParticles() {
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: this.dino.x + 8 + Math.random() * 15,
          y: this.GROUND_Y - 2,
          vx: (Math.random() - 0.7) * 2.5,
          vy: -Math.random() * 2,
          size: Math.random() * 3 + 1.5,
          color: '#00d4ff',
          alpha: 0.8
        });
      }
    }

    createPickupParticles(x, y, color) {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 3 + 1.5,
          color: color,
          alpha: 1.0
        });
      }
    }

    createCrashParticles(x, y) {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 1.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 4 + 2,
          color: Math.random() < 0.5 ? '#ff2d95' : '#00d4ff',
          alpha: 1.0
        });
      }
    }

    // --- Drawing Engine ---
    draw() {
      const ctx = this.ctx;
      const isDark = !document.body.classList.contains('light-theme');

      ctx.clearRect(0, 0, this.V_WIDTH, this.V_HEIGHT);

      // Background Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.V_HEIGHT);
      if (isDark) {
        skyGrad.addColorStop(0, '#0a0a14');
        skyGrad.addColorStop(1, '#101026');
      } else {
        skyGrad.addColorStop(0, '#f0f4f9');
        skyGrad.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.V_WIDTH, this.V_HEIGHT);

      // Stars
      if (isDark) {
        ctx.fillStyle = '#ffffff';
        this.stars.forEach((s) => {
          ctx.globalAlpha = s.alpha;
          ctx.fillRect(s.x, s.y, s.size, s.size);
        });
        ctx.globalAlpha = 1;
      }

      // Clouds
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(100, 116, 139, 0.2)';
      this.clouds.forEach((c) => {
        this.drawPixelCloud(ctx, c.x, c.y, c.w);
      });

      // Horizon & Ground Line
      ctx.strokeStyle = isDark ? '#00d4ff' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, this.GROUND_Y);
      ctx.lineTo(this.V_WIDTH, this.GROUND_Y);
      ctx.stroke();

      // Ground Pixel Dots
      ctx.fillStyle = isDark ? 'rgba(0, 212, 255, 0.25)' : 'rgba(14, 165, 233, 0.3)';
      this.groundParticles.forEach((gp) => {
        ctx.fillRect(gp.x, gp.y, gp.w, 2);
      });

      // Draw Collectibles
      this.collectibles.forEach((item) => {
        this.drawCollectible(ctx, item);
      });

      // Draw Obstacles
      this.obstacles.forEach((obs) => {
        this.drawObstacle(ctx, obs);
      });

      // Draw Dino Player
      this.drawDino(ctx);

      // Draw Particles
      this.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;
    }

    drawPixelCloud(ctx, x, y, w) {
      const h = 14;
      ctx.fillRect(x, y + 4, w, h - 4);
      ctx.fillRect(x + 6, y, w - 12, h);
    }

    drawDino(ctx) {
      const d = this.dino;
      ctx.save();

      const isDark = !document.body.classList.contains('light-theme');
      const baseColor = isDark ? '#00d4ff' : '#0284c7';
      const eyeColor = isDark ? '#ffffff' : '#000000';

      ctx.fillStyle = baseColor;

      if (this.state === 'GAMEOVER') {
        // Crash Pose with 'X' eyes
        ctx.fillRect(d.x + 8, d.y + 4, 24, 26);
        ctx.fillRect(d.x + 18, d.y, 16, 16);
        ctx.fillRect(d.x + 2, d.y + 20, 10, 8);
        ctx.fillRect(d.x + 10, d.y + 30, 6, 12);
        ctx.fillRect(d.x + 22, d.y + 30, 6, 12);

        // 'X' Eyes
        ctx.fillStyle = '#ff2d95';
        ctx.fillRect(d.x + 26, d.y + 4, 3, 3);
        ctx.fillRect(d.x + 30, d.y + 8, 3, 3);
        ctx.fillRect(d.x + 30, d.y + 4, 3, 3);
        ctx.fillRect(d.x + 26, d.y + 8, 3, 3);
      } else if (d.isDucking) {
        // Ducking Pose
        ctx.fillRect(d.x, d.y + 8, 38, 14);
        ctx.fillRect(d.x + 32, d.y + 2, 16, 12);
        ctx.fillRect(d.x + 2, d.y + 6, 8, 6);
        if (d.animFrame === 0) {
          ctx.fillRect(d.x + 12, d.y + 22, 6, 4);
          ctx.fillRect(d.x + 24, d.y + 22, 6, 4);
        } else {
          ctx.fillRect(d.x + 8, d.y + 22, 6, 4);
          ctx.fillRect(d.x + 28, d.y + 22, 6, 4);
        }
        ctx.fillStyle = eyeColor;
        ctx.fillRect(d.x + 42, d.y + 4, 3, 3);
      } else {
        // Running / Jumping Pose
        ctx.fillRect(d.x + 18, d.y, 20, 16);
        ctx.fillRect(d.x + 24, d.y + 14, 14, 6);
        ctx.fillRect(d.x + 10, d.y + 16, 18, 18);
        ctx.fillRect(d.x + 2, d.y + 20, 10, 8);
        ctx.fillRect(d.x + 24, d.y + 22, 6, 4);
        ctx.fillStyle = eyeColor;
        ctx.fillRect(d.x + 26, d.y + 3, 3, 3);

        ctx.fillStyle = baseColor;
        if (!d.isGrounded) {
          ctx.fillRect(d.x + 12, d.y + 34, 5, 8);
          ctx.fillRect(d.x + 20, d.y + 34, 5, 6);
        } else if (d.animFrame === 0) {
          ctx.fillRect(d.x + 12, d.y + 34, 5, 10);
          ctx.fillRect(d.x + 20, d.y + 34, 5, 5);
        } else {
          ctx.fillRect(d.x + 12, d.y + 34, 5, 5);
          ctx.fillRect(d.x + 20, d.y + 34, 5, 10);
        }
      }

      ctx.restore();
    }

    drawObstacle(ctx, obs) {
      ctx.save();
      ctx.fillStyle = obs.color;

      if (obs.type === 'cactus_single') {
        ctx.fillRect(obs.x + 7, obs.y, 6, obs.h);
        ctx.fillRect(obs.x, obs.y + 10, 6, 14);
        ctx.fillRect(obs.x + 5, obs.y + 18, 3, 6);
        ctx.fillRect(obs.x + 14, obs.y + 8, 6, 14);
        ctx.fillRect(obs.x + 12, obs.y + 16, 3, 6);
      } else if (obs.type === 'cactus_double') {
        ctx.fillRect(obs.x + 5, obs.y + 6, 6, obs.h - 6);
        ctx.fillRect(obs.x, obs.y + 16, 5, 12);
        ctx.fillRect(obs.x + 11, obs.y + 14, 5, 12);
        ctx.fillRect(obs.x + 23, obs.y, 7, obs.h);
        ctx.fillRect(obs.x + 17, obs.y + 12, 6, 14);
        ctx.fillRect(obs.x + 30, obs.y + 10, 6, 14);
      } else if (obs.type === 'cactus_triple') {
        ctx.fillRect(obs.x + 5, obs.y + 8, 5, obs.h - 8);
        ctx.fillRect(obs.x + 22, obs.y, 7, obs.h);
        ctx.fillRect(obs.x + 38, obs.y + 4, 6, obs.h - 4);
        ctx.fillRect(obs.x, obs.y + 18, 5, 8);
        ctx.fillRect(obs.x + 44, obs.y + 16, 5, 8);
      } else if (obs.type === 'bug_ground') {
        ctx.fillRect(obs.x + 6, obs.y + 4, 20, 18);
        ctx.fillRect(obs.x, obs.y + 14, 6, 8);
        ctx.fillRect(obs.x + 26, obs.y + 14, 6, 8);
        ctx.fillRect(obs.x + 8, obs.y, 4, 6);
        ctx.fillRect(obs.x + 20, obs.y, 4, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x + 9, obs.y + 8, 3, 3);
        ctx.fillRect(obs.x + 19, obs.y + 8, 3, 3);
      } else if (obs.isFlying) {
        const y = obs.y;
        ctx.fillRect(obs.x + 10, y + 8, 16, 10);
        ctx.fillRect(obs.x + 24, y + 6, 12, 6);
        ctx.fillStyle = '#ff2d95';
        ctx.fillRect(obs.x + 24, y + 7, 2, 2);
        ctx.fillStyle = obs.color;
        if (obs.wingUp) {
          ctx.fillRect(obs.x + 12, y, 6, 10);
          ctx.fillRect(obs.x + 8, y + 2, 6, 8);
        } else {
          ctx.fillRect(obs.x + 12, y + 16, 6, 10);
          ctx.fillRect(obs.x + 8, y + 14, 6, 8);
        }
      }

      ctx.restore();
    }

    drawCollectible(ctx, item) {
      const y = item.y + item.floatOffset;
      ctx.save();

      if (item.type === 'coffee') {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x + 2, y + 4, 14, 16);
        ctx.fillRect(item.x + 16, y + 8, 4, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(item.x + 5, y, 2, 3);
        ctx.fillRect(item.x + 10, y - 2, 2, 3);
      } else {
        ctx.fillStyle = '#ff2d95';
        ctx.fillRect(item.x, y + 2, 10, 16);
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(item.x + 10, y + 2, 10, 16);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(item.x + 4, y + 4, 12, 2);
      }

      ctx.restore();
    }
  }

  // --- Auto-Initialize When DOM is Ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new QuantumDinoGame());
  } else {
    new QuantumDinoGame();
  }
})();

