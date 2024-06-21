const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const demolishBtn = document.getElementById('demolish-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const logoffBtn = document.getElementById('logoff-btn');
const confirmLogoffBtn = document.getElementById('confirm-logoff-btn');
const cancelLogoffBtn = document.getElementById('cancel-logoff-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');
const profitEl = document.getElementById('profit');
const upkeepEl = document.getElementById('upkeep');
const popupOverlay = document.getElementById('popupOverlay');
const logoffOverlay = document.getElementById('logoffOverlay');

let coins = Infinity;
let score = 0;
let turn = 1;
let profit = 0;
let upkeep = 0;
let builtBuildings = 0;
let gridSize = 5;
const expansionSizes = [15, 25];
let currentExpansion = 0;
let availableBuildings = ['Residential', 'Industry', 'Commercial', 'Park', 'Road'];
let buildingImages = {
  'Residential': '../buildinggraphics/residential.png',
  'Industry': '../buildinggraphics/industry.png',
  'Commercial': '../buildinggraphics/commercial.png',
  'Park': '../buildinggraphics/park.png',
  'Road': '../buildinggraphics/road.png'
};
let selectedCells = [];
let existingCells = [];

function initializeGrid(size) {
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 50px)`;
  gridContainer.style.width = `${size * 50}px`;
  gridContainer.style.height = `${size * 50}px`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', () => selectCell(cell));
      gridContainer.appendChild(cell);
    }
  }
}

function selectCell(cell) {
  if (!selectedCells.includes(cell)) {
    if (selectedCells.length > 0) {
      selectedCells[0].classList.remove('selected');
    }
    selectedCells = [cell];
    cell.classList.add('selected');
  }
}

function expandGrid() {
  if (currentExpansion >= expansionSizes.length) return;
  const newSize = expansionSizes[currentExpansion];
  currentExpansion++;
  const oldCells = existingCells.slice();

  gridSize = newSize;
  initializeGrid(newSize);

  oldCells.forEach(({ x, y, type }) => {
    const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
    cell.classList.add(type, 'occupied');
    cell.innerHTML = `<img src="${buildingImages[type]}" alt="${type}">`;
    cell.querySelector('img').style.width = '100%';
    cell.querySelector('img').style.height = '100%';
  });
}

function showPopup() {
  const [option1, option2] = getRandomBuildings();
  document.getElementById('buildOption1').innerHTML = `<img src="${buildingImages[option1]}" alt="${option1}"> ${option1}`;
  document.getElementById('buildOption2').innerHTML = `<img src="${buildingImages[option2]}" alt="${option2}"> ${option2}`;
  popupOverlay.style.display = 'flex';

  document.getElementById('buildBtnOption1').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, option1);
    popupOverlay.style.display = 'none';
  };
  document.getElementById('buildBtnOption2').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, option2);
    popupOverlay.style.display = 'none';
  };
}

function placeBuilding(x, y, type) {
  if (coins <= 0) {
    alert('No more coins left to build.');
    return;
  }

  if (!isAdjacent(x, y) && builtBuildings > 0) {
    alert('Buildings must be placed next to existing buildings.');
    return;
  }

  const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
  cell.classList.add(type, 'occupied');
  cell.innerHTML = `<img src="${buildingImages[type]}" alt="${type}">`;
  cell.querySelector('img').style.width = '100%';
  cell.querySelector('img').style.height = '100%';
  existingCells.push({ x: parseInt(x), y: parseInt(y), type });

  coins--;
  turn++;
  builtBuildings++;
  calculateScore();
  calculateProfitAndUpkeep();
  updateInfo();

  if (x == 0 || y == 0 || x == gridSize - 1 || y == gridSize - 1) {
    expandGrid();
  }
}

function isAdjacent(x, y) {
  const adjacentCoords = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ];
  return adjacentCoords.some(({ dx, dy }) => {
    const nx = parseInt(x) + dx;
    const ny = parseInt(y) + dy;
    return document.querySelector(`.grid-cell[data-x='${nx}'][data-y='${ny}']`)?.classList.contains('occupied');
  });
}

function demolish() {
  if (coins <= 0) {
    alert('No more coins left to demolish.');
    return;
  }
  if (selectedCells.length > 0) {
    const cell = selectedCells[0];
    if (cell.classList.contains('occupied')) {
      cell.classList.remove('occupied');
      cell.className = 'grid-cell';
      cell.innerHTML = '';
      coins--;
      turn++;
      builtBuildings--;
      calculateScore();
      calculateProfitAndUpkeep();
      updateInfo();
      selectedCells = [];
    } else {
      alert('No building to demolish on this cell.');
    }
  }
}

function saveGame() {
  const saveData = {
    score, turn, builtBuildings, gridSize, existingCells, currentExpansion
  };
  localStorage.setItem('freePlaySave', JSON.stringify(saveData));
  alert('Game saved successfully!');
}

function loadGame() {
  const savedData = JSON.parse(localStorage.getItem('freePlaySave'));
  if (savedData) {
    ({ score, turn, builtBuildings, gridSize, existingCells, currentExpansion } = savedData);
    coins = Infinity;
    initializeGrid(gridSize);
    existingCells.forEach(({ x, y, type }) => {
      const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
      cell.classList.add(type, 'occupied');
      cell.innerHTML = `<img src="${buildingImages[type]}" alt="${type}">`;
      cell.querySelector('img').style.width = '100%';
      cell.querySelector('img').style.height = '100%';
    });
    updateInfo();
  } else {
    alert('No saved game found.');
  }
}

function showLogoffOverlay() {
  logoffOverlay.style.display = 'flex';
}

function hideLogoffOverlay() {
  logoffOverlay.style.display = 'none';
}

function logOff() {
  window.location.href = '../index.html';
}

function getRandomBuildings() {
  const randomIndex1 = Math.floor(Math.random() * availableBuildings.length);
  let randomIndex2 = Math.floor(Math.random() * availableBuildings.length);
  while (randomIndex1 === randomIndex2) {
    randomIndex2 = Math.floor(Math.random() * availableBuildings.length);
  }
  return [availableBuildings[randomIndex1], availableBuildings[randomIndex2]];
}

function calculateScore() {
  score = 0;
  const cells = document.querySelectorAll('.grid-cell.occupied');
  cells.forEach(cell => {
    const type = cell.classList[1];
    const { x, y } = cell.dataset;
    const adjacentBuildings = getAdjacentBuildings(x, y);
    switch (type) {
      case 'Residential':
        score += adjacentBuildings.filter(b => b === 'Industry').length > 0 ? 1 : adjacentBuildings.filter(b => b !== 'Industry').length * 2;
        break;
      case 'Industry':
        score += cells.length;
        break;
      case 'Commercial':
        score += adjacentBuildings.filter(b => b === 'Commercial').length;
        break;
      case 'Park':
        score += adjacentBuildings.filter(b => b === 'Park').length;
        break;
      case 'Road':
        score += document.querySelectorAll(`.grid-cell[data-y='${y}'].Road`).length;
        break;
    }
  });
}

function calculateProfitAndUpkeep() {
  profit = 0;
  upkeep = 0;
  const cells = document.querySelectorAll('.grid-cell.occupied');
  cells.forEach(cell => {
    const type = cell.classList[1];
    switch (type) {
      case 'Residential':
        profit += 1;
        upkeep += 1;
        break;
      case 'Industry':
        profit += 2;
        upkeep += 1;
        break;
      case 'Commercial':
        profit += 3;
        upkeep += 2;
        break;
      case 'Park':
        upkeep += 1;
        break;
      case 'Road':
        upkeep += 1;
        break;
    }
  });
}

function updateInfo() {
  coinsEl.textContent = coins === Infinity ? '∞' : coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
  profitEl.textContent = profit;
  upkeepEl.textContent = upkeep;
}

function getAdjacentBuildings(x, y) {
  const adjacentBuildings = [];
  const adjacentCoords = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ];
  adjacentCoords.forEach(({ dx, dy }) => {
    const nx = parseInt(x) + dx;
    const ny = parseInt(y) + dy;
    const adjacentCell = document.querySelector(`.grid-cell[data-x='${nx}'][data-y='${ny}']`);
    if (adjacentCell && adjacentCell.classList.contains('occupied')) {
      adjacentBuildings.push(adjacentCell.classList[1]);
    }
  });
  return adjacentBuildings;
}

document.addEventListener('DOMContentLoaded', () => {
  initializeGrid(gridSize);
  updateInfo();
});

buildBtn.addEventListener('click', () => {
  if (selectedCells.length !== 0) {
    showPopup();
  } else {
    alert('Please select a cell.');
  }
});

demolishBtn.addEventListener('click', demolish);
saveBtn.addEventListener('click', saveGame);
loadBtn.addEventListener('click', loadGame);
logoffBtn.addEventListener('click', showLogoffOverlay);
confirmLogoffBtn.addEventListener('click', logOff);
cancelLogoffBtn.addEventListener('click', hideLogoffOverlay);
