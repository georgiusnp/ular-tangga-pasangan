/**
 * ULAR TANGGA KARTU PASANGAN (COUPLE PLAY)
 * Game Logic, Board Rendering, SVG Snakes & Ladders, and Event Handlers
 */

// Konfigurasi Papan & Ular Tangga sesuai foto referensi
const BOARD_CONFIG = {
  totalTiles: 80,
  cols: 10,
  rows: 8,

  // Tangga (naik)
  ladders: {
    3: 18,
    15: 25,
    28: 35,
    41: 59,
    46: 55,
    65: 76
  },

  // Ular (turun)
  snakes: {
    22: 9,
    24: 16,
    44: 23,
    50: 32,
    63: 42,
    70: 51,
    73: 53
  },

  // Pemetaan Kotak Spesial (Instruksi 91 - 100)
  specialTiles: {
    1: { id: 91, title: "START", short: "Senyum & Do'a" },
    7: { id: 92, title: "SPESIAL", short: "Ucapkan I Love You" },
    12: { id: 96, title: "SPESIAL", short: "Kalimat Penyemangat" },
    30: { id: 93, title: "SPESIAL", short: "Pegang Erat Tangan" },
    38: { id: 97, title: "SPESIAL", short: "Tepuk Tangan & Pujian" },
    48: { id: 98, title: "SPESIAL", short: "Jabat Tangan Mesra" },
    56: { id: 99, title: "SPESIAL", short: "Elus Pipi Lembut" },
    60: { id: 94, title: "SPESIAL", short: "Tatap Mata 5 Detik" },
    68: { id: 100, title: "SPESIAL", short: "Ucapan Terima Kasih" },
    80: { id: 95, title: "FINISH", short: "Pelukan Pemenang" }
  },

  // Kotak Truth
  truthTiles: [5, 13, 20, 26, 31, 37, 43, 47, 55, 61, 67, 75],

  // Kotak Dare
  dareTiles: [2, 10, 17, 29, 33, 36, 39, 52, 58, 64, 69, 74, 78],

  // Kotak Deep Talk
  deepTiles: [4, 8, 14, 19, 27, 34, 45, 49, 54, 57, 62, 66, 71, 77, 79]
};

// State Game
const GameState = {
  players: [
    { id: 1, name: "Pasangan 1", avatar: "🤴", color: "#E91E63", position: 1, skipsUsed: 0 },
    { id: 2, name: "Pasangan 2", avatar: "👸", color: "#9C27B0", position: 1, skipsUsed: 0 }
  ],
  currentPlayerIndex: 0,
  isRolling: false,
  isMoving: false,
  turnCount: 1,
  diceRotX: 0,
  diceRotY: 0,
  roundRolls: {},          // Pencatat roll per pemain dalam putaran saat ini
  lastRollByPlayer: {},    // Roll terakhir per pemain untuk variasi antar ronde
  usedQuestions: {
    deeptalk: new Set(),
    truth: new Set(),
    dare: new Set(),
    special: new Set()
  },
  currentChallenge: null
};

// ==========================================
// INISIALISASI & PERSISTENSI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();
  loadSavedGame();
  renderBoard();
  renderSnakesAndLaddersSVG();
  updateUI();
  setupEventListeners();
  initQuestionBank();
});

// Load & Set Theme
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('couple_game_theme') || 'rose';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = savedTheme;
  }
}

function changeTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('couple_game_theme', themeName);
  renderSnakesAndLaddersSVG(); // Re-render warna SVG agar serasi dengan tema
}

// Simpan state game ke localStorage
function saveGameState() {
  const stateToSave = {
    players: GameState.players,
    currentPlayerIndex: GameState.currentPlayerIndex,
    turnCount: GameState.turnCount
  };
  localStorage.setItem('couple_game_state', JSON.stringify(stateToSave));
}

// Muat state game tersimpan
function loadSavedGame() {
  const saved = localStorage.getItem('couple_game_state');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.players && data.players.length >= 2) {
        GameState.players = data.players;
        GameState.currentPlayerIndex = data.currentPlayerIndex || 0;
        GameState.turnCount = data.turnCount || 1;
      }
    } catch (e) {
      console.warn("Gagal membaca save data", e);
    }
  }
}

// Reset Game
function resetGame(confirmed = false) {
  if (!confirmed && !confirm("Mulai permainan baru dari kotak 1? Semua posisi pion dan limit skip akan direset.")) {
    return;
  }
  GameState.players.forEach(p => {
    p.position = 1;
    p.skipsUsed = 0;
  });
  GameState.currentPlayerIndex = 0;
  GameState.turnCount = 1;
  GameState.diceRotX = 0;
  GameState.diceRotY = 0;
  GameState.roundRolls = {};
  GameState.lastRollByPlayer = {};
  GameState.usedQuestions = {
    deeptalk: new Set(),
    truth: new Set(),
    dare: new Set(),
    special: new Set()
  };
  saveGameState();
  updateUI();
  addLog("🔄 Permainan baru dimulai! Selamat bermain.");
}

// ==========================================
// KOORDINAT PAPAN & RENDER GRID
// ==========================================

