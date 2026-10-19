/**
 * FLUIDLAB - Game Duel Cepat-Tepat 2 Kelompok (Fluid Battle)
 * Didesain khusus untuk proyektor InFocus kelas.
 * Fitur:
 * - Tim 1 (Kelompok Biru) vs Tim 2 (Kelompok Cyan)
 * - Sistem Bel Tercepat: Tombol keyboard 'A' (Tim 1) & 'L' (Tim 2) atau klik bel di layar
 * - Penilaian Cepat & Tepat: Poin Benar (100) + Bonus Kecepatan (hingga 50 poin)
 * - Kesempatan mencuri poin jika tim pertama salah menjawab
 * - Papan skor besar, sound effects, dan selebrasi juara
 */

const BATTLE_QUESTIONS = [
  {
    id: 1,
    question: "Apa hubungan antara luas penampang pipa (A) dengan kelajuan fluida (v) menurut Asas Kontinuitas?",
    options: [
      "Kelajuan berbanding lurus dengan luas penampang",
      "Kelajuan berbanding terbalik dengan luas penampang",
      "Kelajuan tidak dipengaruhi oleh luas penampang",
      "Kelajuan selalu sama di setiap penampang"
    ],
    correct: 1,
    explanation: "Asas Kontinuitas menyatakan A · v = konstan. Artinya kelajuan fluida berbanding TERBALIK dengan luas penampang (pipa menyempit -> fluida mengalir lebih cepat)."
  },
  {
    id: 2,
    question: "Jika diameter pipa menyempit menjadi SETENGAH (½ kali) dari semula, maka kelajuan air akan menjadi...",
    options: [
      "2 kali lebih cepat",
      "4 kali lebih cepat",
      "8 kali lebih cepat",
      "Tetap sama"
    ],
    correct: 1,
    explanation: "v₂ = (d₁ / d₂)² · v₁. Karena d₂ = ½ d₁, maka (d₁ / ½ d₁)² = 2² = 4 kali lebih cepat!"
  },
  {
    id: 3,
    question: "Pipa induk mengalirkan air berdebit 20 Liter/detik lalu bercabang menjadi Pipa X (8 L/s) dan Pipa Y. Berapa debit Pipa Y?",
    options: [
      "28 Liter/detik",
      "12 Liter/detik",
      "16 Liter/detik",
      "10 Liter/detik"
    ],
    correct: 1,
    explanation: "Kekekalan debit cabang: Q_masuk = Q_keluar. Q_Y = 20 L/s - 8 L/s = 12 Liter/detik."
  },
  {
    id: 4,
    question: "Luas penampang pipa 1 adalah 10 cm² dengan kelajuan 6 m/s. Jika luas pipa 2 adalah 30 cm², kelajuan di pipa 2 adalah...",
    options: [
      "2 m/s",
      "18 m/s",
      "3 m/s",
      "4 m/s"
    ],
    correct: 0,
    explanation: "A₁ · v₁ = A₂ · v₂ -> 10 × 6 = 30 × v₂ -> 60 = 30 · v₂ -> v₂ = 2 m/s."
  },
  {
    id: 5,
    question: "Mengapa saat ujung selang air ditekan sebagian dengan ibu jari, pancaran air menjadi lebih jauh?",
    options: [
      "Karena debit air yang keluar menjadi jauh lebih besar",
      "Karena luas penampang mengecil sehingga kelajuan air bertambah pesat",
      "Karena tekanan udara di luar selang mendadak turun",
      "Karena massa jenis air bertambah saat ditekan"
    ],
    correct: 1,
    explanation: "Menutup sebagian lubang memperkecil luas penampang (A), sehingga kecepatan (v) melonjak drastis sesuai persamaan kontinuitas."
  },
  {
    id: 6,
    question: "Besaran fisika yang menyatakan volume fluida yang mengalir tiap satu satuan waktu disebut...",
    options: [
      "Viskositas fluida",
      "Tekanan hidrostatis",
      "Debit fluida",
      "Massa jenis fluida"
    ],
    correct: 2,
    explanation: "Debit (Q) = Volume / waktu (m³/s atau Liter/detik)."
  },
  {
    id: 7,
    question: "Manakah syarat utama fluida ideal agar Asas Kontinuitas berlaku secara sempurna?",
    options: [
      "Inkompresibel (massa jenis konstan) dan alirannya laminer",
      "Sangat kental dan memiliki gesekan dinding tinggi",
      "Mudah termampatkan saat diberi tekanan tinggi",
      "Alirannya selalu turbulen dan berputar-putar"
    ],
    correct: 0,
    explanation: "Syarat fluida ideal: inkompresibel (tak termampatkan), non-viskos (tanpa gesekan internal), dan aliran tunak/laminer."
  },
  {
    id: 8,
    question: "Total luas penampang seluruh pembuluh kapiler darah manusia jauh lebih besar dibanding aorta. Akibatnya aliran darah di kapiler...",
    options: [
      "Bergerak jauh lebih lambat agar pertukaran oksigen optimal",
      "Melesat jauh lebih kencang dibanding aorta",
      "Berhenti mengalir sama sekali",
      "Memiliki debit yang berbeda dari aorta"
    ],
    correct: 0,
    explanation: "Karena total luas kapiler ribuan kali lebih besar dari aorta, kelajuan darah melambat drastis (~0,3 mm/s) memudahkan difusi nutrisi & O₂."
  }
];

