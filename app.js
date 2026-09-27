/* ===================== ABT Requisiciones - lógica principal ===================== */

const STORAGE = {
  tarifarios: 'abt_tarifarios_v1',
  camionMap: 'abt_camion_map_v1',
  zonaMap: 'abt_zona_map_v1',
  nextFolio: 'abt_next_folio_v1',
};

const CATEGORIAS = {
  pequenos: 'Camiones Pequeños',
  medianos: 'Camiones Medianos',
  patanas: 'Fletes de Patanas',
};

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ---------- Datos por defecto (tomados de los tarifarios en papel, fecha 11-04-2026) ---------- */

const DEFAULT_TARIFARIOS = {
  pequenos: [
    ['SANTO DOMINGO', 12968.00, 13650.00, 14333.00],
    ['SANTIAGO/LA JOYA', 6242.00, 6570.00, 6899.00],
    ['SAJOMA', 6484.00, 6825.00, 7167.00],
    ['MOCA/SALCEDO', 6484.00, 6825.00, 7167.00],
    ['LA VEGA', 6983.00, 7350.00, 7718.00],
    ['TENARES', 8978.00, 9450.00, 9923.00],
    ['SAN FRANCISCO', 9477.00, 9975.00, 10475.00],
    ['COTUI', 10308.00, 10850.00, 11393.00],
    ['NAGUA', 10973.00, 11550.00, 12128.00],
    ['BONAO', 7980.00, 8400.00, 8820.00],
    ['LAS TERRENAS', 12968.00, 13650.00, 14333.00],
    ['SAMANA CENTRO/LAS GALERAS', 14488.00, 15250.00, 16013.00],
    ['SAN CRISTOBAL', 13538.00, 14250.00, 14963.00],
    ['HAINA', 13538.00, 14250.00, 14963.00],
    ['BANI', 13965.00, 14700.00, 15435.00],
    ['OCOA', 15960.00, 16800.00, 17640.00],
    ['AZUA', 16958.00, 17850.00, 18743.00],
    ['SAN PEDRO DE MACORIS', 15200.00, 16000.00, 16800.00],
    ['LA ROMANA', 16150.00, 17000.00, 17850.00],
    ['HATO MAYOR', 16958.00, 17850.00, 18743.00],
    ['HIGUEY', 17955.00, 18900.00, 19845.00],
    ['EL SEIBO', 16483.00, 17350.00, 18218.00],
    ['BAVARO', 20948.00, 22050.00, 23153.00],
    ['PUERTO PLATA', 7505.00, 7900.00, 8295.00],
    ['SOSUA', 7980.00, 8400.00, 8820.00],
    ['CABARETE', 8503.00, 8950.00, 9398.00],
    ['JAMAO/GASPAR HDEZ', 9500.00, 10000.00, 10500.00],
    ['MONTE CRISTI/DAJABON', 8978.00, 9450.00, 9923.00],
    ['VILLA VASQUEZ/CASTAÑUELAS', 8978.00, 9450.00, 9923.00],
    ['ESPERANZA', 5510.00, 5800.00, 6090.00],
    ['MAO', 5985.00, 6300.00, 6615.00],
    ['CONSTANZA', 11495.00, 12100.00, 12705.00],
    ['JARABACOA', 7980.00, 8400.00, 8820.00],
    ['MONTE PLATA', 14915.00, 15700.00, 16485.00],
    ['BAYAGUANA', 15675.00, 16500.00, 17325.00],
    ['SABANA GRANDE DE BOYA', 14963.00, 15750.00, 16538.00],
    ['LA ISABELA', 7980.00, 8400.00, 8820.00],
    ['LUPERON', 6983.00, 7350.00, 7718.00],
    ['SANTIAGO RGUEZ', 7980.00, 8400.00, 8820.00],
  ],
  medianos: [
    ['SANTO DOMINGO / B. CHICA', 18953.00, 19950.00, 20948.00],
    ['SANTIAGO', 7980.00, 8400.00, 8820.00],
    ['PUERTO PLATA', 14963.00, 15750.00, 16538.00],
    ['MAO', 8978.00, 9450.00, 9923.00],
    ['DAJABON', 15960.00, 16800.00, 17640.00],
    ['ESPERANZA', 7980.00, 8400.00, 8820.00],
    ['LA VEGA', 10973.00, 11550.00, 12128.00],
    ['MOCA', 10213.00, 10750.00, 11287.50],
    ['MONTECRISTI', 14963.00, 15750.00, 16538.00],
    ['VILLA VASQUEZ/CASTAÑUELAS', 14963.00, 15750.00, 16538.00],
    ['SAN PEDRO', 25935.00, 27300.00, 28665.00],
    ['LA ROMANA', 30923.00, 32550.00, 34178.00],
    ['SAMANA', 18953.00, 19950.00, 20948.00],
    ['SAN CRISTOBAL', 18953.00, 19950.00, 20948.00],
    ['SAN FRANCISCO', 13965.00, 14700.00, 15435.00],
    ['HAINA', 18953.00, 19950.00, 20948.00],
    ['OCOA', 30923.00, 32550.00, 34178.00],
    ['AZUA', 31920.00, 33600.00, 35280.00],
    ['HIGUEY', 34913.00, 36750.00, 38588.00],
    ['BAVARO', 37905.00, 39900.00, 41895.00],
    ['CONSTANZA', 17955.00, 18900.00, 19845.00],
    ['JAMAO/GASPAR HERNANDEZ', 15960.00, 16800.00, 17640.00],
  ],
  patanas: [
    ['SAN ISIDRO(G.RAMOS)(PLAZA LAMA)', 23940.00, 25200.00, 26460.00],
    ['OLE CENTRO', 23940.00, 25200.00, 26460.00],
    ['BRAVO', 23940.00, 25200.00, 26460.00],
    ['BAVARO', 46883.00, 49350.00, 51818.00],
    ['SANTIAGO', 11970.00, 12600.00, 13230.00],
    ['STO DOMINGO (CENTRO)', 21945.00, 23100.00, 24255.00],
    ['TAMBORIL', 12968.00, 13650.00, 14333.00],
  ],
};

const DEFAULT_CAMION_MAP = {
  PATANA: 'patanas',
  MACK: 'medianos',
  DAIHATSU: 'pequenos',
};

