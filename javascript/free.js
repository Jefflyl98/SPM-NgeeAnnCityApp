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
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

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

function expandGrid() {
  const expansionSizes = [30, 35]; // Example expansion sizes
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



function selectCell(cell) {
  if (!selectedCells.includes(cell)) {
    if (selectedCells.length > 0) {
      selectedCells[0].classList.remove('selected');
    }
    selectedCells = [cell];
    cell.classList.add('selected');
  }
}

function showPopup() {
  popupOverlay.style.display = 'flex';

  document.getElementById('buildResidentialBtn').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, 'Residential');
    popupOverlay.style.display = 'none';
  };
  document.getElementById('buildIndustryBtn').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, 'Industry');
    popupOverlay.style.display = 'none';
  };
  document.getElementById('buildCommercialBtn').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, 'Commercial');
    popupOverlay.style.display = 'none';
  };
  document.getElementById('buildParkBtn').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, 'Park');
    popupOverlay.style.display = 'none';
  };
  document.getElementById('buildRoadBtn').onclick = () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, 'Road');
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

document.getElementById('save-btn').addEventListener('click', () => {
  const saveData = {
    mode: 'freePlay',  // or 'arcade', depending on the current mode
    coins,
    score,
    turn,
    grid: document.querySelector('.grid-container').innerHTML
  };
  console.log('Save Data:', saveData);  // Debugging line to check save data
  const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'game-save.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


document.getElementById('load-btn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          console.log('Loaded Data:', saveData);  // Debugging line to check loaded data

          // Check the game mode
          if (saveData.mode === 'arcade') {
            // Restore game state for arcade mode
            coins = saveData.coins;
          } else if (saveData.mode === 'freePlay') {
            // Set coins to infinite for free play mode
            coins = Infinity;
          } else {
            alert('Unknown game mode in the save file.');
            return;
          }

          // Restore common game state variables
          score = saveData.score;
          turn = saveData.turn;

          // Replace the grid HTML with the saved grid
          document.querySelector('.grid-container').innerHTML = saveData.grid;

          // Re-attach event listeners to the grid cells
          const gridCells = document.querySelectorAll('.grid-cell');
          gridCells.forEach(cell => {
            cell.addEventListener('click', () => {
              if (!selectedCells.includes(cell)) {
                if (selectedCells.length > 0) {
                  selectedCells[0].style.background = '';
                }
                selectedCells = [cell];
                cell.style.background = 'red';
              }
            });
          });

          // Update the game information display
          updateInfo();
          console.log('Game loaded successfully!');
        } catch (error) {
          console.error('Error parsing the save file:', error);
          alert('Failed to load the game. The save file may be corrupted.');
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error);
        alert('Failed to read the file. Please try again.');
      };

      reader.readAsText(file);
    } else {
      alert('No file selected.');
    }
  });

  input.click();
});

function updateInfo() {
  coinsEl.textContent = coins === Infinity ? '∞' : coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
  upkeepEl.textContent = upkeep;
  if (coins <= 0 || builtBuildings === 400) {
    end();
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