/**
 * Menghitung koordinat baris (0-7 dari atas) dan kolom (0-9) untuk kotak nomor n (1-80)
 * Pola: Baris ganjil dari bawah jalan kiri-ke-kanan, baris genap jalan kanan-ke-kiri (serpentine)
 */
function getTileGridCoords(tileNum) {
  const n = tileNum - 1;
  const rowFromBottom = Math.floor(n / BOARD_CONFIG.cols); // 0 sampai 7
  const rowFromTop = (BOARD_CONFIG.rows - 1) - rowFromBottom; // 7 sampai 0
  
  let col;
  if (rowFromBottom % 2 === 0) {
    col = n % BOARD_CONFIG.cols; // kiri ke kanan
  } else {
    col = (BOARD_CONFIG.cols - 1) - (n % BOARD_CONFIG.cols); // kanan ke kiri
  }

  return { row: rowFromTop, col: col };
}

/**
 * Koordinat persentase titik tengah kotak (untuk pion dan SVG)
 */
function getTileCenterPercent(tileNum) {
  const { row, col } = getTileGridCoords(tileNum);
  const x = (col + 0.5) * (100 / BOARD_CONFIG.cols);
  const y = (row + 0.5) * (100 / BOARD_CONFIG.rows);
  return { x, y };
}

