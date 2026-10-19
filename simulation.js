/**
 * FLUIDLAB - Physics Simulation Engine (HTML5 Canvas 2D)
 * Didesain cerah, kontras tinggi, dan teks tebal agar tidak blur di proyektor InFocus kelas.
 */

class FluidSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Simulation State
    this.mode = 'single'; // 'single' | 'branched'
    this.isRunning = true;
    this.showVectors = true;
    this.showParticles = true;
    this.showManometers = true;
    this.fluidDensity = 1000; // kg/m^3 (Air murni)

    // Physics Parameters (SI Units)
    this.d1 = 0.40; // 40 cm
    this.d2 = 0.20; // 20 cm
    this.d3 = 0.20; // 20 cm (cabang 2 pada mode branched)
    this.v1 = 2.0;  // 2.0 m/s

    // Particle system
    this.particles = [];
    this.maxParticles = 160;
    this.initParticles();

    // Responsive Canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Animation Loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.min(520, Math.max(380, window.innerHeight * 0.48));

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(Math.random()));
    }
  }

  createParticle(initialProgress = 0) {
    return {
      x: initialProgress * (this.width || 800),
      offsetRel: (Math.random() * 1.7) - 0.85,
      size: 3.0 + Math.random() * 2.8,
      alpha: 0.65 + Math.random() * 0.35,
      branchChoice: Math.random() > 0.5 ? 1 : 2,
      bubble: Math.random() > 0.82
    };
  }

  calculatePhysics() {
    const A1 = (Math.PI * Math.pow(this.d1, 2)) / 4;
    const A2 = (Math.PI * Math.pow(this.d2, 2)) / 4;
    const Q1 = A1 * this.v1;

    if (this.mode === 'single') {
      const v2 = Q1 / A2;
      const Q2 = A2 * v2;
      const g = 9.8;
      const deltaH = (Math.pow(v2, 2) - Math.pow(this.v1, 2)) / (2 * g);

      return {
        mode: 'single',
        d1: this.d1,
        d2: this.d2,
        A1,
        A2,
        v1: this.v1,
        v2,
        Q1,
        Q2,
        deltaH
      };
    } else {
      const A3 = (Math.PI * Math.pow(this.d3, 2)) / 4;
      const totalBranchArea = A2 + A3;
      const Q2 = Q1 * (A2 / totalBranchArea);
      const Q3 = Q1 * (A3 / totalBranchArea);
      const v2 = Q2 / A2;
      const v3 = Q3 / A3;

      return {
        mode: 'branched',
        d1: this.d1,
        d2: this.d2,
        d3: this.d3,
        A1,
        A2,
        A3,
        v1: this.v1,
        v2,
        v3,
        Q1,
        Q2,
        Q3
      };
    }
  }

  getSinglePipeBounds(x) {
    const centerY = this.height / 2;
    const xTransStart = this.width * 0.35;
    const xTransEnd = this.width * 0.65;

    const maxPixelRadius = this.height * 0.36;
    const r1 = (this.d1 / 0.60) * maxPixelRadius;
    const r2 = (this.d2 / 0.60) * maxPixelRadius;

    let r = r1;
    let localV = this.v1;
    const phys = this.calculatePhysics();

    if (x < xTransStart) {
      r = r1;
      localV = phys.v1;
    } else if (x > xTransEnd) {
      r = r2;
      localV = phys.v2;
    } else {
      const t = (x - xTransStart) / (xTransEnd - xTransStart);
      const smoothT = t * t * (3 - 2 * t);
      r = r1 + (r2 - r1) * smoothT;

      const localArea = Math.PI * Math.pow(r, 2);
      const refArea1 = Math.PI * Math.pow(r1, 2);
      localV = phys.v1 * (refArea1 / localArea);
    }

    return {
      top: centerY - r,
      bottom: centerY + r,
      radius: r,
      centerY,
      localV
    };
  }

  getBranchedPipeBounds(x, branchChoice = 1) {
    const centerY = this.height / 2;
    const xSplitStart = this.width * 0.30;
    const xSplitEnd = this.width * 0.55;

    const maxPixelRadius = this.height * 0.30;
    const r1 = (this.d1 / 0.60) * maxPixelRadius;
    const r2 = (this.d2 / 0.60) * (maxPixelRadius * 0.72);
    const r3 = (this.d3 / 0.60) * (maxPixelRadius * 0.72);

    const branchSpacing = this.height * 0.28;
    const centerBranch1 = centerY - branchSpacing;
    const centerBranch2 = centerY + branchSpacing;

    const phys = this.calculatePhysics();

    if (x < xSplitStart) {
      return {
        top: centerY - r1,
        bottom: centerY + r1,
        centerY: centerY,
        radius: r1,
        localV: phys.v1
      };
    } else if (x > xSplitEnd) {
      if (branchChoice === 1) {
        return {
          top: centerBranch1 - r2,
          bottom: centerBranch1 + r2,
          centerY: centerBranch1,
          radius: r2,
          localV: phys.v2
        };
      } else {
        return {
          top: centerBranch2 - r3,
          bottom: centerBranch2 + r3,
          centerY: centerBranch2,
          radius: r3,
          localV: phys.v3
        };
      }
    } else {
      const t = (x - xSplitStart) / (xSplitEnd - xSplitStart);
      const smoothT = t * t * (3 - 2 * t);

      const targetCenter = branchChoice === 1 ? centerBranch1 : centerBranch2;
      const targetR = branchChoice === 1 ? r2 : r3;
      const targetV = branchChoice === 1 ? phys.v2 : phys.v3;

      const currentCenter = centerY + (targetCenter - centerY) * smoothT;
      const currentR = r1 + (targetR - r1) * smoothT;
      const currentV = phys.v1 + (targetV - phys.v1) * smoothT;

      return {
        top: currentCenter - currentR,
        bottom: currentCenter + currentR,
        centerY: currentCenter,
        radius: currentR,
        localV: currentV
      };
    }
  }

  drawSinglePipe() {
    const ctx = this.ctx;
    const steps = 40;
    const stepSize = this.width / steps;

    // Fluid Body Fill - Bright High-Contrast Oceanic Gradient
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize;
      const bounds = this.getSinglePipeBounds(x);
      if (i === 0) ctx.moveTo(x, bounds.top);
      else ctx.lineTo(x, bounds.top);
    }
    for (let i = steps; i >= 0; i--) {
      const x = i * stepSize;
      const bounds = this.getSinglePipeBounds(x);
      ctx.lineTo(x, bounds.bottom);
    }
    ctx.closePath();

    const waterGrad = ctx.createLinearGradient(0, 0, this.width, 0);
    waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    waterGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.55)');
    waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.70)');
    ctx.fillStyle = waterGrad;
    ctx.fill();

    // Bold Outer Pipe Border for InFocus
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0284c7';
    ctx.shadowColor = 'rgba(2, 132, 199, 0.35)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    this.drawStreamlineCurves();

    if (this.showManometers) {
      this.drawManometers();
    }

    this.drawMeasurementOverlays();
  }

  drawBranchedPipe() {
    const ctx = this.ctx;
    const steps = 40;
    const stepSize = this.width / steps;

    // Branch 1
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize;
      const bounds = this.getBranchedPipeBounds(x, 1);
      if (i === 0) ctx.moveTo(x, bounds.top);
      else ctx.lineTo(x, bounds.top);
    }
    for (let i = steps; i >= 0; i--) {
      const x = i * stepSize;
      const bounds = this.getBranchedPipeBounds(x, 1);
      ctx.lineTo(x, bounds.bottom);
    }
    ctx.closePath();

    const grad1 = ctx.createLinearGradient(0, 0, this.width, 0);
    grad1.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    grad1.addColorStop(1, 'rgba(6, 182, 212, 0.65)');
    ctx.fillStyle = grad1;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0284c7';
    ctx.stroke();
    ctx.restore();

    // Branch 2
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize;
      const bounds = this.getBranchedPipeBounds(x, 2);
      if (i === 0) ctx.moveTo(x, bounds.top);
      else ctx.lineTo(x, bounds.top);
    }
    for (let i = steps; i >= 0; i--) {
      const x = i * stepSize;
      const bounds = this.getBranchedPipeBounds(x, 2);
      ctx.lineTo(x, bounds.bottom);
    }
    ctx.closePath();

    ctx.fillStyle = grad1;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0891b2';
    ctx.stroke();
    ctx.restore();

    this.drawBranchedMeasurementOverlays();
  }

  drawStreamlineCurves() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 6]);

    const offsets = [-0.6, -0.3, 0, 0.3, 0.6];
    offsets.forEach(offset => {
      ctx.beginPath();
      for (let x = 0; x <= this.width; x += 10) {
        const bounds = this.getSinglePipeBounds(x);
        const y = bounds.centerY + bounds.radius * offset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  drawManometers() {
    const ctx = this.ctx;
    const phys = this.calculatePhysics();

    const x1 = this.width * 0.18;
    const x2 = this.width * 0.82;

    const b1 = this.getSinglePipeBounds(x1);
    const b2 = this.getSinglePipeBounds(x2);

    const tubeWidth = 18;
    const maxTubeH = this.height * 0.34;

    const baseH1 = maxTubeH * 0.85;
    const speedRatio = phys.v2 / Math.max(0.1, phys.v1);
    const h2Clamped = Math.max(maxTubeH * 0.18, baseH1 - Math.min(baseH1 * 0.72, (speedRatio - 1) * 26));

    this.drawSingleTube(x1, b1.top, tubeWidth, maxTubeH, baseH1, 'P₁ (Tekanan Tinggi)');
    this.drawSingleTube(x2, b2.top, tubeWidth, maxTubeH, h2Clamped, phys.v2 > phys.v1 ? 'P₂ (Tekanan Rendah)' : 'P₂');
  }

  drawSingleTube(x, pipeTopY, width, totalHeight, fluidHeight, label) {
    const ctx = this.ctx;
    const tubeTop = Math.max(12, pipeTopY - totalHeight);

    ctx.save();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x - width / 2, tubeTop, width, pipeTopY - tubeTop);

    const fluidY = pipeTopY - fluidHeight;
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(x - width / 2 + 1.5, fluidY, width - 3, fluidHeight);

    // Large bold label for InFocus
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, tubeTop - 6);
    ctx.restore();
  }

  drawMeasurementOverlays() {
    const ctx = this.ctx;
    const phys = this.calculatePhysics();

    const x1 = this.width * 0.18;
    const x2 = this.width * 0.82;
    const b1 = this.getSinglePipeBounds(x1);
    const b2 = this.getSinglePipeBounds(x2);

    this.drawSectionBadge(x1, b1.bottom + 34, `A₁ = ${(phys.A1 * 10000).toFixed(1)} cm²`, `d₁ = ${(phys.d1 * 100).toFixed(0)} cm`, `v₁ = ${phys.v1.toFixed(1)} m/s`, '#0284c7');
    this.drawSectionBadge(x2, b2.bottom + 34, `A₂ = ${(phys.A2 * 10000).toFixed(1)} cm²`, `d₂ = ${(phys.d2 * 100).toFixed(0)} cm`, `v₂ = ${phys.v2.toFixed(1)} m/s`, '#0891b2');

    if (this.showVectors) {
      this.drawVelocityVector(x1, b1.centerY, phys.v1, '#0284c7');
      this.drawVelocityVector(x2, b2.centerY, phys.v2, '#0891b2');
    }
  }

  drawBranchedMeasurementOverlays() {
    const ctx = this.ctx;
    const phys = this.calculatePhysics();

    const x1 = this.width * 0.16;
    const x2 = this.width * 0.82;
    const b1 = this.getBranchedPipeBounds(x1, 1);
    const b2 = this.getBranchedPipeBounds(x2, 1);
    const b3 = this.getBranchedPipeBounds(x2, 2);

    this.drawSectionBadge(x1, b1.bottom + 30, `Pipa Utama (1)`, `A₁ = ${(phys.A1 * 10000).toFixed(0)} cm²`, `v₁ = ${phys.v1.toFixed(1)} m/s`, '#0284c7');
    this.drawSectionBadge(x2, b2.top - 30, `Cabang A (2)`, `A₂ = ${(phys.A2 * 10000).toFixed(0)} cm²`, `v₂ = ${phys.v2.toFixed(1)} m/s`, '#0891b2');
    this.drawSectionBadge(x2, b3.bottom + 30, `Cabang B (3)`, `A₃ = ${(phys.A3 * 10000).toFixed(0)} cm²`, `v₃ = ${phys.v3.toFixed(1)} m/s`, '#7c3aed');

    if (this.showVectors) {
      this.drawVelocityVector(x1, b1.centerY, phys.v1, '#0284c7');
      this.drawVelocityVector(x2, b2.centerY, phys.v2, '#0891b2');
      this.drawVelocityVector(x2, b3.centerY, phys.v3, '#7c3aed');
    }
  }

  drawSectionBadge(x, y, line1, line2, line3, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const w = 150;
    const h = 58;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(line1, x, y - 9);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.fillText(`${line2} | ${line3}`, x, y + 12);
    ctx.restore();
  }

  drawVelocityVector(x, y, velocity, color) {
    const ctx = this.ctx;
    const arrowLength = Math.min(105, Math.max(35, velocity * 14));

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3.5;

    ctx.beginPath();
    ctx.moveTo(x - arrowLength / 2, y);
    ctx.lineTo(x + arrowLength / 2, y);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(x + arrowLength / 2, y);
    ctx.lineTo(x + arrowLength / 2 - 10, y - 6);
    ctx.lineTo(x + arrowLength / 2 - 10, y + 6);
    ctx.closePath();
    ctx.fill();

    // Bold Text tag for InFocus
    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, x, y - 12);
    ctx.restore();
  }

  updateAndDrawParticles(dt) {
    if (!this.showParticles) return;
    const ctx = this.ctx;

    this.particles.forEach(p => {
      let bounds;
      if (this.mode === 'single') {
        bounds = this.getSinglePipeBounds(p.x);
      } else {
        bounds = this.getBranchedPipeBounds(p.x, p.branchChoice);
      }

      if (this.isRunning) {
        const visualSpeed = bounds.localV * 85 * dt;
        p.x += visualSpeed;

        if (p.x > this.width + 12) {
          p.x = -12;
          p.offsetRel = (Math.random() * 1.7) - 0.85;
          p.branchChoice = Math.random() > 0.5 ? 1 : 2;
        }
      }

      const y = bounds.centerY + bounds.radius * p.offsetRel;

      ctx.save();
      if (p.bubble) {
        ctx.strokeStyle = '#0284c7';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.isRunning && bounds.localV > 1.0) {
          ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
          ctx.lineWidth = p.size * 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, y);
          ctx.lineTo(p.x - Math.min(25, bounds.localV * 5), y);
          ctx.stroke();
        }
      }
      ctx.restore();
    });
  }

  animate(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === 'single') {
      this.drawSinglePipe();
    } else {
      this.drawBranchedPipe();
    }

    this.updateAndDrawParticles(dt);
    requestAnimationFrame(this.animate);
  }

  setMode(newMode) {
    this.mode = newMode;
    this.initParticles();
    if (window.fluidAudio) window.fluidAudio.playSwitchSound();
  }

  play() { this.isRunning = true; }
  pause() { this.isRunning = false; }
  reset() {
    this.d1 = 0.40;
    this.d2 = 0.20;
    this.d3 = 0.20;
    this.v1 = 2.0;
    this.initParticles();
    if (window.fluidAudio) window.fluidAudio.playClickSound();
  }
}

window.FluidSimulation = FluidSimulation;
