/**
 * FLUIDLAB - Main Controller & Navigation Router
 * Mendukung 5 Menu Utama termasuk Game Duel Cepat-Tepat 2 Kelompok
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Audio Manager
  const audio = window.fluidAudio;
  const audioBtn = document.getElementById('audioToggleBtn');
  const volumeSlider = document.getElementById('audioVolumeSlider');
  const muteBtn = document.getElementById('audioMuteBtn');
  const eqBars = document.getElementById('audioEqualizer');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audio.toggle();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.setVolume(e.target.value);
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.toggleMute();
    });
  }

  audio.onStateChange((isPlaying, volume, isMuted) => {
    if (audioBtn) {
      audioBtn.innerHTML = isPlaying 
        ? `<svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="hidden sm:inline font-bold">Jeda Musik</span>`
        : `<svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="hidden sm:inline font-bold">Putar Lo-Fi</span>`;
    }

    if (eqBars) {
      if (isPlaying && !isMuted && volume > 0) {
        eqBars.classList.remove('eq-paused');
      } else {
        eqBars.classList.add('eq-paused');
      }
    }

    if (muteBtn) {
      muteBtn.innerHTML = isMuted 
        ? `<svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>`
        : `<svg class="w-5 h-5 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>`;
    }
  });

  // 2. Inisialisasi Simulasi Fisika
  const sim = new FluidSimulation('simCanvas');
  window.simInstance = sim;

  // 3. Inisialisasi Analisis & Hasil
  const analysis = new SimulationAnalysis(sim);
  window.analysisInstance = analysis;

  // 4. Inisialisasi Latihan Soal
  const quiz = new QuizManager();
  window.quizInstance = quiz;

  // 5. Inisialisasi Game Cerdas Cermat 2 Kelompok
  const battleGame = new BattleGame();
  window.battleGameInstance = battleGame;

  // 6. Tab Switching Logic (5 Tabs)
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = {
    'materi': document.getElementById('sec-materi'),
    'simulasi': document.getElementById('sec-simulasi'),
    'hasil': document.getElementById('sec-hasil'),
    'latihan': document.getElementById('sec-latihan'),
    'game': document.getElementById('sec-game')
  };

  function switchTab(targetName) {
    tabs.forEach(tab => {
      if (tab.dataset.tab === targetName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    Object.keys(sections).forEach(key => {
      if (sections[key]) {
        if (key === targetName) {
          sections[key].classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          sections[key].classList.add('hidden');
        }
      }
    });

    if (targetName === 'simulasi') {
      sim.resizeCanvas();
    } else if (targetName === 'hasil') {
      analysis.update();
    } else if (targetName === 'game') {
      if (battleGame.state === 'idle') {
        battleGame.startGame();
      }
    }

    if (window.fluidAudio) window.fluidAudio.playClickSound();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Mobile drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    mobileNav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }

  // 7. Sinkronisasi Kontrol Simulasi & Slider
  const sliderD1 = document.getElementById('slider-d1');
  const sliderD2 = document.getElementById('slider-d2');
  const sliderD3 = document.getElementById('slider-d3');
  const sliderV1 = document.getElementById('slider-v1');

  const valD1 = document.getElementById('val-d1');
  const valD2 = document.getElementById('val-d2');
  const valD3 = document.getElementById('val-d3');
  const valV1 = document.getElementById('val-v1');

  const liveV2 = document.getElementById('live-v2');
  const liveQ = document.getElementById('live-q');

  function updateSimulationFromSliders() {
    if (sliderD1) {
      sim.d1 = parseFloat(sliderD1.value) / 100;
      valD1.textContent = `${sliderD1.value} cm`;
    }
    if (sliderD2) {
      sim.d2 = parseFloat(sliderD2.value) / 100;
      valD2.textContent = `${sliderD2.value} cm`;
    }
    if (sliderD3) {
      sim.d3 = parseFloat(sliderD3.value) / 100;
      valD3.textContent = `${sliderD3.value} cm`;
    }
    if (sliderV1) {
      sim.v1 = parseFloat(sliderV1.value);
      valV1.textContent = `${parseFloat(sliderV1.value).toFixed(1)} m/s`;
    }

    const phys = sim.calculatePhysics();
    if (liveV2) liveV2.textContent = `${phys.v2.toFixed(2)} m/s`;
    if (liveQ) liveQ.textContent = `${(phys.Q1 * 1000).toFixed(2)} L/s`;

    analysis.update();
  }

  [sliderD1, sliderD2, sliderD3, sliderV1].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateSimulationFromSliders);
    }
  });

  // Tombol Simulasi Mode
  const btnModeSingle = document.getElementById('btnModeSingle');
  const btnModeBranched = document.getElementById('btnModeBranched');
  const branchD3Container = document.getElementById('branchD3Container');

  if (btnModeSingle && btnModeBranched) {
    btnModeSingle.addEventListener('click', () => {
      sim.setMode('single');
      btnModeSingle.classList.add('bg-sky-600', 'text-white', 'shadow-md');
      btnModeSingle.classList.remove('text-slate-700', 'bg-transparent');
      btnModeBranched.classList.remove('bg-sky-600', 'text-white', 'shadow-md');
      btnModeBranched.classList.add('text-slate-700', 'bg-transparent');
      if (branchD3Container) branchD3Container.classList.add('hidden');
      updateSimulationFromSliders();
    });

    btnModeBranched.addEventListener('click', () => {
      sim.setMode('branched');
      btnModeBranched.classList.add('bg-sky-600', 'text-white', 'shadow-md');
      btnModeBranched.classList.remove('text-slate-700', 'bg-transparent');
      btnModeSingle.classList.remove('bg-sky-600', 'text-white', 'shadow-md');
      btnModeSingle.classList.add('text-slate-700', 'bg-transparent');
      if (branchD3Container) branchD3Container.classList.remove('hidden');
      updateSimulationFromSliders();
    });
  }

  // Tombol Play, Pause, Reset
  const btnSimPlay = document.getElementById('btnSimPlay');
  const btnSimPause = document.getElementById('btnSimPause');
  const btnSimReset = document.getElementById('btnSimReset');
  const toggleVectorsBtn = document.getElementById('toggleVectors');
  const toggleManometerBtn = document.getElementById('toggleManometers');

  if (btnSimPlay) {
    btnSimPlay.addEventListener('click', () => {
      sim.play();
      if (window.fluidAudio) window.fluidAudio.playClickSound();
    });
  }
  if (btnSimPause) {
    btnSimPause.addEventListener('click', () => {
      sim.pause();
      if (window.fluidAudio) window.fluidAudio.playClickSound();
    });
  }
  if (btnSimReset) {
    btnSimReset.addEventListener('click', () => {
      sim.reset();
      if (sliderD1) sliderD1.value = 40;
      if (sliderD2) sliderD2.value = 20;
      if (sliderD3) sliderD3.value = 20;
      if (sliderV1) sliderV1.value = 2.0;
      updateSimulationFromSliders();
    });
  }

  if (toggleVectorsBtn) {
    toggleVectorsBtn.addEventListener('change', (e) => {
      sim.showVectors = e.target.checked;
    });
  }
  if (toggleManometerBtn) {
    toggleManometerBtn.addEventListener('change', (e) => {
      sim.showManometers = e.target.checked;
    });
  }

  window.navigateToTab = switchTab;
  updateSimulationFromSliders();
});