// Render 80 Kotak pada DOM
function renderBoard() {
  const gridContainer = document.getElementById('board-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  // Buat array 80 kotak yang terurut dari baris atas (80..71) ke bawah (1..10)
  for (let r = 0; r < BOARD_CONFIG.rows; r++) {
    const rowFromBottom = (BOARD_CONFIG.rows - 1) - r;
    for (let c = 0; c < BOARD_CONFIG.cols; c++) {
      let tileNum;
      if (rowFromBottom % 2 === 0) {
        tileNum = rowFromBottom * BOARD_CONFIG.cols + c + 1;
      } else {
        tileNum = rowFromBottom * BOARD_CONFIG.cols + (BOARD_CONFIG.cols - 1 - c) + 1;
      }

      const tileEl = createTileElement(tileNum);
      gridContainer.appendChild(tileEl);
    }
  }
}

function createTileElement(tileNum) {
  const div = document.createElement('div');
  div.className = `tile ${tileNum % 2 === 0 ? 'even' : 'odd'}`;
  div.id = `tile-${tileNum}`;
  div.dataset.tile = tileNum;

  // Nomor Kotak
  const numSpan = document.createElement('span');
  numSpan.className = 'tile-number';
  numSpan.textContent = tileNum;
  div.appendChild(numSpan);

  // Penanda Kotak & Tipe
  if (tileNum === 1) {
    div.classList.add('tile-start');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = 'START';
    div.appendChild(badge);

    const txt = document.createElement('div');
    txt.className = 'tile-special-text';
    txt.textContent = "Senyum & Do'a";
    div.appendChild(txt);
  } else if (tileNum === 80) {
    div.classList.add('tile-finish');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = 'FINISH';
    div.appendChild(badge);

    const txt = document.createElement('div');
    txt.className = 'tile-special-text';
    txt.textContent = 'Pemenang 🎉';
    div.appendChild(txt);
  } else if (BOARD_CONFIG.specialTiles[tileNum]) {
    div.classList.add('tile-special');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = BOARD_CONFIG.specialTiles[tileNum].title;
    div.appendChild(badge);

    const txt = document.createElement('div');
    txt.className = 'tile-special-text';
    txt.textContent = BOARD_CONFIG.specialTiles[tileNum].short;
    div.appendChild(txt);
  } else if (BOARD_CONFIG.truthTiles.includes(tileNum)) {
    div.classList.add('tile-truth');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = 'TRUTH';
    div.appendChild(badge);
  } else if (BOARD_CONFIG.dareTiles.includes(tileNum)) {
    div.classList.add('tile-dare');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = 'DARE';
    div.appendChild(badge);
  } else if (BOARD_CONFIG.deepTiles.includes(tileNum)) {
    div.classList.add('tile-deep');
    const badge = document.createElement('div');
    badge.className = 'tile-badge';
    badge.textContent = 'DEEP';
    div.appendChild(badge);
  }

  // Klik kotak untuk melihat detail / tantangannya jika penasaran
  div.addEventListener('click', () => {
    previewTileInfo(tileNum);
  });

  return div;
}

// ==========================================
// RENDER SVG ULAR & TANGGA
// ==========================================
function renderSnakesAndLaddersSVG() {
  const svg = document.getElementById('board-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const W = 1000;
  const H = 800;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // 1. Gambar Semua Tangga
  Object.entries(BOARD_CONFIG.ladders).forEach(([startStr, endNum]) => {
    const startNum = parseInt(startStr);
    const p1 = getTileCenterPercent(startNum);
    const p2 = getTileCenterPercent(endNum);

    const x1 = (p1.x / 100) * W;
    const y1 = (p1.y / 100) * H;
    const x2 = (p2.x / 100) * W;
    const y2 = (p2.y / 100) * H;

    drawLadder(svg, x1, y1, x2, y2);
  });

  // 2. Gambar Semua Ular
  let snakeIndex = 0;
  Object.entries(BOARD_CONFIG.snakes).forEach(([headStr, tailNum]) => {
    const headNum = parseInt(headStr);
    const p1 = getTileCenterPercent(headNum);
    const p2 = getTileCenterPercent(tailNum);

    const x1 = (p1.x / 100) * W;
    const y1 = (p1.y / 100) * H;
    const x2 = (p2.x / 100) * W;
    const y2 = (p2.y / 100) * H;

    // Selang-seling warna ular: hijau zamrud dan pink cerah seperti di foto
    const snakeColor = snakeIndex % 2 === 0 ? '#10B981' : '#EC4899';
    const bellyColor = snakeIndex % 2 === 0 ? '#A7F3D0' : '#FBCFE8';
    snakeIndex++;

    drawSnake(svg, x1, y1, x2, y2, snakeColor, bellyColor);
  });
}

/**
 * Menggambar Tangga Kayu Cantik dengan Dua Rel dan Anak Tangga
 */
function drawLadder(svg, x1, y1, x2, y2) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  // Vektor normal tegak lurus
  const nx = -uy;
  const ny = ux;
  const ladderWidth = 16;

  // Rail Kiri & Kanan
  const r1x1 = x1 + nx * (ladderWidth / 2);
  const r1y1 = y1 + ny * (ladderWidth / 2);
  const r1x2 = x2 + nx * (ladderWidth / 2);
  const r1y2 = y2 + ny * (ladderWidth / 2);

  const r2x1 = x1 - nx * (ladderWidth / 2);
  const r2y1 = y1 - ny * (ladderWidth / 2);
  const r2x2 = x2 - nx * (ladderWidth / 2);
  const r2y2 = y2 - ny * (ladderWidth / 2);

  // Gambar Rel
  const railStyle = "stroke: #8D5B4C; stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));";
  const rail1 = createSVGElement('line', { x1: r1x1, y1: r1y1, x2: r1x2, y2: r1y2, style: railStyle });
  const rail2 = createSVGElement('line', { x1: r2x1, y1: r2y1, x2: r2x2, y2: r2y2, style: railStyle });
  g.appendChild(rail1);
  g.appendChild(rail2);

  // Gambar Anak Tangga (Rungs)
  const rungSpacing = 22;
  const rungCount = Math.floor(len / rungSpacing);
  for (let i = 1; i < rungCount; i++) {
    const t = i / rungCount;
    const rungCenter1X = r1x1 + (r1x2 - r1x1) * t;
    const rungCenter1Y = r1y1 + (r1y2 - r1y1) * t;
    const rungCenter2X = r2x1 + (r2x2 - r2x1) * t;
    const rungCenter2Y = r2y1 + (r2y2 - r2y1) * t;

    const rung = createSVGElement('line', {
      x1: rungCenter1X, y1: rungCenter1Y,
      x2: rungCenter2X, y2: rungCenter2Y,
      style: "stroke: #FFB300; stroke-width: 3.5; stroke-linecap: round;"
    });
    g.appendChild(rung);
  }

  svg.appendChild(g);
}

/**
 * Menggambar Ular Bergelombang Cantik dengan Kepala & Lidah
 */
function drawSnake(svg, xHead, yHead, xTail, yTail, mainColor, bellyColor) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const dx = xTail - xHead;
  const dy = yTail - yHead;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / dist;
  const ny = dx / dist;

  // Dua kontrol poin bezier untuk membuat gelombang S yang luwes
  const waveAmp = Math.min(45, dist * 0.25);
  const cx1 = xHead + dx * 0.33 + nx * waveAmp;
  const cy1 = yHead + dy * 0.33 + ny * waveAmp;
  const cx2 = xHead + dx * 0.66 - nx * waveAmp;
  const cy2 = yHead + dy * 0.66 - ny * waveAmp;

  const pathData = `M ${xHead} ${yHead} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xTail} ${yTail}`;

  // Badan Ular (Shadow & Body)
  const bodyPath = createSVGElement('path', {
    d: pathData,
    fill: 'none',
    stroke: mainColor,
    'stroke-width': '14',
    'stroke-linecap': 'round',
    style: 'filter: drop-shadow(0 3px 6px rgba(0,0,0,0.28));'
  });
  g.appendChild(bodyPath);

  // Corak Perut / Garis Belang Ular
  const stripePath = createSVGElement('path', {
    d: pathData,
    fill: 'none',
    stroke: bellyColor,
    'stroke-width': '5',
    'stroke-dasharray': '7 8',
    'stroke-linecap': 'round'
  });
  g.appendChild(stripePath);

  // Kepala Ular di xHead, yHead
  const headCircle = createSVGElement('circle', {
    cx: xHead,
    cy: yHead,
    r: '12',
    fill: mainColor,
    stroke: '#FFFFFF',
    'stroke-width': '1.5',
    style: 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));'
  });
  g.appendChild(headCircle);

  // Mata Ular
  const eye1 = createSVGElement('circle', { cx: xHead - 4, cy: yHead - 3, r: '2.5', fill: '#FFFFFF' });
  const pupil1 = createSVGElement('circle', { cx: xHead - 4, cy: yHead - 3, r: '1.2', fill: '#000000' });
  const eye2 = createSVGElement('circle', { cx: xHead + 4, cy: yHead - 3, r: '2.5', fill: '#FFFFFF' });
  const pupil2 = createSVGElement('circle', { cx: xHead + 4, cy: yHead - 3, r: '1.2', fill: '#000000' });
  g.appendChild(eye1);
  g.appendChild(pupil1);
  g.appendChild(eye2);
  g.appendChild(pupil2);

  // Lidah Merah Kecil
  const tongue = createSVGElement('line', {
    x1: xHead,
    y1: yHead - 10,
    x2: xHead,
    y2: yHead - 18,
    stroke: '#FF1744',
    'stroke-width': '2',
    'stroke-linecap': 'round'
  });
  g.appendChild(tongue);

  svg.appendChild(g);
}

