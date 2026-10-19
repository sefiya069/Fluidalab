/**
 * FLUIDLAB - Interactive Quiz System (Menu 4)
 * Ukuran teks besar & kontras tinggi untuk InFocus proyektor.
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Konsep Dasar",
    question: "Asas Kontinuitas dalam dinamika fluida ideal pada dasarnya merupakan pernyataan dari hukum dasar fisika...",
    options: [
      "Hukum Kekekalan Energi Mekanik",
      "Hukum Kekekalan Massa",
      "Hukum Kekekalan Momentum Linier",
      "Hukum II Newton tentang Gerak",
      "Hukum Gravitasi Universal"
    ],
    correct: 1,
    explanation: "Asas Kontinuitas diturunkan dari Hukum Kekekalan Massa. Pada fluida inkompresibel (tak termampatkan), massa fluida yang masuk ke dalam suatu penampang pipa per satuan waktu harus sama dengan massa fluida yang keluar, sehingga debit fluida bernilai konstan (Q₁ = Q₂)."
  },
  {
    id: 2,
    category: "Satuan & Dimensi",
    question: "Besaran debit fluida (Q) menyatakan volume fluida yang mengalir tiap satuan waktu. Satuan SI dan dimensi dari debit berturut-turut adalah...",
    options: [
      "m²/s dan [L]² [T]⁻¹",
      "m³/s dan [L]³ [T]⁻¹",
      "m³/s² dan [L]³ [T]⁻²",
      "kg/m³ dan [M] [L]⁻³",
      "Liter/jam dan [L]³ [T]"
    ],
    correct: 1,
    explanation: "Debit dirumuskan sebagai Q = V/t (Volume dibagi waktu). Satuan SI volume adalah m³ dan waktu adalah detik (s), sehingga satuannya m³/s. Dimensi volume adalah [L]³ dan waktu [T], maka dimensi debit adalah [L]³ [T]⁻¹."
  },
  {
    id: 3,
    category: "Perbandingan Diameter",
    question: "Air mengalir dalam pipa mendatar yang diameternya menyempit dari d₁ menjadi d₂ dengan perbandingan d₁ : d₂ = 2 : 1. Jika kelajuan air pada diameter d₁ adalah 3 m/s, maka kelajuan air pada diameter d₂ adalah...",
    options: [
      "1,5 m/s",
      "6,0 m/s",
      "9,0 m/s",
      "12,0 m/s",
      "24,0 m/s"
    ],
    correct: 3,
    explanation: "Menurut Asas Kontinuitas: A₁ · v₁ = A₂ · v₂. Karena A = (π/4)·d², maka v₂ = (d₁ / d₂)² · v₁. Dengan rasio d₁/d₂ = 2/1, diperoleh v₂ = (2/1)² × 3 = 4 × 3 = 12 m/s."
  },
  {
    id: 4,
    category: "Perhitungan Numerik",
    question: "Air mengalir melalui pipa berpenampang 20 cm² dengan kelajuan 4 m/s. Pipa tersebut kemudian menyempit hingga luas penampangnya menjadi 8 cm². Kelajuan air pada penampang sempit tersebut adalah...",
    options: [
      "1,6 m/s",
      "8,0 m/s",
      "10,0 m/s",
      "16,0 m/s",
      "20,0 m/s"
    ],
    correct: 2,
    explanation: "Gunakan persamaan kontinuitas A₁ · v₁ = A₂ · v₂.\n20 cm² × 4 m/s = 8 cm² × v₂\n80 = 8 · v₂\nv₂ = 80 / 8 = 10 m/s."
  },
  {
    id: 5,
    category: "Pipa Bercabang",
    question: "Pipa utama saluran irigasi mengalirkan air dengan debit 25 Liter/detik. Pipa tersebut kemudian bercabang menjadi pipa A dan pipa B. Jika debit air pada pipa A terukur sebesar 11 Liter/detik, berapakah debit air pada pipa B?",
    options: [
      "11 Liter/detik",
      "14 Liter/detik",
      "25 Liter/detik",
      "36 Liter/detik",
      "5,5 Liter/detik"
    ],
    correct: 1,
    explanation: "Pada pipa bercabang berlaku prinsip kekekalan debit: Q_masuk = Q_keluar1 + Q_keluar2.\nQ_utama = Q_A + Q_B\n25 L/s = 11 L/s + Q_B\nQ_B = 25 - 11 = 14 Liter/detik."
  },
  {
    id: 6,
    category: "Volume & Waktu",
    question: "Sebuah selang air memiliki luas penampang 5 cm². Air keluar dari ujung selang dengan kelajuan 2 m/s. Berapakah volume air yang berhasil ditampung dalam ember selama 30 detik?",
    options: [
      "0,01 m³ (10 Liter)",
      "0,03 m³ (30 Liter)",
      "0,05 m³ (50 Liter)",
      "0,30 m³ (300 Liter)",
      "3,00 m³ (3.000 Liter)"
    ],
    correct: 1,
    explanation: "Hitung debit Q = A · v.\nA = 5 cm² = 5 × 10⁻⁴ m²\nv = 2 m/s\nQ = (5 × 10⁻⁴) × 2 = 10⁻³ m³/s.\nVolume yang ditampung dalam t = 30 detik:\nV = Q · t = 10⁻³ m³/s × 30 s = 0,03 m³ = 30 Liter."
  },
  {
    id: 7,
    category: "Penerapan Nyata",
    question: "Saat menyiram tanaman, seseorang sering kali menekan atau menutup sebagian lubang selang air menggunakan ibu jarinya. Fenomena yang terjadi dan alasan fisikanya adalah...",
    options: [
      "Air memancar lebih lambat karena debit aliran bertambah",
      "Air memancar lebih jauh dan cepat karena luas penampang keluar mengecil sehingga kelajuan bertambah",
      "Debit air meningkat drastis sehingga air memancar lebih jauh",
      "Tekanan di ujung selang meningkat menyebabkan air berhenti mengalir",
      "Massa jenis air berkurang sehingga air menjadi lebih ringan meluncur"
    ],
    correct: 1,
    explanation: "Menutup sebagian lubang selang memperkecil luas penampang keluar (A₂ < A₁). Menurut kontinuitas (Q = A·v = konstan), ketika luas A mengecil, kecepatan keluar v₂ harus membesar secara signifikan, menyebabkan semprotan meluncur lebih cepat dan menjangkau jarak yang lebih jauh."
  },
  {
    id: 8,
    category: "Pipa Bercabang Identik",
    question: "Sebuah pipa induk dengan luas penampang 60 cm² dialiri air berkecepatan 3 m/s. Pipa tersebut kemudian dihubungkan dengan 3 pipa cabang kecil yang identik dengan luas masing-masing 10 cm². Kecepatan aliran air pada masing-masing pipa cabang adalah...",
    options: [
      "3 m/s",
      "6 m/s",
      "9 m/s",
      "12 m/s",
      "18 m/s"
    ],
    correct: 1,
    explanation: "Persamaan kontinuitas untuk n cabang identik: A₁ · v₁ = n · (A₂ · v₂).\n60 cm² × 3 m/s = 3 × (10 cm² × v₂)\n180 = 30 · v₂\nv₂ = 180 / 30 = 6 m/s."
  },
  {
    id: 9,
    category: "Hubungan Tekanan (Venturi)",
    question: "Berdasarkan gabungan Asas Kontinuitas dan Asas Bernoulli pada pipa horizontal yang menyempit, di bagian pipa yang berpenampang lebih sempit fluida akan memiliki...",
    options: [
      "Kelajuan lebih tinggi dan tekanan statis lebih rendah",
      "Kelajuan lebih tinggi dan tekanan statis lebih tinggi",
      "Kelajuan lebih rendah dan tekanan statis lebih tinggi",
      "Kelajuan dan tekanan yang sama persis",
      "Debit lebih besar dan tekanan nol"
    ],
    correct: 0,
    explanation: "Menurut kontinuitas, penampang sempit menyebabkan kelajuan v meningkat (energi kinetik bertambah). Berdasarkan Asas Bernoulli (P + ½ρv² = konstan pada pipa mendatar), peningkatan kelajuan harus diimbangi oleh penurunan tekanan statis (P). Efek ini dikenal sebagai Efek Venturi."
  },
  {
    id: 10,
    category: "Aplikasi Biomedis",
    question: "Darah dipompa dari aorta manusia yang berpenampang rata-rata 3 cm² dengan kelajuan 30 cm/s menuju miliaran pembuluh kapiler darah. Jika total luas penampang seluruh pembuluh kapiler adalah 3.000 cm², kelajuan aliran darah pada kapiler adalah...",
    options: [
      "0,03 cm/s",
      "0,30 cm/s",
      "3,00 cm/s",
      "30,0 cm/s",
      "300 cm/s"
    ],
    correct: 0,
    explanation: "A_aorta · v_aorta = A_total_kapiler · v_kapiler\n3 cm² × 30 cm/s = 3.000 cm² × v_kapiler\n90 = 3.000 · v_kapiler\nv_kapiler = 90 / 3.000 = 0,03 cm/s (atau 0,3 mm/s).\nKecepatan yang sangat lambat ini sangat krusial bagi tubuh agar pertukaran oksigen dan nutrisi dengan sel-sel tubuh berlangsung sempurna."
  },
  {
    id: 11,
    category: "Syarat Fluida Ideal",
    question: "Persamaan kontinuitas A₁ v₁ = A₂ v₂ berlaku secara tepat dan presisi pada fluida ideal yang memenuhi syarat utama berupa...",
    options: [
      "Kompresibel dan viskositasnya tinggi",
      "Inkompresibel (massa jenis konstan) dan alirannya stasioner (tunak)",
      "Mengalami turbulensi dan gesekan dinding yang besar",
      "Suhu fluida selalu berubah drastis sepanjang pipa",
      "Memiliki gaya tarik antarmolekul yang sangat besar"
    ],
    correct: 1,
    explanation: "Syarat fluida ideal pada kontinuitas:\n1. Inkompresibel (tak termampatkan, massa jenis konstan).\n2. Aliran stasioner/laminer.\n3. Non-viskos (mengabaikan gesekan internal)."
  },
  {
    id: 12,
    category: "Analisis Rasio Jari-jari",
    question: "Jika jari-jari penampang pipa kedua adalah sepertiga dari jari-jari pipa pertama (r₂ = ⅓ r₁), maka perbandingan kecepatan aliran fluida v₁ : v₂ adalah...",
    options: [
      "1 : 3",
      "3 : 1",
      "1 : 9",
      "9 : 1",
      "1 : 27"
    ],
    correct: 2,
    explanation: "Luas lingkaran berbanding lurus dengan kuadrat jari-jari: A ∝ r².\nA₁ / A₂ = (r₁ / r₂)² = (3)² = 9 / 1.\nMenurut Asas Kontinuitas:\nv₁ / v₂ = A₂ / A₁ = 1 / 9."
  }
];

class QuizManager {
  constructor() {
    this.questions = QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isSubmitted = false;
    this.mode = 'learn';

    this.initDOM();
  }

  initDOM() {
    this.renderQuestionNav();
    this.renderCurrentQuestion();
    this.bindEvents();
  }

  bindEvents() {
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const submitBtn = document.getElementById('quizSubmitBtn');
    const resetBtn = document.getElementById('quizResetBtn');
    const modeSelect = document.getElementById('quizModeSelect');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderCurrentQuestion();
          this.renderQuestionNav();
          if (window.fluidAudio) window.fluidAudio.playClickSound();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < this.questions.length - 1) {
          this.currentIndex++;
          this.renderCurrentQuestion();
          this.renderQuestionNav();
          if (window.fluidAudio) window.fluidAudio.playClickSound();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitQuiz());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetQuiz());
    }

    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this.mode = e.target.value;
        this.renderCurrentQuestion();
      });
    }
  }

  renderQuestionNav() {
    const nav = document.getElementById('quizQuestionNav');
    if (!nav) return;

    nav.innerHTML = this.questions.map((q, idx) => {
      let bg = 'bg-white border-slate-300 text-slate-800 font-bold';
      const isAnswered = this.userAnswers[idx] !== null;

      if (this.currentIndex === idx) {
        bg = 'bg-sky-600 border-sky-700 text-white font-extrabold ring-4 ring-sky-200';
      } else if (isAnswered) {
        if (this.isSubmitted || this.mode === 'learn') {
          const isCorrect = this.userAnswers[idx] === q.correct;
          bg = isCorrect ? 'bg-emerald-600 border-emerald-700 text-white font-bold' : 'bg-rose-600 border-rose-700 text-white font-bold';
        } else {
          bg = 'bg-sky-100 border-sky-500 text-sky-900 font-bold';
        }
      }

      return `
        <button 
          onclick="window.quizInstance.goToQuestion(${idx})"
          class="w-10 h-10 rounded-xl border-2 text-sm font-mono transition-all flex items-center justify-center hover:scale-105 shadow-sm ${bg}"
          title="Soal nomor ${idx + 1}"
        >
          ${idx + 1}
        </button>
      `;
    }).join('');
  }

  goToQuestion(index) {
    this.currentIndex = index;
    this.renderCurrentQuestion();
    this.renderQuestionNav();
    if (window.fluidAudio) window.fluidAudio.playClickSound();
  }

  renderCurrentQuestion() {
    const q = this.questions[this.currentIndex];
    const card = document.getElementById('quizQuestionCard');
    if (!card) return;

    const selectedOption = this.userAnswers[this.currentIndex];
    const isAnswered = selectedOption !== null;
    const showFeedback = (this.mode === 'learn' && isAnswered) || this.isSubmitted;
    const optLabels = ['A', 'B', 'C', 'D', 'E'];

    const optionsHtml = q.options.map((opt, i) => {
      let extraClass = '';
      if (showFeedback) {
        if (i === q.correct) extraClass = 'correct';
        else if (i === selectedOption) extraClass = 'incorrect';
      } else if (i === selectedOption) {
        extraClass = 'selected';
      }

      return `
        <button 
          class="quiz-opt w-full text-left p-4 rounded-xl border-2 flex items-start gap-4 transition-all shadow-sm ${extraClass}"
          onclick="window.quizInstance.selectAnswer(${i})"
          ${this.isSubmitted ? 'disabled' : ''}
        >
          <span class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm font-mono ${i === selectedOption ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'}">
            ${optLabels[i]}
          </span>
          <span class="flex-1 font-semibold text-base sm:text-lg leading-relaxed text-slate-900">${opt}</span>
        </button>
      `;
    }).join('');

    card.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-sm font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
              Soal ${this.currentIndex + 1} dari ${this.questions.length}
            </span>
            <span class="px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-800 border border-slate-300">
              ${q.category}
            </span>
          </div>
          <span class="text-sm font-bold text-slate-700 font-mono">Bobot: 8.33 Poin</span>
        </div>

        <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          ${q.question}
        </h3>

        <div class="space-y-3 pt-2">
          ${optionsHtml}
        </div>

        ${showFeedback ? `
          <div class="mt-4 p-5 rounded-2xl border-2 ${selectedOption === q.correct ? 'bg-emerald-50 border-emerald-400' : 'bg-rose-50 border-rose-400'}">
            <div class="flex items-center gap-2 font-extrabold text-base sm:text-lg ${selectedOption === q.correct ? 'text-emerald-800' : 'text-rose-800'} mb-2">
              <span>${selectedOption === q.correct ? '✓ Jawaban Anda Benar!' : '✗ Jawaban Belum Tepat'}</span>
              <span class="text-sm font-normal text-slate-700">(Jawaban benar: <strong>${optLabels[q.correct]}</strong>)</span>
            </div>
            <div class="text-sm sm:text-base text-slate-800 whitespace-pre-line leading-relaxed font-medium">
              <strong>Pembahasan Lengkap:</strong><br>${q.explanation}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.questions.length - 1;
  }

  selectAnswer(optIndex) {
    if (this.isSubmitted) return;

    this.userAnswers[this.currentIndex] = optIndex;
    const isCorrect = optIndex === this.questions[this.currentIndex].correct;

    if (window.fluidAudio) {
      if (this.mode === 'learn') {
        if (isCorrect) window.fluidAudio.playSuccessSound();
        else window.fluidAudio.playErrorSound();
      } else {
        window.fluidAudio.playClickSound();
      }
    }

    this.renderCurrentQuestion();
    this.renderQuestionNav();
  }

  submitQuiz() {
    this.isSubmitted = true;
    let correctCount = 0;
    this.questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correct) correctCount++;
    });

    const score = Math.round((correctCount / this.questions.length) * 100);
    this.renderResultsModal(score, correctCount);
    this.renderCurrentQuestion();
    this.renderQuestionNav();

    if (window.fluidAudio) {
      if (score >= 70) window.fluidAudio.playSuccessSound();
      else window.fluidAudio.playErrorSound();
    }
  }

  renderResultsModal(score, correctCount) {
    const modal = document.getElementById('quizResultModal');
    if (!modal) return;

    let title = "Tetap Semangat!";
    let desc = "Pelajari kembali materi Asas Kontinuitas dan coba simulasi interaktif untuk memperkuat pemahaman.";
    let badgeColor = "text-amber-600";

    if (score === 100) {
      title = "🌟 Sempurna! Sang Master Fluida";
      desc = "Luar biasa! Kamu menguasai konsep kontinuitas, rasio diameter, debit cabang, hingga penerapan kehidupan nyata dengan sempurna.";
      badgeColor = "text-sky-700";
    } else if (score >= 80) {
      title = "⚡ Ahli Fisika Cendekia";
      desc = "Hebat sekali! Pemahaman konsep dan keterampilan kalkulasi kontinuitasmu sangat mantap.";
      badgeColor = "text-emerald-700";
    } else if (score >= 60) {
      title = "💡 Fisikawan Terampil";
      desc = "Bagus! Kamu sudah memahami konsep dasar kontinuitas dengan baik. Tingkatkan lagi pemahaman rasio kuadrat.";
      badgeColor = "text-sky-600";
    }

    modal.querySelector('#modalScoreNum').textContent = `${score}`;
    modal.querySelector('#modalScoreFraction').textContent = `${correctCount} dari ${this.questions.length} Benar`;
    modal.querySelector('#modalScoreTitle').textContent = title;
    modal.querySelector('#modalScoreTitle').className = `text-2xl font-extrabold ${badgeColor}`;
    modal.querySelector('#modalScoreDesc').textContent = desc;

    modal.classList.remove('hidden');
  }

  resetQuiz() {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isSubmitted = false;

    const modal = document.getElementById('quizResultModal');
    if (modal) modal.classList.add('hidden');

    this.renderCurrentQuestion();
    this.renderQuestionNav();
    if (window.fluidAudio) window.fluidAudio.playSwitchSound();
  }
}

window.QuizManager = QuizManager;