/* ---------------------------- Utilidades ---------------------------- */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function norm(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function formatRD(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sumDescargas(descargas) {
  return (descargas || []).reduce((s, d) => s + (Number(d.monto) || 0), 0);
}

// Widget reutilizable: lista de descargas (monto + descripción) con alta/baja,
// usado tanto en la tabla de revisión como en las tarjetas de requisición.
function renderDescargasList(container, descargas, onChange) {
  const rerender = () => { renderDescargasList(container, descargas, onChange); onChange(); };

  container.innerHTML = '';
  descargas.forEach((d, i) => {
    const item = document.createElement('div');
    item.className = 'descarga-item';
    item.innerHTML = `
      <input type="number" step="0.01" placeholder="Monto" value="${d.monto}" data-role="monto">
      <input type="text" placeholder="Descripción" value="${d.descripcion || ''}" data-role="descripcion">
      <button type="button" class="btn-remove-descarga" title="Quitar">&times;</button>
    `;
    item.querySelector('[data-role="monto"]').addEventListener('change', (e) => {
      d.monto = Number(e.target.value) || 0;
      rerender();
    });
    item.querySelector('[data-role="descripcion"]').addEventListener('change', (e) => {
      d.descripcion = e.target.value;
      rerender();
    });
    item.querySelector('.btn-remove-descarga').addEventListener('click', () => {
      descargas.splice(i, 1);
      rerender();
    });
    container.appendChild(item);
  });

  const totalEl = document.createElement('div');
  totalEl.className = 'descarga-total';
  totalEl.innerHTML = `Total: <strong>${formatRD(sumDescargas(descargas))}</strong>`;
  container.appendChild(totalEl);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn small btnAddDescarga';
  addBtn.textContent = '+ Agregar descarga';
  addBtn.addEventListener('click', () => {
    descargas.push({ monto: 0, descripcion: '' });
    rerender();
  });
  container.appendChild(addBtn);
}

function formatFechaDMY(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function inDateRange(d, start, end) {
  if (!(d instanceof Date) || isNaN(d)) return false;
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t >= s && t <= e;
}

function formatRangoFechasDMY(start, end) {
  const a = formatFechaDMY(start);
  const b = formatFechaDMY(end);
  return a === b ? a : `${a} - ${b}`;
}

function parseDateInputValue(val) {
  // val = "YYYY-MM-DD" from <input type="date">
  const [y, m, d] = val.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Algunos archivos "recuperados automáticamente" declaran un !ref inflado
// (p.ej. hasta la columna XFD y fila 1,048,561) aunque los datos reales
// ocupen unas pocas columnas/filas. Sin acotar, sheet_to_json intenta
// materializar un arreglo gigantesco y cuelga el navegador. Se limita
// siempre el rango leído a un tamaño razonable con margen de sobra.
function sheetToRowsBounded(ws, maxRows, maxCols) {
  const ref = ws['!ref'];
  let range = ref ? XLSX.utils.decode_range(ref) : { s: { r: 0, c: 0 }, e: { r: maxRows, c: maxCols } };
  range.e.r = Math.min(range.e.r, maxRows);
  range.e.c = Math.min(range.e.c, maxCols);
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true, range });
}

/* ---------------------------- Estado en memoria ---------------------------- */

let tarifarios = loadJSON(STORAGE.tarifarios, null) || JSON.parse(JSON.stringify(DEFAULT_TARIFARIOS));
let camionMap = loadJSON(STORAGE.camionMap, null) || { ...DEFAULT_CAMION_MAP };
let zonaMap = loadJSON(STORAGE.zonaMap, null) || {}; // { categoria: { PARAJE_NORM: 'Zona Exacta' } }
let nextFolio = loadJSON(STORAGE.nextFolio, null) || 1;

let viajesData = [];   // todos los registros parseados del excel de viajes
let filaActuales = []; // filas de trabajo para la fecha seleccionada
let requisicionesGeneradas = []; // últimas requisiciones generadas (con folio)

if (!loadJSON(STORAGE.tarifarios, null)) saveJSON(STORAGE.tarifarios, tarifarios);
if (!loadJSON(STORAGE.camionMap, null)) saveJSON(STORAGE.camionMap, camionMap);
if (!loadJSON(STORAGE.nextFolio, null)) saveJSON(STORAGE.nextFolio, nextFolio);

/* ---------------------------- Tabs ---------------------------- */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ============================================================
   TARIFARIOS TAB
   ============================================================ */

function renderTarifarioTable(cat) {
  const table = document.querySelector(`table.tarifario-table[data-cat="${cat}"]`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  tarifarios[cat].forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${row[0] ?? ''}" data-field="zona"></td>
      <td><input type="number" step="0.01" value="${row[1] ?? ''}" data-field="menos5"></td>
      <td><input type="number" step="0.01" value="${row[2] ?? ''}" data-field="tarifa"></td>
      <td><input type="number" step="0.01" value="${row[3] ?? ''}" data-field="mas5"></td>
      <td><button class="btn small danger" data-action="del">✕</button></td>
    `;
    tr.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', () => {
        const field = inp.dataset.field;
        const fieldIdx = { zona: 0, menos5: 1, tarifa: 2, mas5: 3 }[field];
        tarifarios[cat][idx][fieldIdx] = field === 'zona' ? inp.value : Number(inp.value);
        saveJSON(STORAGE.tarifarios, tarifarios);
      });
    });
    tr.querySelector('[data-action="del"]').addEventListener('click', () => {
      tarifarios[cat].splice(idx, 1);
      saveJSON(STORAGE.tarifarios, tarifarios);
      renderTarifarioTable(cat);
    });
    tbody.appendChild(tr);
  });
}

document.querySelectorAll('.addTarifaRow').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    tarifarios[cat].push(['', 0, 0, 0]);
    saveJSON(STORAGE.tarifarios, tarifarios);
    renderTarifarioTable(cat);
  });
});

function normalizeHeaderCell(v) {
  return norm(v);
}

function toNum(v) {
  if (typeof v === 'number') return v;
  if (!v) return 0;
  const s = String(v).replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
  return Number(s) || 0;
}

function setUploadStatus(cat, text, cls) {
  const el = document.querySelector(`[data-status-for="${cat}"]`);
  if (!el) return;
  el.textContent = text;
  el.className = 'status' + (cls ? ' ' + cls : '');
}

function parseTarifarioExcel(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = sheetToRowsBounded(ws, 500, 10);
  let headerRowIdx = -1, cols = {};
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const row = rows[r];
    const idxMap = {};
    row.forEach((cell, c) => {
      const h = normalizeHeaderCell(cell);
      if (h === 'ZONA') idxMap.zona = c;
      else if (h.startsWith('-') || h === 'MENOS5' || h === '-5') idxMap.menos5 = c;
      else if (h === 'TARIFA') idxMap.tarifa = c;
      else if (h.includes('5') && idxMap.tarifa !== c) idxMap.mas5 = c;
    });
    if (idxMap.zona !== undefined && idxMap.tarifa !== undefined) {
      headerRowIdx = r; cols = idxMap; break;
    }
  }
  if (headerRowIdx === -1) return null;
  const newRows = [];
  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const zona = row[cols.zona];
    if (!zona || String(zona).trim() === '') continue;
    newRows.push([
      String(zona).trim(),
      toNum(row[cols.menos5]),
      toNum(row[cols.tarifa]),
      toNum(row[cols.mas5]),
    ]);
  }
  return newRows;
}

// Números tal como los muestra esta app (formatRD, es-DO): coma = separador
// de miles, punto = decimal. Ej: "13,500.00" -> 13500.
function parseMoneyToken(s) {
  return Number(String(s).replace(/,/g, '')) || 0;
}

// Convierte líneas de texto sueltas (extraídas de un PDF o de OCR sobre una
// imagen) en filas [zona, -5%, tarifa, +5%]. Cada línea puede traer 1 número
// (solo la tarifa: el -5%/+5% se calcula, como en el resto del tarifario) o
// 3 números (-5%, tarifa, +5% ya desglosados).
function parseTarifarioLines(lines) {
  const rows = [];
  (lines || []).forEach(rawLine => {
    const line = String(rawLine || '').trim();
    if (!line) return;
    const numMatches = line.match(/\d[\d.,]*\d|\d/g) || [];
    if (numMatches.length === 0) return;
    let zonaText = line;
    numMatches.forEach(n => { zonaText = zonaText.replace(n, ' '); });
    const zona = zonaText.replace(/[^A-Za-zÀ-ÿ0-9()/.\-\s]/g, ' ').replace(/\s{2,}/g, ' ').trim().toUpperCase();
    if (!zona) return;
    const nums = numMatches.map(parseMoneyToken);
    let menos5, tarifa, mas5;
    if (nums.length >= 3) {
      [menos5, tarifa, mas5] = nums;
    } else {
      tarifa = nums[0];
      menos5 = Math.round(tarifa * 0.95 * 100) / 100;
      mas5 = Math.round(tarifa * 1.05 * 100) / 100;
    }
    if (tarifa > 0) rows.push([zona, menos5, tarifa, mas5]);
  });
  return rows;
}

async function extractLinesFromPdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const lines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const buckets = [];
    content.items.forEach(item => {
      const y = item.transform[5];
      const x = item.transform[4];
      let bucket = buckets.find(b => Math.abs(b.y - y) <= 2);
      if (!bucket) { bucket = { y, items: [] }; buckets.push(bucket); }
      bucket.items.push({ x, str: item.str });
    });
    buckets.sort((a, b) => b.y - a.y);
    buckets.forEach(b => {
      const line = b.items.sort((i1, i2) => i1.x - i2.x).map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
      if (line) lines.push(line);
    });
  }
  return lines;
}

// worker/núcleo wasm/datos de idioma alojados en tess/ (en vez de los
// predeterminados en jsdelivr.net): en redes que bloquean ese CDN el OCR
// fallaba con "Error al leer el archivo" aunque el resto de la app cargara bien.
async function extractLinesFromImage(file) {
  const { data } = await Tesseract.recognize(file, 'spa', {
    workerPath: 'tess/worker.min.js',
    corePath: 'tess',
    langPath: 'tess',
    gzip: true,
  });
  return String(data.text || '').split('\n');
}

/* ---- Modal: revisar e importar zonas detectadas en PDF/imagen ---- */

let tarifarioImportState = null;

function renderTarifarioImportTable() {
  const tbody = document.getElementById('tarifarioImportTableBody');
  tbody.innerHTML = '';
  const { cat, rows } = tarifarioImportState;
  rows.forEach((row, idx) => {
    const existe = tarifarios[cat].some(r => norm(r[0]) === norm(row[0]));
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${row[0] ?? ''}" data-field="zona"></td>
      <td><input type="number" step="0.01" value="${row[1] ?? ''}" data-field="menos5"></td>
      <td><input type="number" step="0.01" value="${row[2] ?? ''}" data-field="tarifa"></td>
      <td><input type="number" step="0.01" value="${row[3] ?? ''}" data-field="mas5"></td>
      <td><span class="${existe ? 'tag-existente' : 'tag-nueva'}">${existe ? 'Existente' : 'Nueva'}</span></td>
      <td><button type="button" class="btn small danger" data-action="del">✕</button></td>
    `;
    tr.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', () => {
        const field = inp.dataset.field;
        const fieldIdx = { zona: 0, menos5: 1, tarifa: 2, mas5: 3 }[field];
        row[fieldIdx] = field === 'zona' ? inp.value.trim().toUpperCase() : Number(inp.value) || 0;
        renderTarifarioImportTable();
      });
    });
    tr.querySelector('[data-action="del"]').addEventListener('click', () => {
      rows.splice(idx, 1);
      renderTarifarioImportTable();
    });
    tbody.appendChild(tr);
  });
}