function createSVGElement(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

// ==========================================
// RENDER PION (PAWNS) & UPDATE UI
// ==========================================
function updateUI() {
  updateCurrentPlayerHeader();
  renderPawns();
  updatePlayersStatusList();
}

function updateCurrentPlayerHeader() {
  const current = GameState.players[GameState.currentPlayerIndex];
  const nameEl = document.getElementById('current-player-name');
  const avatarEl = document.getElementById('current-player-avatar');
  const posEl = document.getElementById('current-player-pos');

  if (nameEl) nameEl.textContent = current.name;
  if (avatarEl) {
    avatarEl.textContent = current.avatar;
    avatarEl.style.backgroundColor = current.color + '22';
    avatarEl.style.border = `2px solid ${current.color}`;
  }
  if (posEl) posEl.textContent = `Kotak ${current.position} / 80`;

  const rollBtn = document.getElementById('btn-roll-dice');
  const resultBadge = document.getElementById('dice-result-badge');

  if (!GameState.isRolling && !GameState.isMoving) {
    if (rollBtn) {
      rollBtn.disabled = false;
      rollBtn.innerHTML = `<span>🎲</span><span>LEMPAR DADU</span>`;
    }
    if (resultBadge && !resultBadge.classList.contains('highlight')) {
      resultBadge.innerHTML = `🎲 Giliran <strong>${current.name}</strong> • Siap lempar!`;
    }
  } else {
    if (rollBtn) rollBtn.disabled = true;
  }
}

function renderPawns() {
  const pawnsLayer = document.getElementById('pawns-layer');
  if (!pawnsLayer) return;
  pawnsLayer.innerHTML = '';

  // Kelompokkan pion berdasarkan kotak untuk penempatan rapi jika di kotak yang sama
  const tileGroups = {};
  GameState.players.forEach(p => {
    if (!tileGroups[p.position]) tileGroups[p.position] = [];
    tileGroups[p.position].push(p);
  });

  Object.entries(tileGroups).forEach(([tileNumStr, playersOnTile]) => {
    const tileNum = parseInt(tileNumStr);
    const center = getTileCenterPercent(tileNum);

    playersOnTile.forEach((p, idx) => {
      const pawnEl = document.createElement('div');
      pawnEl.className = `pawn ${GameState.players[GameState.currentPlayerIndex].id === p.id ? 'active' : ''}`;
      pawnEl.id = `pawn-player-${p.id}`;
      pawnEl.textContent = p.avatar;
      pawnEl.style.backgroundColor = p.color;

      // Geser offset jika ada lebih dari 1 pion di kotak yang sama
      let offsetX = 0;
      let offsetY = 0;
      if (playersOnTile.length > 1) {
        const offsetDist = 1.6; // persentase offset
        if (playersOnTile.length === 2) {
          offsetX = idx === 0 ? -offsetDist : offsetDist;
        } else {
          offsetX = (idx % 2 === 0 ? -1 : 1) * offsetDist;
          offsetY = (idx < 2 ? -1 : 1) * offsetDist;
        }
      }

      pawnEl.style.left = `${center.x + offsetX}%`;
      pawnEl.style.top = `${center.y + offsetY}%`;

      pawnEl.title = `${p.name} (Kotak ${p.position})`;
      pawnsLayer.appendChild(pawnEl);
    });
  });
}

function updatePlayersStatusList() {
  const list = document.getElementById('players-status-list');
  if (!list) return;
  list.innerHTML = '';

  GameState.players.forEach((p, idx) => {
    const isCurrent = idx === GameState.currentPlayerIndex;
    const row = document.createElement('div');
    row.className = `player-row ${isCurrent ? 'active' : ''}`;

    const left = document.createElement('div');
    left.className = 'player-row-left';

    const av = document.createElement('div');
    av.className = 'player-row-avatar';
    av.textContent = p.avatar;
    av.style.backgroundColor = p.color + '22';
    av.style.border = `2px solid ${p.color}`;

    const name = document.createElement('div');
    name.className = 'player-row-name';
    name.textContent = p.name;
    if (isCurrent) {
      name.innerHTML += ' <span style="font-size:0.75rem; color:var(--accent-pink); font-weight:800;">(Giliran)</span>';
    }

    left.appendChild(av);
    left.appendChild(name);

    const right = document.createElement('div');
    right.className = 'player-row-right';

    const pos = document.createElement('div');
    pos.className = 'player-row-pos';
    pos.textContent = `Kotak ${p.position}`;

    const skips = document.createElement('div');
    skips.className = 'player-row-skips';
    skips.textContent = `Skip: ${p.skipsUsed}/2`;

    right.appendChild(pos);
    right.appendChild(skips);

    row.appendChild(left);
    row.appendChild(right);
    list.appendChild(row);
  });
}

function addLog(message) {
  const logBox = document.getElementById('game-log');
  if (!logBox) return;

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span style="opacity:0.6; font-size:0.7rem;">[R${GameState.turnCount}]</span> ${message}`;
  logBox.prepend(entry);
}

// ==========================================
// LOGIKA LEMPAR DADU & PERGERAKAN PION
// ==========================================

const DICE_FACE_ANGLES = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: 0, y: -180 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 }
};

/**
 * Generator angka dadu ber-entropi tinggi (Hardware Crypto API)
 * DENGAN JAMINAN VARIASI:
 * 1. Pemain 2 TIDAK AKAN menduplikasi angka Pemain 1 dalam ronde/turn yang sama!
 * 2. Menghindari angka kembar berturut-turut dari putaran sebelumnya untuk pemain yang sama.
 */
function generateDiceValue(playerIndex) {
  function getRawCryptoDice() {
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      return (buf[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  let roll = getRawCryptoDice();

  // Dapatkan angka dadu yang sudah keluar oleh pasangan lain dalam putaran ini
  const partnerRollsInRound = Object.entries(GameState.roundRolls)
    .filter(([idxStr, _]) => parseInt(idxStr) !== playerIndex)
    .map(([_, rVal]) => rVal);

  // JIKA angka sama dengan pasangan di ronde ini, GANTI dengan angka lain yang masih tersedia!
  if (partnerRollsInRound.includes(roll)) {
    const available = [1, 2, 3, 4, 5, 6].filter(n => !partnerRollsInRound.includes(n));
    if (available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      roll = available[idx];
    }
  }

  // Jika angka sama persis dengan lemparan terakhir pemain ini di turn sebelumnya, variasikan
  if (GameState.lastRollByPlayer[playerIndex] === roll) {
    const diffAvailable = [1, 2, 3, 4, 5, 6].filter(n => 
      n !== GameState.lastRollByPlayer[playerIndex] && !partnerRollsInRound.includes(n)
    );
    if (diffAvailable.length > 0) {
      roll = diffAvailable[Math.floor(Math.random() * diffAvailable.length)];
    }
  }

  // Catat hasil lemparan
  GameState.roundRolls[playerIndex] = roll;
  GameState.lastRollByPlayer[playerIndex] = roll;

  return roll;
}

async function rollDice() {
  if (GameState.isRolling || GameState.isMoving) return;

  GameState.isRolling = true;

  const diceCube = document.getElementById('dice-cube');
  const rollBtn = document.getElementById('btn-roll-dice');
  const resultBadge = document.getElementById('dice-result-badge');
  const currentPlayer = GameState.players[GameState.currentPlayerIndex];

  if (rollBtn) {
    rollBtn.disabled = true;
    rollBtn.innerHTML = `<span>🎲</span><span>Mengocok...</span>`;
  }

  if (resultBadge) {
    resultBadge.classList.remove('highlight');
    resultBadge.innerHTML = `🎲 <em>${currentPlayer.name} sedang mengocok dadu...</em>`;
  }

  // Mainkan efek suara kocok dadu
  SoundEngine.playDiceRoll();

  // Dapatkan angka dadu yang adil, dinamis, dan terjamin berbeda antar pemain
  const diceValue = generateDiceValue(GameState.currentPlayerIndex);

  // Putar kubus 3D secara fisik dengan orientasi tepat
  applyDiceRotation(diceValue);

  // Tunggu sejenak hingga animasi putaran mendarat dengan mulus (800ms)
  await new Promise(r => setTimeout(r, 800));

  // Tampilkan hasil secara visual di badge dan tombol
  if (resultBadge) {
    resultBadge.innerHTML = `🎲 <strong>${currentPlayer.name}</strong> dapat angka <span style="font-size:1.3rem; color:var(--accent-pink);">${diceValue}</span>!`;
    resultBadge.classList.add('highlight');
  }

  if (rollBtn) {
    rollBtn.innerHTML = `<span>🎲</span><span>Dadu: ${diceValue} (Maju ${diceValue})</span>`;
  }

  addLog(`🎲 <strong>${currentPlayer.name}</strong> melempar dadu: <strong>${diceValue}</strong>`);

  // Gerakkan pion langkah-demi-langkah
  await movePawnStepByStep(currentPlayer, diceValue);
  GameState.isRolling = false;
}

function applyDiceRotation(value) {
  const diceCube = document.getElementById('dice-cube');
  if (!diceCube) return;

  const targetFace = DICE_FACE_ANGLES[value] || DICE_FACE_ANGLES[1];

  // Tambahkan 720 atau 1080 derajat agar dadu selalu berputar dinamis di udara
  GameState.diceRotX += 720;
  GameState.diceRotY += 720;

  const targetX = Math.round(GameState.diceRotX / 360) * 360 + targetFace.x;
  const targetY = Math.round(GameState.diceRotY / 360) * 360 + targetFace.y;

  diceCube.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg)`;
}

/**
 * Menggerakkan pion satu kotak demi satu kotak secara halus (Smooth Hop)
 */
async function movePawnStepByStep(player, steps) {
  GameState.isMoving = true;
  updateUI();

  let targetPos = player.position + steps;
  // Jika melebihi 80, pantul mundur sesuai aturan ular tangga klasik
  if (targetPos > BOARD_CONFIG.totalTiles) {
    const overshoot = targetPos - BOARD_CONFIG.totalTiles;
    targetPos = BOARD_CONFIG.totalTiles - overshoot;
  }

  const isGoingForward = targetPos >= player.position;

  while (player.position !== targetPos) {
    if (isGoingForward) {
      player.position++;
    } else {
      player.position--;
    }

    SoundEngine.playPawnHop();
    renderPawns();
    updateCurrentPlayerHeader();
    await new Promise(r => setTimeout(r, 260));
  }

  GameState.isMoving = false;
  saveGameState();

  // Evaluasi kotak tempat pion berhenti
  await handleTileLanding(player);
}

/**
 * Evaluasi efek kotak tempat pion berhenti:
 * - Kemenangan (Kotak 80)
 * - Tangga (Naik)
 * - Ular (Turun)
 * - Tantangan (Truth, Dare, Deep Talk, Kotak Spesial)
 */
async function handleTileLanding(player) {
  const currentPos = player.position;

  // 1. Kotak FINISH / 80
  if (currentPos === BOARD_CONFIG.totalTiles) {
    handleVictory(player);
    return;
  }

  // 2. Kotak Tangga (Naik)
  if (BOARD_CONFIG.ladders[currentPos]) {
    const endPos = BOARD_CONFIG.ladders[currentPos];
    addLog(`🪜 Hore! <strong>${player.name}</strong> menemukan TANGGA di kotak ${currentPos} naik ke kotak <strong>${endPos}</strong>!`);
    await new Promise(r => setTimeout(r, 450));
    SoundEngine.playLadder();
    player.position = endPos;
    renderPawns();
    updateUI();
    saveGameState();

    if (player.position === BOARD_CONFIG.totalTiles) {
      handleVictory(player);
      return;
    }
  }
  // 3. Kotak Ular (Turun)
  else if (BOARD_CONFIG.snakes[currentPos]) {
    const endPos = BOARD_CONFIG.snakes[currentPos];
    addLog(`🐍 Ups! <strong>${player.name}</strong> terpeleset ULAR di kotak ${currentPos} meluncur turun ke kotak <strong>${endPos}</strong>!`);
    await new Promise(r => setTimeout(r, 450));
    SoundEngine.playSnake();
    player.position = endPos;
    renderPawns();
    updateUI();
    saveGameState();
  }

  // 4. Cek jenis challenge di kotak final tempat mendarat
  const finalPos = player.position;
  let category = null;
  let specialData = null;

  if (BOARD_CONFIG.specialTiles[finalPos]) {
    category = 'special';
    specialData = ALL_QUESTIONS_MAP[BOARD_CONFIG.specialTiles[finalPos].id];
  } else if (BOARD_CONFIG.truthTiles.includes(finalPos)) {
    category = 'truth';
  } else if (BOARD_CONFIG.dareTiles.includes(finalPos)) {
    category = 'dare';
  } else if (BOARD_CONFIG.deepTiles.includes(finalPos)) {
    category = 'deeptalk';
  }

  if (category) {
    await new Promise(r => setTimeout(r, 350));
    openChallengeCardModal(player, category, specialData);
  } else {
    // Kotak biasa/aman tanpa kartu -> langsung ganti giliran
    advanceToNextPlayer();
  }
}

// ==========================================
// MODAL TANTANGAN & KARTU PERTANYAAN
// ==========================================
function openChallengeCardModal(player, category, specificItem = null) {
  let challengeItem = specificItem;

  if (!challengeItem) {
    challengeItem = getRandomQuestion(category);
  }

  GameState.currentChallenge = {
    player: player,
    category: category,
    item: challengeItem
  };

  SoundEngine.playCardFlip();

  const modal = document.getElementById('challenge-modal');
  const catBadge = document.getElementById('card-category-badge');
  const targetPlayer = document.getElementById('challenge-target-player');
  const textBox = document.getElementById('challenge-text-box');
  const skipBtn = document.getElementById('btn-skip-challenge');

  if (catBadge) {
    const catLabels = {
      deeptalk: '💬 DEEP TALK',
      truth: '🔍 TRUTH',
      dare: '🎭 DARE',
      special: '✨ KOTAK SPESIAL'
    };
    catBadge.textContent = catLabels[category] || 'TANTANGAN';
    catBadge.className = `card-category-badge tag-${category === 'deeptalk' ? 'deep' : category}`;
  }

  if (targetPlayer) {
    targetPlayer.innerHTML = `Giliran untuk: <strong>${player.name}</strong> ${player.avatar}`;
  }

  if (textBox) {
    textBox.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem; display:block; margin-bottom:6px;">No. ${challengeItem.id}</span> "${challengeItem.text}"`;
  }

  if (skipBtn) {
    const remainingSkips = 2 - player.skipsUsed;
    skipBtn.textContent = `⏭️ Lewati (${remainingSkips}/2)`;
    skipBtn.disabled = remainingSkips <= 0;
  }

  if (modal) modal.classList.add('open');
}

function getRandomQuestion(category) {
  const list = GAME_QUESTIONS[category] || [];
  if (list.length === 0) return { id: 0, text: "Beri pelukan hangat untuk pasanganmu!" };

  // Cari yang belum pernah muncul
  let unused = list.filter(q => !GameState.usedQuestions[category].has(q.id));
  if (unused.length === 0) {
    // Jika semua sudah terpakai, reset set
    GameState.usedQuestions[category].clear();
    unused = list;
  }

  const chosen = unused[Math.floor(Math.random() * unused.length)];
  GameState.usedQuestions[category].add(chosen.id);
  return chosen;
}

function completeChallenge() {
  if (!GameState.currentChallenge) return;
  const { player, category, item } = GameState.currentChallenge;
  addLog(`✅ <strong>${player.name}</strong> menyelesaikan [${category.toUpperCase()} #${item.id}]`);
  closeChallengeModal(false);
  advanceToNextPlayer();
}

function rerollChallenge() {
  if (!GameState.currentChallenge) return;
  const { player, category } = GameState.currentChallenge;
  const newItem = getRandomQuestion(category);
  GameState.currentChallenge.item = newItem;

  SoundEngine.playCardFlip();

  const textBox = document.getElementById('challenge-text-box');
  if (textBox) {
    textBox.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem; display:block; margin-bottom:6px;">No. ${newItem.id}</span> "${newItem.text}"`;
  }
}

function skipChallenge() {
  if (!GameState.currentChallenge) return;
  const { player } = GameState.currentChallenge;

  if (player.skipsUsed >= 2) {
    alert(`${player.name} sudah menggunakan batas maksimal 2 kali skip challenge sesuai peraturan!`);
    return;
  }

  player.skipsUsed++;
  addLog(`⏭️ <strong>${player.name}</strong> menggunakan jatah skip challenge (${player.skipsUsed}/2)`);
  closeChallengeModal(false);
  advanceToNextPlayer();
}

function closeChallengeModal(shouldAdvance = true) {
  const modal = document.getElementById('challenge-modal');
  if (modal) modal.classList.remove('open');
  if (shouldAdvance && GameState.currentChallenge) {
    const { player, category, item } = GameState.currentChallenge;
    addLog(`✅ <strong>${player.name}</strong> menutup kartu [${category.toUpperCase()} #${item.id}]`);
    GameState.currentChallenge = null;
    advanceToNextPlayer();
  } else {
    GameState.currentChallenge = null;
  }
}

function advanceToNextPlayer() {
  GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
  if (GameState.currentPlayerIndex === 0) {
    GameState.turnCount++;
    GameState.roundRolls = {}; // Reset roll history ronde ini agar putaran baru segar kembali
  }
  saveGameState();
  updateUI();
}

// ==========================================
// CELEBRATION & VICTORY
// ==========================================
function handleVictory(winner) {
  SoundEngine.playVictory();
  ConfettiCelebration.launch(150);

  addLog(`🏆 <strong>SELAMAT! ${winner.name}</strong> mencapai kotak 80 dan menjadi pemenang!`);

  const modal = document.getElementById('victory-modal');
  const title = document.getElementById('victory-winner-name');
  const desc = document.getElementById('victory-winner-desc');

  if (title) title.textContent = `${winner.name} ${winner.avatar}`;
  if (desc) {
    desc.innerHTML = `Sesuai Instruksi Kotak 80: <em>"Beri ucapan selamat dan pelukan hangat kepada pemenang permainan!"</em> ❤️`;
  }

  if (modal) modal.classList.add('open');
}

function closeVictoryModal() {
  const modal = document.getElementById('victory-modal');
  if (modal) modal.classList.remove('open');
  ConfettiCelebration.stop();
}

// ==========================================
// QUICK DRAW CARDS (MODE TANPA PAPAN)
// ==========================================
function quickDrawCard(category) {
  SoundEngine.playCardFlip();
  const current = GameState.players[GameState.currentPlayerIndex];
  const item = getRandomQuestion(category);

  openChallengeCardModal(current, category, item);
}

// Preview tile saat diklik di papan
function previewTileInfo(tileNum) {
  let info = `Kotak nomor ${tileNum}`;
  if (tileNum === 1) info = `Kotak 1 [START]: Mulai dengan senyuman hangat & do'a.`;
  else if (tileNum === 80) info = `Kotak 80 [FINISH]: Berikan ucapan selamat & pelukan hangat kepada pemenang!`;
  else if (BOARD_CONFIG.specialTiles[tileNum]) info = `Kotak ${tileNum} [KOTAK SPESIAL]: ${ALL_QUESTIONS_MAP[BOARD_CONFIG.specialTiles[tileNum].id].text}`;
  else if (BOARD_CONFIG.ladders[tileNum]) info = `Kotak ${tileNum} [TANGGA]: Naik ke kotak ${BOARD_CONFIG.ladders[tileNum]}!`;
  else if (BOARD_CONFIG.snakes[tileNum]) info = `Kotak ${tileNum} [ULAR]: Meluncur turun ke kotak ${BOARD_CONFIG.snakes[tileNum]}!`;
  else if (BOARD_CONFIG.truthTiles.includes(tileNum)) info = `Kotak ${tileNum} [TRUTH]: Menjawab pertanyaan jujur tanpa bohong.`;
  else if (BOARD_CONFIG.dareTiles.includes(tileNum)) info = `Kotak ${tileNum} [DARE]: Melakukan tantangan romantis.`;
  else if (BOARD_CONFIG.deepTiles.includes(tileNum)) info = `Kotak ${tileNum} [DEEP TALK]: Menjawab pertanyaan mendalam tentang hubungan.`;
  
  addLog(`ℹ️ ${info}`);
}

// ==========================================
// PENGATURAN PEMAIN (SETTINGS MODAL)
// ==========================================
function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const p1Name = document.getElementById('input-p1-name');
  const p2Name = document.getElementById('input-p2-name');

  if (p1Name) p1Name.value = GameState.players[0].name;
  if (p2Name) p2Name.value = GameState.players[1].name;

  if (modal) modal.classList.add('open');
}

