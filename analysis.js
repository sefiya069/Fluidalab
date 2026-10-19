/**
 * FLUIDLAB - Module Hasil Simulasi & Analisis Fisika (Menu 3)
 * Disesuaikan untuk tampilan InFocus: font besar, tabel jelas, kontras tinggi.
 */

class SimulationAnalysis {
  constructor(simInstance) {
    this.sim = simInstance;
    this.chart = null;
    this.initChart();
  }

  initChart() {
    const ctx = document.getElementById('analysisChart');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Titik Penampang 1', 'Titik Penampang 2'],
        datasets: [
          {
            label: 'Luas Penampang A (cm²)',
            data: [0, 0],
            backgroundColor: '#0284c7',
            borderColor: '#0369a1',
            borderWidth: 2,
            borderRadius: 8,
            yAxisID: 'y'
          },
          {
            label: 'Kecepatan Fluida v (m/s)',
            data: [0, 0],
            backgroundColor: '#06b6d4',
            borderColor: '#0891b2',
            borderWidth: 2,
            borderRadius: 8,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#0f172a',
              font: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#38bdf8',
            bodyColor: '#ffffff',
            titleFont: { size: 14 },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          x: {
            ticks: { color: '#0f172a', font: { size: 13, weight: 'bold' } },
            grid: { color: 'rgba(0, 0, 0, 0.06)' }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Luas A (cm²)', color: '#0284c7', font: { size: 13, weight: 'bold' } },
            ticks: { color: '#0f172a', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(0, 0, 0, 0.06)' }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Kecepatan v (m/s)', color: '#0891b2', font: { size: 13, weight: 'bold' } },
            ticks: { color: '#0f172a', font: { size: 12, weight: '600' } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  update() {
    const phys = this.sim.calculatePhysics();

    const badgeD1 = document.getElementById('res-d1');
    const badgeD2 = document.getElementById('res-d2');
    const badgeA1 = document.getElementById('res-a1');
    const badgeA2 = document.getElementById('res-a2');
    const badgeV1 = document.getElementById('res-v1');
    const badgeV2 = document.getElementById('res-v2');
    const badgeQ1 = document.getElementById('res-q1');
    const badgeQ2 = document.getElementById('res-q2');

    if (badgeD1) badgeD1.textContent = `${(phys.d1 * 100).toFixed(0)} cm (${phys.d1.toFixed(2)} m)`;
    if (badgeD2) badgeD2.textContent = `${(phys.d2 * 100).toFixed(0)} cm (${phys.d2.toFixed(2)} m)`;
    if (badgeA1) badgeA1.textContent = `${(phys.A1 * 10000).toFixed(2)} cm²`;
    if (badgeA2) badgeA2.textContent = `${(phys.A2 * 10000).toFixed(2)} cm²`;
    if (badgeV1) badgeV1.textContent = `${phys.v1.toFixed(2)} m/s`;
    if (badgeV2) badgeV2.textContent = `${phys.v2.toFixed(2)} m/s`;

    const q1Lps = phys.Q1 * 1000;
    const q2Lps = (phys.mode === 'single' ? phys.Q2 : (phys.Q2 + phys.Q3)) * 1000;
    if (badgeQ1) badgeQ1.textContent = `${(phys.Q1 * 1000).toFixed(2)} L/s`;
    if (badgeQ2) badgeQ2.textContent = `${q2Lps.toFixed(2)} L/s (Kekal)`;

    // Update Table
    const tableBody = document.getElementById('comparisonTableBody');
    if (tableBody) {
      if (phys.mode === 'single') {
        tableBody.innerHTML = `
          <tr class="border-b border-slate-200 hover:bg-sky-50 transition-colors">
            <td class="p-4 font-bold text-sky-800 text-base">Pipa Masuk (Penampang 1)</td>
            <td class="p-4 font-semibold text-slate-900 text-base">${(phys.d1 * 100).toFixed(0)} cm</td>
            <td class="p-4 font-mono font-bold text-slate-900 text-base">${(phys.A1 * 10000).toFixed(2)} cm²</td>
            <td class="p-4 font-mono font-extrabold text-sky-700 text-lg">${phys.v1.toFixed(2)} m/s</td>
            <td class="p-4 font-mono font-bold text-emerald-700 text-base">${q1Lps.toFixed(2)} L/s</td>
          </tr>
          <tr class="hover:bg-sky-50 transition-colors">
            <td class="p-4 font-bold text-cyan-800 text-base">Pipa Keluar (Penampang 2)</td>
            <td class="p-4 font-semibold text-slate-900 text-base">${(phys.d2 * 100).toFixed(0)} cm</td>
            <td class="p-4 font-mono font-bold text-slate-900 text-base">${(phys.A2 * 10000).toFixed(2)} cm²</td>
            <td class="p-4 font-mono font-extrabold text-cyan-700 text-lg">${phys.v2.toFixed(2)} m/s</td>
            <td class="p-4 font-mono font-bold text-emerald-700 text-base">${q2Lps.toFixed(2)} L/s</td>
          </tr>
        `;
      } else {
        const q3Lps = phys.Q3 * 1000;
        tableBody.innerHTML = `
          <tr class="border-b border-slate-200 hover:bg-sky-50 transition-colors">
            <td class="p-4 font-bold text-sky-800 text-base">Pipa Utama Masuk (1)</td>
            <td class="p-4 font-semibold text-slate-900 text-base">${(phys.d1 * 100).toFixed(0)} cm</td>
            <td class="p-4 font-mono font-bold text-slate-900 text-base">${(phys.A1 * 10000).toFixed(2)} cm²</td>
            <td class="p-4 font-mono font-extrabold text-sky-700 text-lg">${phys.v1.toFixed(2)} m/s</td>
            <td class="p-4 font-mono font-bold text-emerald-700 text-base">${q1Lps.toFixed(2)} L/s</td>
          </tr>
          <tr class="border-b border-slate-200 hover:bg-sky-50 transition-colors">
            <td class="p-4 font-bold text-cyan-800 text-base">Cabang Keluar A (2)</td>
            <td class="p-4 font-semibold text-slate-900 text-base">${(phys.d2 * 100).toFixed(0)} cm</td>
            <td class="p-4 font-mono font-bold text-slate-900 text-base">${(phys.A2 * 10000).toFixed(2)} cm²</td>
            <td class="p-4 font-mono font-extrabold text-cyan-700 text-lg">${phys.v2.toFixed(2)} m/s</td>
            <td class="p-4 font-mono font-bold text-emerald-700 text-base">${(phys.Q2 * 1000).toFixed(2)} L/s</td>
          </tr>
          <tr class="hover:bg-sky-50 transition-colors">
            <td class="p-4 font-bold text-purple-800 text-base">Cabang Keluar B (3)</td>
            <td class="p-4 font-semibold text-slate-900 text-base">${(phys.d3 * 100).toFixed(0)} cm</td>
            <td class="p-4 font-mono font-bold text-slate-900 text-base">${(phys.A3 * 10000).toFixed(2)} cm²</td>
            <td class="p-4 font-mono font-extrabold text-purple-700 text-lg">${phys.v3.toFixed(2)} m/s</td>
            <td class="p-4 font-mono font-bold text-emerald-700 text-base">${q3Lps.toFixed(2)} L/s</td>
          </tr>
        `;
      }
    }

    if (this.chart) {
      if (phys.mode === 'single') {
        this.chart.data.labels = ['Penampang 1 (A₁)', 'Penampang 2 (A₂)'];
        this.chart.data.datasets[0].data = [
          parseFloat((phys.A1 * 10000).toFixed(2)),
          parseFloat((phys.A2 * 10000).toFixed(2))
        ];
        this.chart.data.datasets[1].data = [
          parseFloat(phys.v1.toFixed(2)),
          parseFloat(phys.v2.toFixed(2))
        ];
      } else {
        this.chart.data.labels = ['Pipa Utama (1)', 'Cabang A (2)', 'Cabang B (3)'];
        this.chart.data.datasets[0].data = [
          parseFloat((phys.A1 * 10000).toFixed(2)),
          parseFloat((phys.A2 * 10000).toFixed(2)),
          parseFloat((phys.A3 * 10000).toFixed(2))
        ];
        this.chart.data.datasets[1].data = [
          parseFloat(phys.v1.toFixed(2)),
          parseFloat(phys.v2.toFixed(2)),
          parseFloat(phys.v3.toFixed(2))
        ];
      }
      this.chart.update();
    }

    this.generateConclusion(phys);
  }

  generateConclusion(phys) {
    const el = document.getElementById('autoConclusionText');
    if (!el) return;

    if (phys.mode === 'single') {
      const areaRatio = (phys.A1 / phys.A2);
      const diamRatio = (phys.d1 / phys.d2);
      const speedRatio = (phys.v2 / phys.v1);

      let comparisonWord = 'menyempit';
      if (phys.d2 > phys.d1) comparisonWord = 'melebar';
      else if (Math.abs(phys.d1 - phys.d2) < 0.001) comparisonWord = 'sama / konstan';

      el.innerHTML = `
        <div class="space-y-4 text-slate-800 text-base sm:text-lg leading-relaxed">
          <p>
            Berdasarkan simulasi aktif, pipa <strong class="text-sky-700 font-bold">${comparisonWord}</strong> dari diameter 
            <strong class="text-slate-900">${(phys.d1 * 100).toFixed(0)} cm</strong> menjadi 
            <strong class="text-slate-900">${(phys.d2 * 100).toFixed(0)} cm</strong> (rasio diameter: <span class="font-mono font-bold text-sky-800">${diamRatio.toFixed(2)} : 1</span>).
          </p>
          <div class="p-4 bg-sky-50 rounded-xl border-2 border-sky-200 space-y-2.5">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-sky-600 flex-shrink-0"></span>
              <span>Rasio Luas: <strong>A₁ / A₂ = ${areaRatio.toFixed(2)}x</strong> (kuadrat diameter: <em>(d₁/d₂)² = ${Math.pow(diamRatio, 2).toFixed(2)}</em>)</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-cyan-600 flex-shrink-0"></span>
              <span>Rasio Kecepatan: <strong>v₂ / v₁ = ${speedRatio.toFixed(2)}x</strong> (${phys.v1.toFixed(2)} m/s ➔ ${phys.v2.toFixed(2)} m/s)</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0"></span>
              <span>Kekekalan Debit: <strong>Q₁ = Q₂ = ${(phys.Q1 * 1000).toFixed(2)} Liter/detik</strong> (Kekal / Tidak Ada Massa Hilang)</span>
            </div>
          </div>
          <p class="font-semibold text-slate-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <strong>Kesimpulan Fisika:</strong> Terbukti berlaku <em>Asas Kontinuitas</em> (\(A_1 v_1 = A_2 v_2\)). 
            Kelajuan fluida berbanding <strong>terbalik</strong> dengan luas penampangnya. Semakin sempit pipa, fluida mengalir semakin deras!
          </p>
        </div>
      `;
    } else {
      const totalQOut = (phys.Q2 + phys.Q3) * 1000;
      el.innerHTML = `
        <div class="space-y-4 text-slate-800 text-base sm:text-lg leading-relaxed">
          <p>
            Aliran pipa utama dengan debit 
            <strong class="text-sky-700 font-mono text-xl">${(phys.Q1 * 1000).toFixed(2)} L/s</strong> terbagi menjadi dua cabang:
            Cabang A (<strong class="text-cyan-700 font-mono">${(phys.Q2 * 1000).toFixed(2)} L/s</strong>) dan 
            Cabang B (<strong class="text-purple-700 font-mono">${(phys.Q3 * 1000).toFixed(2)} L/s</strong>).
          </p>
          <div class="p-4 bg-sky-50 rounded-xl border-2 border-sky-200 text-base font-semibold space-y-1">
            <div>Jumlah Total Debit Keluar: <strong>Q₂ + Q₃ = ${(phys.Q2 * 1000).toFixed(2)} + ${(phys.Q3 * 1000).toFixed(2)} = ${totalQOut.toFixed(2)} L/s</strong></div>
            <div class="text-emerald-700 font-bold text-lg">✓ Q_masuk = Q_keluar (Hukum Kekekalan Massa Terbukti Sempurna)</div>
          </div>
        </div>
      `;
    }
  }

  printReport() {
    window.print();
  }
}

window.SimulationAnalysis = SimulationAnalysis;
