/**
 * FLUIDLAB - Interactive Learning Material Helper (Menu 1)
 * Kalkulator Rumus Kontinuitas Cepat & Konverter Satuan Interaktif
 * Disesuaikan untuk tampilan tajam InFocus.
 */

function calculateQuickFormula() {
  const d1Input = parseFloat(document.getElementById('calc-d1').value);
  const v1Input = parseFloat(document.getElementById('calc-v1').value);
  const d2Input = parseFloat(document.getElementById('calc-d2').value);

  if (isNaN(d1Input) || isNaN(v1Input) || isNaN(d2Input) || d1Input <= 0 || d2Input <= 0 || v1Input <= 0) {
    document.getElementById('calc-result').innerHTML = `
      <div class="text-rose-600 font-bold text-base">Harap masukkan nilai numerik positif untuk semua input.</div>
    `;
    return;
  }

  const d1_m = d1Input / 100;
  const d2_m = d2Input / 100;

  const A1 = (Math.PI * Math.pow(d1_m, 2)) / 4;
  const A2 = (Math.PI * Math.pow(d2_m, 2)) / 4;
  const Q = A1 * v1Input;
  const v2 = (A1 * v1Input) / A2;

  document.getElementById('calc-result').innerHTML = `
    <div class="p-5 rounded-2xl bg-sky-50 border-2 border-sky-300 space-y-3 font-mono text-base text-slate-800 shadow-sm">
      <div class="text-sky-900 font-extrabold text-lg border-b border-sky-200 pb-2">Hasil Perhitungan Langkah Demi Langkah:</div>
      <div class="space-y-1.5 leading-relaxed font-semibold">
        <div>1. Luas Penampang 1: A₁ = ¼·π·d₁² = ¼ · 3,1416 · (${d1_m.toFixed(2)} m)² = <strong class="text-sky-800">${A1.toFixed(5)} m²</strong> (${(A1 * 10000).toFixed(2)} cm²)</div>
        <div>2. Luas Penampang 2: A₂ = ¼·π·d₂² = ¼ · 3,1416 · (${d2_m.toFixed(2)} m)² = <strong class="text-sky-800">${A2.toFixed(5)} m²</strong> (${(A2 * 10000).toFixed(2)} cm²)</div>
        <div>3. Debit Fluida Kekal: Q = A₁ · v₁ = ${A1.toFixed(5)} · ${v1Input} = <strong class="text-emerald-700 font-extrabold">${Q.toFixed(5)} m³/s</strong> (${(Q * 1000).toFixed(2)} Liter/detik)</div>
        <div>4. Kecepatan Akhir: v₂ = (A₁ / A₂) · v₁ = (d₁ / d₂)² · v₁ = (${d1Input} / ${d2Input})² · ${v1Input} = <strong class="text-cyan-800 font-extrabold text-xl underline">${v2.toFixed(2)} m/s</strong></div>
      </div>
    </div>
  `;
}

function convertUnits() {
  const val = parseFloat(document.getElementById('unit-val').value);
  const type = document.getElementById('unit-type').value;
  const outEl = document.getElementById('unit-result');

  if (isNaN(val)) {
    outEl.textContent = '0';
    return;
  }

  let res = '';
  switch (type) {
    case 'm3s_to_ls':
      res = `${(val * 1000).toFixed(2)} L/s`;
      break;
    case 'ls_to_m3s':
      res = `${(val / 1000).toFixed(5)} m³/s`;
      break;
    case 'cm2_to_m2':
      res = `${(val * 1e-4).toFixed(6)} m²`;
      break;
    case 'm2_to_cm2':
      res = `${(val * 1e4).toFixed(1)} cm²`;
      break;
  }

  outEl.textContent = res;
}

window.calculateQuickFormula = calculateQuickFormula;
window.convertUnits = convertUnits;