function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.remove('open');
}

function saveSettings() {
  const p1Name = document.getElementById('input-p1-name');
  const p2Name = document.getElementById('input-p2-name');
  const p1Avatar = document.querySelector('input[name="p1-avatar"]:checked');
  const p2Avatar = document.querySelector('input[name="p2-avatar"]:checked');

  if (p1Name && p1Name.value.trim()) GameState.players[0].name = p1Name.value.trim();
  if (p2Name && p2Name.value.trim()) GameState.players[1].name = p2Name.value.trim();
  if (p1Avatar) GameState.players[0].avatar = p1Avatar.value;
  if (p2Avatar) GameState.players[1].avatar = p2Avatar.value;

  saveGameState();
  updateUI();
  closeSettingsModal();
  addLog("⚙️ Nama dan avatar pemain berhasil diperbarui!");
}

// ==========================================
// BANK PERTANYAAN & ATURAN MAIN MODAL
// ==========================================
function openRulesModal() {
  const modal = document.getElementById('rules-modal');
  if (modal) modal.classList.add('open');
}

function closeRulesModal() {
  const modal = document.getElementById('rules-modal');
  if (modal) modal.classList.remove('open');
}

function openQuestionBankModal() {
  const modal = document.getElementById('qbank-modal');
  if (modal) modal.classList.add('open');
  showQuestionBankTab('deeptalk');
}