class BattleGame {
  constructor() {
    this.questions = [...BATTLE_QUESTIONS];
    this.currentQIndex = 0;
    this.team1Name = "Kelompok Biru (Tim A)";
    this.team2Name = "Kelompok Cyan (Tim B)";
    this.team1Score = 0;
    this.team2Score = 0;

    // Game state: 'idle' | 'reading' | 'answering' | 'stealing' | 'reviewed' | 'finished'
    this.state = 'idle';
    this.buzzedTeam = null; // 1 or 2
    this.timeLeft = 15;
    this.timerInterval = null;
    this.answerTimeLeft = 10;
    this.answerTimerInterval = null;

    this.initDOM();
    this.bindKeyboardShortcuts();
  }

  initDOM() {
    this.updateScoreboard();
    this.renderQuestion();
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Tombol A untuk Tim 1 (Kelompok Biru)
      if (e.key === 'a' || e.key === 'A') {
        if (this.state === 'reading') {
          this.triggerBuzzer(1);
        }
      }
      // Tombol L untuk Tim 2 (Kelompok Cyan)
      else if (e.key === 'l' || e.key === 'L') {
        if (this.state === 'reading') {
          this.triggerBuzzer(2);
        }
      }
    });
  }

  updateScoreboard() {
    const s1 = document.getElementById('battleScoreTeam1');
    const s2 = document.getElementById('battleScoreTeam2');
    const n1 = document.getElementById('battleNameTeam1');
    const n2 = document.getElementById('battleNameTeam2');

    if (s1) s1.textContent = this.team1Score;
    if (s2) s2.textContent = this.team2Score;
    if (n1) n1.textContent = this.team1Name;
    if (n2) n2.textContent = this.team2Name;
  }

  startGame() {
    this.currentQIndex = 0;
    this.team1Score = 0;
    this.team2Score = 0;
    this.updateScoreboard();
    this.loadQuestion(0);

    const victoryModal = document.getElementById('battleVictoryModal');
    if (victoryModal) victoryModal.classList.add('hidden');

    if (window.fluidAudio) window.fluidAudio.playSuccessSound();
  }

  loadQuestion(index) {
    if (index >= this.questions.length) {
      this.finishGame();
      return;
    }

    this.currentQIndex = index;
    this.state = 'reading';
    this.buzzedTeam = null;
    this.timeLeft = 15;

    this.renderQuestion();
    this.startReadingTimer();
  }

  startReadingTimer() {
    clearInterval(this.timerInterval);
    clearInterval(this.answerTimerInterval);

    const timerEl = document.getElementById('battleTimerNum');
    const timerBar = document.getElementById('battleTimerBar');
    if (timerEl) timerEl.textContent = `${this.timeLeft}s`;
    if (timerBar) timerBar.style.width = '100%';

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timerEl) timerEl.textContent = `${this.timeLeft}s`;
      if (timerBar) timerBar.style.width = `${(this.timeLeft / 15) * 100}%`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timeOutNoBuzz();
      }
    }, 1000);
  }

  triggerBuzzer(teamNum) {
    if (this.state !== 'reading') return;

    this.state = 'answering';
    this.buzzedTeam = teamNum;
    clearInterval(this.timerInterval);

    // Play loud Buzzer sound FX
    this.playBuzzerSound();

    // Visual feedback
    this.highlightBuzzerWinner(teamNum);
    this.startAnswerCountdown(teamNum);
  }

  playBuzzerSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = (window.fluidAudio && window.fluidAudio.ctx) || new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  highlightBuzzerWinner(teamNum) {
    const banner = document.getElementById('battleTurnBanner');
    if (!banner) return;

    const teamColor = teamNum === 1 ? 'bg-sky-600 text-white' : 'bg-cyan-600 text-white';
    const teamTitle = teamNum === 1 ? this.team1Name : this.team2Name;

    banner.className = `p-3 rounded-xl font-bold text-center text-lg shadow-lg animate-pulse ${teamColor}`;
    banner.innerHTML = `🔔 BEL TERCEPAT: <strong>${teamTitle}</strong> Mendapat Hak Menjawab! <span id="answerCountdown" class="ml-2 font-mono text-xl">(10s)</span>`;
  }

  startAnswerCountdown(teamNum) {
    this.answerTimeLeft = 10;
    const cdEl = document.getElementById('answerCountdown');

    this.answerTimerInterval = setInterval(() => {
      this.answerTimeLeft--;
      if (cdEl) cdEl.textContent = `(${this.answerTimeLeft}s)`;

      if (this.answerTimeLeft <= 0) {
        clearInterval(this.answerTimerInterval);
        this.handleWrongAnswer(teamNum, true); // timeout penalty
      }
    }, 1000);
  }

  selectBattleAnswer(optIndex) {
    if (this.state !== 'answering' && this.state !== 'stealing') return;

    clearInterval(this.answerTimerInterval);
    const q = this.questions[this.currentQIndex];
    const isCorrect = optIndex === q.correct;
    const currentTeam = this.buzzedTeam;

    if (isCorrect) {
      this.handleCorrectAnswer(currentTeam, optIndex);
    } else {
      this.handleWrongAnswer(currentTeam, false, optIndex);
    }
  }

  handleCorrectAnswer(teamNum, optIndex) {
    this.state = 'reviewed';
    // Base 100 + Speed Bonus (up to 50 pts based on reading time left)
    const speedBonus = Math.max(10, this.timeLeft * 3);
    const totalEarned = 100 + speedBonus;

    if (teamNum === 1) {
      this.team1Score += totalEarned;
    } else {
      this.team2Score += totalEarned;
    }

    this.updateScoreboard();
    if (window.fluidAudio) window.fluidAudio.playSuccessSound();

    this.renderReviewView(true, teamNum, totalEarned, optIndex);
  }

  handleWrongAnswer(teamNum, isTimeout = false, optIndex = -1) {
    // Penalty -25 pts
    if (teamNum === 1) {
      this.team1Score = Math.max(0, this.team1Score - 25);
    } else {
      this.team2Score = Math.max(0, this.team2Score - 25);
    }
    this.updateScoreboard();

    if (window.fluidAudio) window.fluidAudio.playErrorSound();

    // If opponent has chance to steal
    if (this.state === 'answering') {
      this.state = 'stealing';
      const otherTeam = teamNum === 1 ? 2 : 1;
      this.buzzedTeam = otherTeam;

      const banner = document.getElementById('battleTurnBanner');
      const otherTeamTitle = otherTeam === 1 ? this.team1Name : this.team2Name;
      if (banner) {
        banner.className = 'p-3 rounded-xl font-bold text-center text-lg bg-amber-500 text-slate-950 animate-bounce';
        banner.innerHTML = `⚠️ JAWABAN SALAH! Kesempatan Mencuri Poin untuk <strong>${otherTeamTitle}</strong> (+50 Poin jika benar)! <span id="answerCountdown" class="ml-2 font-mono text-xl">(8s)</span>`;
      }
      this.startStealCountdown(otherTeam);
    } else {
      // Steal also failed or timeout
      this.state = 'reviewed';
      this.renderReviewView(false, teamNum, -25, optIndex);
    }
  }

  startStealCountdown(otherTeam) {
    this.answerTimeLeft = 8;
    const cdEl = document.getElementById('answerCountdown');

    this.answerTimerInterval = setInterval(() => {
      this.answerTimeLeft--;
      if (cdEl) cdEl.textContent = `(${this.answerTimeLeft}s)`;

      if (this.answerTimeLeft <= 0) {
        clearInterval(this.answerTimerInterval);
        this.state = 'reviewed';
        this.renderReviewView(false, otherTeam, 0, -1);
      }
    }, 1000);
  }

  timeOutNoBuzz() {
    this.state = 'reviewed';
    if (window.fluidAudio) window.fluidAudio.playErrorSound();
    this.renderReviewView(false, 0, 0, -1, true);
  }

  renderQuestion() {
    const q = this.questions[this.currentQIndex];
    const qBox = document.getElementById('battleQuestionContent');
    const banner = document.getElementById('battleTurnBanner');

    if (banner) {
      banner.className = 'p-3 rounded-xl font-bold text-center text-base sm:text-lg bg-sky-100 text-sky-950 border border-sky-300';
      banner.innerHTML = `⏳ <strong>Pertanyaan Terbuka!</strong> Tekan Bel Cepat: Tombol <kbd class="px-2 py-0.5 rounded bg-sky-600 text-white font-mono font-bold">A</kbd> (${this.team1Name}) atau <kbd class="px-2 py-0.5 rounded bg-cyan-600 text-white font-mono font-bold">L</kbd> (${this.team2Name})`;
    }

    if (!qBox) return;

    const optLabels = ['A', 'B', 'C', 'D'];
    const optionsHtml = q.options.map((opt, i) => `
      <button 
        class="quiz-opt w-full text-left p-4 rounded-xl border-2 flex items-start gap-4 transition-all"
        onclick="window.battleGameInstance.selectBattleAnswer(${i})"
      >
        <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-base bg-sky-200 text-sky-950 border border-sky-400">
          ${optLabels[i]}
        </span>
        <span class="flex-1 text-slate-900 font-semibold text-lg leading-snug">${opt}</span>
      </button>
    `).join('');

    qBox.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between text-sm font-bold text-sky-900 border-b border-sky-200 pb-2">
          <span>Ronde Soal ${this.currentQIndex + 1} dari ${this.questions.length}</span>
          <span class="text-cyan-800">Skor Maksimal: 150 Poin</span>
        </div>

        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
          ${q.question}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
          ${optionsHtml}
        </div>
      </div>
    `;
  }

  renderReviewView(isCorrect, teamNum, pointsChanged, chosenIndex, isTimeOut = false) {
    const q = this.questions[this.currentQIndex];
    const qBox = document.getElementById('battleQuestionContent');
    const banner = document.getElementById('battleTurnBanner');
    const optLabels = ['A', 'B', 'C', 'D'];

    if (banner) {
      if (isTimeOut) {
        banner.className = 'p-3 rounded-xl font-bold text-center text-lg bg-slate-200 text-slate-800 border border-slate-300';
        banner.innerHTML = `⏱️ Waktu Habis! Tidak ada kelompok yang membunyikan bel.`;
      } else if (isCorrect) {
        const teamName = teamNum === 1 ? this.team1Name : this.team2Name;
        banner.className = 'p-3 rounded-xl font-bold text-center text-lg bg-emerald-600 text-white';
        banner.innerHTML = `🎉 TEPAT SEKALI! <strong>${teamName}</strong> Berhasil Meraih <strong>+${pointsChanged} Poin!</strong>`;
      } else {
        banner.className = 'p-3 rounded-xl font-bold text-center text-lg bg-rose-600 text-white';
        banner.innerHTML = `❌ Jawaban Keliru! Poin dipotong (-25 Poin).`;
      }
    }

    if (!qBox) return;

    const optionsHtml = q.options.map((opt, i) => {
      let extraClass = 'border-slate-200 text-slate-700 bg-slate-50';
      if (i === q.correct) {
        extraClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-500';
      } else if (i === chosenIndex) {
        extraClass = 'border-rose-500 bg-rose-100 text-rose-950 font-semibold';
      }

      return `
        <div class="p-4 rounded-xl border-2 flex items-start gap-4 ${extraClass}">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-base bg-white border border-slate-400">
            ${optLabels[i]}
          </span>
          <span class="flex-1 text-base leading-snug">${opt}</span>
        </div>
      `;
    }).join('');

    qBox.innerHTML = `
      <div class="space-y-4">
        <h3 class="text-xl sm:text-2xl font-bold text-slate-900">${q.question}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          ${optionsHtml}
        </div>

        <div class="p-4 rounded-xl bg-sky-50 border-2 border-sky-300 space-y-2 text-base text-slate-800">
          <div class="font-bold text-sky-950 flex items-center gap-2">
            <span>💡 Pembahasan Fisika:</span>
            <span class="text-sm font-semibold text-emerald-700">(Kunci Jawaban: ${optLabels[q.correct]})</span>
          </div>
          <p class="leading-relaxed">${q.explanation}</p>
        </div>

        <div class="text-center pt-2">
          <button 
            onclick="window.battleGameInstance.nextQuestion()" 
            class="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white font-extrabold text-lg shadow-lg shadow-sky-600/30 transition-all hover:scale-105"
          >
            Lanjut ke Soal Berikutnya ➔
          </button>
        </div>
      </div>
    `;
  }

  nextQuestion() {
    this.loadQuestion(this.currentQIndex + 1);
  }

  finishGame() {
    this.state = 'finished';
    const modal = document.getElementById('battleVictoryModal');
    if (!modal) return;

    let winnerTitle = "HASIL IMBANG!";
    let winnerSub = "Kedua kelompok memiliki kecerdasan dan ketangkasan yang setara!";
    let winnerColor = "text-sky-600";

    if (this.team1Score > this.team2Score) {
      winnerTitle = `🏆 JUARA 1: ${this.team1Name.toUpperCase()}`;
      winnerSub = `Selamat! Tim Biru memenangkan pertandingan cepat-tepat dengan skor luar biasa!`;
      winnerColor = "text-sky-600";
    } else if (this.team2Score > this.team1Score) {
      winnerTitle = `🏆 JUARA 1: ${this.team2Name.toUpperCase()}`;
      winnerSub = `Selamat! Tim Cyan memenangkan pertandingan cepat-tepat dengan skor luar biasa!`;
      winnerColor = "text-cyan-600";
    }

    modal.querySelector('#victoryWinnerTitle').textContent = winnerTitle;
    modal.querySelector('#victoryWinnerTitle').className = `text-3xl sm:text-4xl font-extrabold ${winnerColor}`;
    modal.querySelector('#victoryWinnerSub').textContent = winnerSub;
    modal.querySelector('#victoryTeam1Score').textContent = `${this.team1Score} Poin`;
    modal.querySelector('#victoryTeam2Score').textContent = `${this.team2Score} Poin`;

    modal.classList.remove('hidden');

    if (window.fluidAudio) window.fluidAudio.playSuccessSound();
  }

  editTeamNames() {
    const t1 = prompt("Masukkan Nama Kelompok 1 (Tim Biru):", this.team1Name);
    if (t1 && t1.trim()) this.team1Name = t1.trim();

    const t2 = prompt("Masukkan Nama Kelompok 2 (Tim Cyan):", this.team2Name);
    if (t2 && t2.trim()) this.team2Name = t2.trim();

    this.updateScoreboard();
    if (this.state === 'reading') this.renderQuestion();
  }
}

window.BattleGame = BattleGame;