function openTarifarioImportModal(cat, newRows, sourceLabel) {
  tarifarioImportState = { cat, rows: newRows.map(r => [...r]) };
  document.getElementById('tarifarioImportHint').textContent =
    `Detectado en "${sourceLabel}" para "${CATEGORIAS[cat]}". Revisa y corrige antes de aplicar: las zonas que ya existen se sobrescriben, las nuevas se agregan y ninguna se duplica.`;
  document.getElementById('tarifarioImportStatus').textContent = '';
  renderTarifarioImportTable();
  document.getElementById('tarifarioImportModal').style.display = 'flex';
}

function closeTarifarioImportModal() {
  document.getElementById('tarifarioImportModal').style.display = 'none';
  tarifarioImportState = null;
}

document.getElementById('btnTarifarioImportCancelar').addEventListener('click', closeTarifarioImportModal);

document.getElementById('btnTarifarioImportConfirmar').addEventListener('click', () => {
  const { cat, rows } = tarifarioImportState;
  const valid = rows.filter(r => r[0] && r[2] > 0);
  if (valid.length === 0) {
    document.getElementById('tarifarioImportStatus').textContent = 'No hay zonas válidas para aplicar.';
    document.getElementById('tarifarioImportStatus').className = 'status error';
    return;
  }
  let actualizadas = 0, nuevas = 0;
  valid.forEach(row => {
    const idx = tarifarios[cat].findIndex(r => norm(r[0]) === norm(row[0]));
    if (idx !== -1) { tarifarios[cat][idx] = row; actualizadas++; }
    else { tarifarios[cat].push(row); nuevas++; }
  });
  saveJSON(STORAGE.tarifarios, tarifarios);
  renderTarifarioTable(cat);
  setUploadStatus(cat, `${actualizadas} zona(s) actualizada(s), ${nuevas} nueva(s).`, 'ok');
  closeTarifarioImportModal();
});