function closeQuestionBankModal() {
  const modal = document.getElementById('qbank-modal');
  if (modal) modal.classList.remove('open');
}

function initQuestionBank() {
  // Setup tabs
  document.querySelectorAll('.qbank-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.qbank-tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      showQuestionBankTab(e.target.dataset.cat);
    });
  });
}

function showQuestionBankTab(category) {
  const listContainer = document.getElementById('qbank-items-list');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const items = GAME_QUESTIONS[category] || [];
  items.forEach(q => {
    const itemEl = document.createElement('div');
    itemEl.className = 'qbank-item';
    itemEl.innerHTML = `<strong>#${q.id}</strong>. ${q.text}`;
    listContainer.appendChild(itemEl);
  });
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  // Tombol Lempar Dadu
  const rollBtn = document.getElementById('btn-roll-dice');
  if (rollBtn) rollBtn.addEventListener('click', rollDice);

  // Tombol Dadu langsung klik di kubus
  const diceCube = document.getElementById('dice-cube');
  if (diceCube) diceCube.addEventListener('click', rollDice);

  // Tombol Quick Draw Cards
  document.querySelectorAll('.btn-quick-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.dataset.category;
      quickDrawCard(cat);
    });
  });

  // Tombol Mute / Unmute
  const muteBtn = document.getElementById('btn-toggle-sound');
  if (muteBtn) {
    updateMuteButtonText();
    muteBtn.addEventListener('click', () => {
      SoundEngine.toggleMute();
      updateMuteButtonText();
    });
  }

  // Ganti Tema
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      changeTheme(e.target.value);
    });
  }

  // Tombol Aturan & Pengaturan
  document.getElementById('btn-open-rules')?.addEventListener('click', openRulesModal);
  document.getElementById('btn-open-settings')?.addEventListener('click', openSettingsModal);
  document.getElementById('btn-open-qbank')?.addEventListener('click', openQuestionBankModal);
  document.getElementById('btn-reset-game')?.addEventListener('click', () => resetGame(false));

  // Tombol Aksi di Modal Tantangan
  document.getElementById('btn-complete-challenge')?.addEventListener('click', completeChallenge);
  document.getElementById('btn-reroll-challenge')?.addEventListener('click', rerollChallenge);
  document.getElementById('btn-skip-challenge')?.addEventListener('click', skipChallenge);

  // Close modals
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      closeChallengeModal();
      closeRulesModal();
      closeSettingsModal();
      closeQuestionBankModal();
      closeVictoryModal();
    });
  });

  // Save Settings Form
  document.getElementById('btn-save-settings')?.addEventListener('click', saveSettings);

  // Resize window -> sesuaikan SVG
  window.addEventListener('resize', () => {
    renderSnakesAndLaddersSVG();
    renderPawns();
  });
}

function updateMuteButtonText() {
  const muteBtn = document.getElementById('btn-toggle-sound');
  if (muteBtn) {
    muteBtn.innerHTML = SoundEngine.isMuted() ? '🔇 Suara Off' : '🔊 Suara On';
  }
}