document.querySelectorAll('.tarifarioUpload').forEach(input => {
  input.addEventListener('change', async (e) => {
    const cat = input.dataset.cat;
    const file = e.target.files[0];
    if (!file) return;
    const name = file.name.toLowerCase();

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newRows = parseTarifarioExcel(ev.target.result);
        if (newRows === null) {
          alert('No se pudo encontrar la fila de encabezado (ZONA, -5%, TARIFA, +5%) en el archivo.');
        } else if (newRows.length === 0) {
          alert('No se encontraron filas de datos en el archivo.');
        } else if (confirm(`Se reemplazará la tabla "${CATEGORIAS[cat]}" con ${newRows.length} zonas del archivo. ¿Continuar?`)) {
          tarifarios[cat] = newRows;
          saveJSON(STORAGE.tarifarios, tarifarios);
          renderTarifarioTable(cat);
          setUploadStatus(cat, `Tabla reemplazada: ${newRows.length} zona(s).`, 'ok');
        }
        input.value = '';
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    const isPdf = name.endsWith('.pdf');
    const isImage = /\.(png|jpe?g|webp)$/.test(name);
    if (!isPdf && !isImage) {
      alert('Formato no soportado. Usa un Excel (.xlsx/.xls), un PDF o una imagen (.png/.jpg/.webp).');
      input.value = '';
      return;
    }

    try {
      setUploadStatus(cat, isPdf ? 'Leyendo PDF...' : 'Reconociendo texto de la imagen... esto puede tardar unos segundos.');
      const lines = isPdf
        ? await extractLinesFromPdf(await file.arrayBuffer())
        : await extractLinesFromImage(file);
      const newRows = parseTarifarioLines(lines);
      setUploadStatus(cat, '');
      if (newRows.length === 0) {
        alert('No se pudo detectar ninguna zona con tarifa en el archivo. Prueba con una imagen más clara o revisa el PDF.');
      } else {
        openTarifarioImportModal(cat, newRows, file.name);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus(cat, `Error al leer el archivo: ${err.message || err}`, 'error');
    }
    input.value = '';
  });
});

/* ---- Mapeo Camión -> Categoría ---- */

function renderCamionMap() {
  const tbody = document.getElementById('tablaCamionMapBody');
  tbody.innerHTML = '';
  Object.keys(camionMap).forEach(camion => {
    const tr = document.createElement('tr');
    const options = Object.keys(CATEGORIAS).map(c =>
      `<option value="${c}" ${camionMap[camion] === c ? 'selected' : ''}>${CATEGORIAS[c]}</option>`
    ).join('');
    tr.innerHTML = `
      <td><input type="text" value="${camion}" data-role="camionName"></td>
      <td><select data-role="camionCat">${options}</select></td>
      <td><button class="btn small danger" data-action="del">✕</button></td>
    `;
    tr.querySelector('[data-role="camionCat"]').addEventListener('change', (e) => {
      camionMap[camion] = e.target.value;
      saveJSON(STORAGE.camionMap, camionMap);
    });
    tr.querySelector('[data-role="camionName"]').addEventListener('change', (e) => {
      const newName = e.target.value.trim().toUpperCase();
      if (!newName || newName === camion) { e.target.value = camion; return; }
      const cat = camionMap[camion];
      delete camionMap[camion];
      camionMap[newName] = cat;
      saveJSON(STORAGE.camionMap, camionMap);
      renderCamionMap();
    });
    tr.querySelector('[data-action="del"]').addEventListener('click', () => {
      delete camionMap[camion];
      saveJSON(STORAGE.camionMap, camionMap);
      renderCamionMap();
    });
    tbody.appendChild(tr);
  });
}

document.getElementById('btnAddCamion').addEventListener('click', () => {
  const name = prompt('Nombre del tipo de camión (como aparece en el Excel de viajes):');
  if (!name) return;
  const key = name.trim().toUpperCase();
  camionMap[key] = 'pequenos';
  saveJSON(STORAGE.camionMap, camionMap);
  renderCamionMap();
});

/* ============================================================
   AJUSTES TAB
   ============================================================ */

function renderAjustes() {
  document.getElementById('nextFolioInput').value = nextFolio;
  renderZonaMapTable();
}

document.getElementById('btnGuardarFolio').addEventListener('click', () => {
  const v = Number(document.getElementById('nextFolioInput').value);
  const statusEl = document.getElementById('folioStatus');
  if (!v || v < 1) {
    statusEl.textContent = 'Ingresa un número de folio válido.';
    statusEl.className = 'status error';
    return;
  }
  nextFolio = Math.floor(v);
  saveJSON(STORAGE.nextFolio, nextFolio);
  statusEl.textContent = 'Guardado.';
  statusEl.className = 'status ok';
});

function renderZonaMapTable() {
  const tbody = document.getElementById('tablaZonaMapBody');
  tbody.innerHTML = '';
  Object.keys(zonaMap).forEach(cat => {
    Object.keys(zonaMap[cat]).forEach(parajeNorm => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${CATEGORIAS[cat] || cat}</td>
        <td>${parajeNorm}</td>
        <td>${zonaMap[cat][parajeNorm]}</td>
        <td><button class="btn small danger" data-action="del">✕</button></td>
      `;
      tr.querySelector('[data-action="del"]').addEventListener('click', () => {
        delete zonaMap[cat][parajeNorm];
        saveJSON(STORAGE.zonaMap, zonaMap);
        renderZonaMapTable();
      });
      tbody.appendChild(tr);
    });
  });
}

document.getElementById('btnLimpiarZonaMap').addEventListener('click', () => {
  if (confirm('¿Borrar todos los mapeos Paraje→Zona aprendidos? Esto no se puede deshacer.')) {
    zonaMap = {};
    saveJSON(STORAGE.zonaMap, zonaMap);
    renderZonaMapTable();
  }
});

/* ============================================================
   PROCESAR: Carga de Excel de Control de Viajes Rentados
   ============================================================ */

document.getElementById('fileViajes').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('viajesStatus');
  statusEl.textContent = 'Cargando...';
  statusEl.className = 'status';
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array', cellDates: true });
      const records = [];
      wb.SheetNames.forEach(sheetName => {
        const ws = wb.Sheets[sheetName];
        const rows = sheetToRowsBounded(ws, 5000, 16);
        let headerRowIdx = -1;
        for (let r = 0; r < Math.min(rows.length, 6); r++) {
          if (norm(rows[r][0]) === 'FECHA') { headerRowIdx = r; break; }
        }
        if (headerRowIdx === -1) return;
        for (let r = headerRowIdx + 1; r < rows.length; r++) {
          const row = rows[r];
          const fecha = row[0];
          let fechaDate = null;
          if (fecha instanceof Date && !isNaN(fecha)) fechaDate = fecha;
          else continue; // filas sin fecha válida (resúmenes, totales, etc.) se descartan
          records.push({
            fecha: fechaDate,
            zonaExcel: String(row[1] ?? '').trim(),
            paraje: String(row[2] ?? '').trim(),
            camion: String(row[3] ?? '').trim().toUpperCase(),
            qqs: Number(row[4]) || 0,
            cantCl: Number(row[5]) || 0,
            contratista: String(row[6] ?? '').trim(),
            chofer: String(row[7] ?? '').trim(),
            precio: Number(row[8]) || 0,
            sheet: sheetName,
          });
        }
      });
      viajesData = records;
      statusEl.textContent = `Cargado: ${records.length} viajes en ${wb.SheetNames.length} hojas.`;
      statusEl.className = 'status ok';
      document.getElementById('fechaCard').style.display = '';
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Error al leer el archivo. Verifica que sea el Excel correcto.';
      statusEl.className = 'status error';
    }
  };
  reader.readAsArrayBuffer(file);
});

/* ---------------------------- Buscar por rango de fechas ---------------------------- */

document.getElementById('btnBuscarFecha').addEventListener('click', () => {
  const valInicio = document.getElementById('fechaInicioInput').value;
  const valFin = document.getElementById('fechaFinInput').value;
  const statusEl = document.getElementById('fechaStatus');
  if (!valInicio) {
    statusEl.textContent = 'Elige al menos la fecha "Desde".';
    statusEl.className = 'status error';
    return;
  }
  const fechaInicio = parseDateInputValue(valInicio);
  const fechaFin = valFin ? parseDateInputValue(valFin) : fechaInicio;
  if (fechaFin < fechaInicio) {
    statusEl.textContent = 'La fecha "Hasta" no puede ser anterior a la fecha "Desde".';
    statusEl.className = 'status error';
    return;
  }
  const rows = viajesData.filter(r => inDateRange(r.fecha, fechaInicio, fechaFin));
  if (rows.length === 0) {
    statusEl.textContent = 'No hay registros para ese rango de fechas en el archivo cargado.';
    statusEl.className = 'status error';
    document.getElementById('tablaCard').style.display = 'none';
    return;
  }
  statusEl.textContent = `${rows.length} viajes encontrados.`;
  statusEl.className = 'status ok';
  construirFilasTrabajo(rows);
  document.getElementById('tablaCard').style.display = '';
  document.getElementById('previewCard').style.display = 'none';
});

/* ---------------------------- Construir filas de trabajo ---------------------------- */

function matchZonaAutomatica(categoria, paraje) {
  const pNorm = norm(paraje);
  if (!pNorm) return '';
  const learned = zonaMap[categoria] && zonaMap[categoria][pNorm];
  if (learned && tarifarios[categoria].some(r => r[0] === learned)) return learned;

  const zonas = tarifarios[categoria].map(r => r[0]);
  // 1) coincidencia exacta
  for (const z of zonas) {
    if (norm(z) === pNorm) return z;
  }
  // 2) coincidencia por token (zonas separadas por / u otros símbolos)
  for (const z of zonas) {
    const tokens = z.split(/[\/,]/).map(t => norm(t)).filter(Boolean);
    for (const tok of tokens) {
      if (tok === pNorm || tok.includes(pNorm) || pNorm.includes(tok)) return z;
    }
  }
  return '';
}

function construirFilasTrabajo(rows) {
  filaActuales = rows.map(r => {
    const categoria = camionMap[r.camion] || null;
    const zonaTarifario = categoria ? matchZonaAutomatica(categoria, r.paraje) : '';
    return {
      ...r,
      categoria,
      zonaTarifario,
      aplica: false,
      descargas: [],
      transportista: r.contratista,
      destino: r.paraje,
    };
  });
  renderTablaDatos();
}

function getTarifaBase(categoria, zonaTarifario) {
  if (!categoria || !zonaTarifario) return 0;
  const row = tarifarios[categoria].find(r => r[0] === zonaTarifario);
  return row ? row[2] : 0;
}

function getTotalNeto(categoria, zonaTarifario, aplica) {
  if (!categoria || !zonaTarifario) return 0;
  const row = tarifarios[categoria].find(r => r[0] === zonaTarifario);
  if (!row) return 0;
  return aplica ? row[3] : row[1];
}

function renderTablaDatos() {
  const tbody = document.getElementById('tablaDatosBody');
  tbody.innerHTML = '';
  filaActuales.forEach((fila, idx) => {
    const tr = document.createElement('tr');
    if (!fila.categoria || !fila.zonaTarifario) tr.classList.add('row-error');

    const catOptions = `<option value="">(sin mapear)</option>` + Object.keys(CATEGORIAS).map(c =>
      `<option value="${c}" ${fila.categoria === c ? 'selected' : ''}>${CATEGORIAS[c]}</option>`
    ).join('');

    tr.innerHTML = `
      <td>${formatFechaDMY(fila.fecha)}</td>
      <td>${fila.zonaExcel}</td>
      <td>${fila.paraje}</td>
      <td>${fila.camion}</td>
      <td>${fila.qqs}</td>
      <td>${fila.cantCl}</td>
      <td>${fila.contratista}</td>
      <td>${fila.chofer}</td>
      <td><select data-role="categoria">${catOptions}</select></td>
      <td><select data-role="zonaTarifario"></select></td>
      <td class="tarifaCell">${formatRD(getTarifaBase(fila.categoria, fila.zonaTarifario))}</td>
      <td style="text-align:center;"><input type="checkbox" data-role="aplica" ${fila.aplica ? 'checked' : ''}></td>
      <td class="descargaCell" data-role="descargaCell"></td>
      <td><input type="text" value="${fila.transportista}" data-role="transportista" style="width:120px;"></td>
      <td><input type="text" value="${fila.destino}" data-role="destino" style="width:120px;"></td>
    `;

    const catSelect = tr.querySelector('[data-role="categoria"]');
    const zonaSelect = tr.querySelector('[data-role="zonaTarifario"]');
    const tarifaCell = tr.querySelector('.tarifaCell');
    renderDescargasList(tr.querySelector('[data-role="descargaCell"]'), fila.descargas, () => {});

    function fillZonaOptions() {
      const cat = fila.categoria;
      zonaSelect.innerHTML = '<option value="">(elegir zona)</option>';
      if (cat) {
        tarifarios[cat].forEach(r => {
          const opt = document.createElement('option');
          opt.value = r[0];
          opt.textContent = r[0];
          if (r[0] === fila.zonaTarifario) opt.selected = true;
          zonaSelect.appendChild(opt);
        });
      }
      zonaSelect.classList.toggle('unmatched', !fila.zonaTarifario);
    }
    fillZonaOptions();

    catSelect.addEventListener('change', (e) => {
      fila.categoria = e.target.value || null;
      fila.zonaTarifario = fila.categoria ? matchZonaAutomatica(fila.categoria, fila.paraje) : '';
      fillZonaOptions();
      tarifaCell.textContent = formatRD(getTarifaBase(fila.categoria, fila.zonaTarifario));
      tr.classList.toggle('row-error', !fila.categoria || !fila.zonaTarifario);
    });

    zonaSelect.addEventListener('change', (e) => {
      fila.zonaTarifario = e.target.value;
      tarifaCell.textContent = formatRD(getTarifaBase(fila.categoria, fila.zonaTarifario));
      zonaSelect.classList.toggle('unmatched', !fila.zonaTarifario);
      tr.classList.toggle('row-error', !fila.categoria || !fila.zonaTarifario);
      if (fila.categoria && fila.zonaTarifario) {
        if (!zonaMap[fila.categoria]) zonaMap[fila.categoria] = {};
        zonaMap[fila.categoria][norm(fila.paraje)] = fila.zonaTarifario;
        saveJSON(STORAGE.zonaMap, zonaMap);
        renderZonaMapTable();
      }
    });

    tr.querySelector('[data-role="aplica"]').addEventListener('change', (e) => {
      fila.aplica = e.target.checked;
    });
    tr.querySelector('[data-role="transportista"]').addEventListener('change', (e) => {
      fila.transportista = e.target.value;
    });
    tr.querySelector('[data-role="destino"]').addEventListener('change', (e) => {
      fila.destino = e.target.value;
    });

    tbody.appendChild(tr);
  });
}

document.getElementById('btnAplicarTodos').addEventListener('click', () => {
  filaActuales.forEach(f => f.aplica = true);
  renderTablaDatos();
});
document.getElementById('btnNoAplicarTodos').addEventListener('click', () => {
  filaActuales.forEach(f => f.aplica = false);
  renderTablaDatos();
});

/* ============================================================
   GENERAR REQUISICIONES
   ============================================================ */

document.getElementById('btnGenerar').addEventListener('click', () => {
  const statusEl = document.getElementById('generarStatus');
  const incompletas = filaActuales.filter(f => !f.categoria || !f.zonaTarifario);
  if (incompletas.length > 0) {
    statusEl.textContent = `Hay ${incompletas.length} fila(s) sin categoría o zona de tarifario asignada. Complétalas antes de generar.`;
    statusEl.className = 'status error';
    return;
  }
  if (filaActuales.length === 0) {
    statusEl.textContent = 'No hay datos para generar.';
    statusEl.className = 'status error';
    return;
  }
  if (!confirm(`Se generarán ${filaActuales.length} requisiciones usando los folios ${nextFolio} a ${nextFolio + filaActuales.length - 1}. ¿Continuar?`)) {
    return;
  }

  requisicionesGeneradas = filaActuales.map((f, i) => {
    const tarifa = getTarifaBase(f.categoria, f.zonaTarifario);
    const descargas = (f.descargas || []).map(d => ({ ...d }));
    const totalNeto = getTotalNeto(f.categoria, f.zonaTarifario, f.aplica) - sumDescargas(descargas);
    return {
      folio: nextFolio + i,
      fecha: f.fecha,
      transportista: f.transportista,
      camion: f.camion,
      destino: f.destino,
      tarifa,
      descargas,
      totalNeto,
      qqs: f.qqs,
      aplica: f.aplica,
      categoria: f.categoria,
      zonaTarifario: f.zonaTarifario,
      contratista: f.contratista,
      chofer: f.chofer,
      observacion: f.aplica ? 'Aplica +5%' : 'No aplica (-5%)',
    };
  });

  nextFolio += filaActuales.length;
  saveJSON(STORAGE.nextFolio, nextFolio);
  document.getElementById('nextFolioInput').value = nextFolio;

  statusEl.textContent = `${requisicionesGeneradas.length} requisiciones generadas (folios ${requisicionesGeneradas[0].folio}–${requisicionesGeneradas[requisicionesGeneradas.length - 1].folio}).`;
  statusEl.className = 'status ok';

  renderPreview();
  document.getElementById('previewCard').style.display = '';
  document.getElementById('previewCard').scrollIntoView({ behavior: 'smooth' });
});

function calcularResumen() {
  const montoFinal = requisicionesGeneradas.reduce((s, r) => s + r.tarifa, 0);
  const elTotal = requisicionesGeneradas.reduce((s, r) => s + r.totalNeto, 0);
  const diferencia = elTotal - montoFinal;
  return { montoFinal, elTotal, diferencia };
}

function updateSummaryBox() {
  const summaryBox = document.getElementById('summaryBox');
  const { montoFinal, elTotal, diferencia } = calcularResumen();
  summaryBox.innerHTML = `
    <div class="item">Suma de Tarifas (Monto Final)<strong>RD$ ${formatRD(montoFinal)}</strong></div>
    <div class="item">Suma de Total Neto (El Total)<strong>RD$ ${formatRD(elTotal)}</strong></div>
    <div class="item">Diferencia (Total − Monto Final)<strong>RD$ ${formatRD(diferencia)}</strong></div>
    <div class="item">Cantidad de Requisiciones<strong>${requisicionesGeneradas.length}</strong></div>
  `;
}

function renderPreview() {
  updateSummaryBox();

  const container = document.getElementById('requisicionesContainer');
  container.innerHTML = '';
  requisicionesGeneradas.forEach((r, idx) => {
    const div = document.createElement('div');
    div.className = 'requisicion';
    div.innerHTML = `
      <div class="req-header">
        <h3>ARTURO BISONÓ TORIBIO, S.R.L.</h3>
        <div class="subtitle">REQUISICIÓN TRANSPORTE EXTERNO</div>
      </div>
      <div class="req-top">
        <span class="folio">${r.folio}</span>
        <span class="fecha">Fecha: ${formatFechaDMY(r.fecha)}</span>
      </div>
      <div class="field-line"><label>Transportista:</label><input type="text" value="${r.transportista}" data-role="transportista"></div>
      <div class="field-line"><label>Tipo de Camión:</label><input type="text" value="${r.camion}" data-role="camion"></div>
      <div class="field-line"><label>Destino:</label><input type="text" value="${r.destino}" data-role="destino"></div>
      <div class="field-line"><label>Tarifa RD$:</label><input type="text" value="${formatRD(r.tarifa)}" readonly></div>
      <div class="descarga-block">
        <label>Descarga RD$:</label>
        <div class="descargaCell" data-role="descargaCell"></div>
      </div>
      <div class="field-line"><label>Total Neto RD$:</label><input type="text" value="${formatRD(r.totalNeto)}" readonly data-role="totalNeto"><label>QQs:</label><input type="text" value="${r.qqs}" readonly style="max-width:70px;"></div>
      <div class="field-line"><label>Observación:</label><textarea data-role="observacion" rows="1">${r.observacion}</textarea></div>
      <div class="signatures"><span>Realizado</span><span>Verificado</span></div>
    `;
    div.querySelector('[data-role="transportista"]').addEventListener('change', e => r.transportista = e.target.value);
    div.querySelector('[data-role="camion"]').addEventListener('change', e => r.camion = e.target.value);
    div.querySelector('[data-role="destino"]').addEventListener('change', e => r.destino = e.target.value);
    renderDescargasList(div.querySelector('[data-role="descargaCell"]'), r.descargas, () => {
      r.totalNeto = getTotalNeto(r.categoria, r.zonaTarifario, r.aplica) - sumDescargas(r.descargas);
      div.querySelector('[data-role="totalNeto"]').value = formatRD(r.totalNeto);
      updateSummaryBox();
    });
    div.querySelector('[data-role="observacion"]').addEventListener('change', e => r.observacion = e.target.value);
    container.appendChild(div);
  });
}

/* ============================================================
   DESCARGAS: PDF y Excel (listado completo)
   ============================================================ */

document.getElementById('btnDescargarPdf').addEventListener('click', () => {
  if (requisicionesGeneradas.length === 0) return;
  const { jsPDF } = window.jspdf;

  // Página tamaño carta con varias requisiciones en una cuadrícula de 2 columnas,
  // usando la altura compacta real del contenido (igual que el preview en pantalla)
  // en vez de estirar cada una a una caja grande con espacio vacío.
  const PAGE_W = 215.9, PAGE_H = 279.4;
  const MARGIN = 8, GAP_X = 6, GAP_Y = 5, COLS = 2, ROWS = 3;
  const PER_PAGE = COLS * ROWS;
  const voucherW = (PAGE_W - 2 * MARGIN - (COLS - 1) * GAP_X) / COLS;
  const voucherH = (PAGE_H - 2 * MARGIN - (ROWS - 1) * GAP_Y) / ROWS;

  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });

  requisicionesGeneradas.forEach((r, idx) => {
    const posInPage = idx % PER_PAGE;
    if (idx > 0 && posInPage === 0) doc.addPage('letter', 'portrait');
    const col = posInPage % COLS;
    const row = Math.floor(posInPage / COLS);
    const ox = MARGIN + col * (voucherW + GAP_X);
    const oy = MARGIN + row * (voucherH + GAP_Y);
    drawRequisicionPDF(doc, r, ox, oy, voucherW, voucherH);
  });

  doc.addPage('letter', 'portrait');
  drawResumenPDF(doc);

  const fechaRef = requisicionesGeneradas[0].fecha;
  const fname = `Requisiciones_${fechaRef.getFullYear()}${String(fechaRef.getMonth() + 1).padStart(2, '0')}${String(fechaRef.getDate()).padStart(2, '0')}.pdf`;
  doc.save(fname);
});

// Dibuja "Label:____valor____" con la línea en blanco pegada al ":" de la
// etiqueta (como el formulario en papel), no una línea aparte debajo.
function drawBlankField(doc, x, y_, labelX, lineEndX, y, label, value) {
  doc.setFont('helvetica', 'bold');
  doc.text(label, x(labelX), y_(y));
  const blankStart = labelX + doc.getTextWidth(label) + 1.5;
  doc.setDrawColor(140);
  doc.setLineWidth(0.2);
  doc.line(x(blankStart), y_(y + 0.8), x(lineEndX), y_(y + 0.8));
  doc.setFont('helvetica', 'normal');
  doc.text(String(value ?? ''), x(blankStart + 1), y_(y));
  return blankStart;
}

function drawRequisicionPDF(doc, r, ox, oy, W, H) {
  const M = 3; // margen interno
  const x = (v) => ox + v;
  const y_ = (v) => oy + v;

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.5);
  doc.rect(x(M - 1), y_(M - 1), W - 2 * (M - 1), H - 2 * (M - 1));

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('ARTURO BISONÓ TORIBIO, S.R.L.', x(W / 2), y_(M + 5), { align: 'center' });
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.text('REQUISICIÓN TRANSPORTE EXTERNO', x(W / 2), y_(M + 8.7), { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(179, 20, 28);
  doc.text(String(r.folio), x(M + 2), y_(M + 14));
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Fecha: ${formatFechaDMY(r.fecha)}`, x(W - M - 2), y_(M + 14), { align: 'right' });

  let y = M + 19.5;
  const lh = 5.6;
  const labelX = M + 2, lineEndX = W - M - 2;
  doc.setFontSize(7);

  drawBlankField(doc, x, y_, labelX, lineEndX, y, 'Transportista:', r.transportista); y += lh;
  drawBlankField(doc, x, y_, labelX, lineEndX, y, 'Tipo de Camión:', r.camion); y += lh;
  drawBlankField(doc, x, y_, labelX, lineEndX, y, 'Destino:', r.destino); y += lh;
  drawBlankField(doc, x, y_, labelX, lineEndX, y, 'Tarifa RD$:', formatRD(r.tarifa)); y += lh;
  drawBlankField(doc, x, y_, labelX, lineEndX, y, 'Descarga RD$:', formatRD(sumDescargas(r.descargas))); y += lh;

  const qqsLabelX = W - M - 24;
  drawBlankField(doc, x, y_, labelX, qqsLabelX - 2, y, 'Total Neto RD$:', formatRD(r.totalNeto));
  drawBlankField(doc, x, y_, qqsLabelX, lineEndX, y, 'QQs:', r.qqs ?? '');
  y += lh;

  const obsLabel = 'Observación:';
  doc.setFont('helvetica', 'bold');
  doc.text(obsLabel, x(labelX), y_(y));
  const obsBlankStart = labelX + doc.getTextWidth(obsLabel) + 1.5;
  const obsLineHeight = 5;
  const obsLines = doc.splitTextToSize(r.observacion || '', lineEndX - obsBlankStart - 1);
  doc.setFont('helvetica', 'normal');
  obsLines.forEach((line, i) => {
    const ly = y + i * obsLineHeight;
    const lineStart = i === 0 ? obsBlankStart : labelX;
    doc.setDrawColor(140);
    doc.setLineWidth(0.2);
    doc.line(x(lineStart), y_(ly + 0.8), x(lineEndX), y_(ly + 0.8));
    doc.text(line, x(lineStart + 1), y_(ly));
  });
  y += obsLines.length * obsLineHeight;

  const sigY = Math.min(y + 5.5, H - M - 6);
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  doc.setFontSize(6.3);
  doc.line(x(M + 3), y_(sigY), x(W / 2 - 2.5), y_(sigY));
  doc.text('Realizado', x((M + 3 + W / 2 - 2.5) / 2), y_(sigY + 3.4), { align: 'center' });
  doc.line(x(W / 2 + 2.5), y_(sigY), x(W - M - 3), y_(sigY));
  doc.text('Verificado', x((W / 2 + 2.5 + W - M - 3) / 2), y_(sigY + 3.4), { align: 'center' });
}

function drawResumenPDF(doc) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Listado Completo de Requisiciones', 14, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const fechasReq = requisicionesGeneradas.map(r => r.fecha);
  const fechaMin = new Date(Math.min(...fechasReq));
  const fechaMax = new Date(Math.max(...fechasReq));
  doc.text(`Fecha: ${formatRangoFechasDMY(fechaMin, fechaMax)}`, 14, 23);

  const body = requisicionesGeneradas.map(r => [
    r.folio,
    r.transportista,
    r.camion,
    r.destino,
    r.qqs,
    formatRD(r.tarifa),
    r.aplica ? '+5%' : '-5%',
    formatRD(sumDescargas(r.descargas)),
    formatRD(r.totalNeto),
  ]);

  doc.autoTable({
    startY: 28,
    head: [['Folio', 'Transportista', 'Camión', 'Destino', 'QQs', 'Tarifa RD$', 'Aplica', 'Descarga RD$', 'Total Neto RD$']],
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [26, 47, 75] },
  });

  const { montoFinal, elTotal, diferencia } = calcularResumen();
  let y = doc.lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Suma de Tarifas (Monto Final): RD$ ${formatRD(montoFinal)}`, 14, y); y += 7;
  doc.text(`Suma de Total Neto (El Total): RD$ ${formatRD(elTotal)}`, 14, y); y += 7;
  doc.text(`Diferencia (Total - Monto Final): RD$ ${formatRD(diferencia)}`, 14, y);
}

document.getElementById('btnDescargarExcel').addEventListener('click', () => {
  if (requisicionesGeneradas.length === 0) return;
  const data = requisicionesGeneradas.map(r => ({
    Folio: r.folio,
    Fecha: formatFechaDMY(r.fecha),
    Transportista: r.transportista,
    Contratista: r.contratista,
    Chofer: r.chofer,
    'Tipo de Camión': r.camion,
    Destino: r.destino,
    QQs: r.qqs,
    Categoria: CATEGORIAS[r.categoria] || '',
    'Zona Tarifario': r.zonaTarifario,
    'Tarifa RD$': r.tarifa,
    Aplica: r.aplica ? '+5%' : '-5%',
    'Descarga RD$': sumDescargas(r.descargas),
    'Descarga Detalle': (r.descargas || []).map(d => `${formatRD(d.monto)} - ${d.descripcion}`).join('; '),
    'Total Neto RD$': r.totalNeto,
    Observacion: r.observacion,
  }));
  const { montoFinal, elTotal, diferencia } = calcularResumen();
  data.push({});
  data.push({ Folio: 'Suma de Tarifas (Monto Final)', 'Tarifa RD$': montoFinal });
  data.push({ Folio: 'Suma de Total Neto (El Total)', 'Total Neto RD$': elTotal });
  data.push({ Folio: 'Diferencia (Total - Monto Final)', 'Total Neto RD$': diferencia });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Requisiciones');
  const fechaRef = requisicionesGeneradas[0].fecha;
  const fname = `Requisiciones_${fechaRef.getFullYear()}${String(fechaRef.getMonth() + 1).padStart(2, '0')}${String(fechaRef.getDate()).padStart(2, '0')}.xlsx`;
  XLSX.writeFile(wb, fname);
});

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

Object.keys(CATEGORIAS).forEach(cat => renderTarifarioTable(cat));
renderCamionMap();
renderAjustes();
