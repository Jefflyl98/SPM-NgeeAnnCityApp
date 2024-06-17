let coins = Infinity; // Infinite coins for free play
let score = 0;
let turn = 1;
let builtBuildings = 0;
let currentBuilding = null;
let availableBuildings = ['Residential', 'Industry', 'Commercial', 'Park', 'Road'];
let buildingImages = {
  'Residential': '../buildinggraphics/residential.png',
  'Industry': '../buildinggraphics/industry.png',
  'Commercial': '../buildinggraphics/commercial.png',
  'Park': '../buildinggraphics/park.png',
  'Road': '../buildinggraphics/road.png'
};
let selectedCells = [];
let gridSize = 5; // Initial grid size
let existingCells = []; // Array to store existing cells on the grid

const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const demolishBtn = document.getElementById('demolish-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');
const popupOverlay = document.getElementById('popupOverlay');
const saveBtn = document.getElementById('save-btn');

// Generate grid based on saved or default size
function initializeGrid(size) {
  gridContainer.innerHTML = ''; // Clear existing grid
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 50px)`;

  existingCells = []; // Reset existing cells array

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.textContent = ' ';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.classList.add('grid-cell');
      cell.addEventListener('click', () => {
        if (!selectedCells.includes(cell)) {
          if (selectedCells.length > 0) {
            selectedCells[0].style.background = '';
          }
          selectedCells = [cell];
          cell.style.background = 'red';
        }
      });
      gridContainer.appendChild(cell);
      existingCells.push({ x, y });
    }
  }
}

// Add event listeners for buttons
buildBtn.addEventListener('click', () => {
  if (selectedCells.length !== 0) {
    const x = selectedCells[0].dataset.x;
    const y = selectedCells[0].dataset.y;
    if (builtBuildings > 0 && !isAdjacent(x, y)) {
      alert('You must build adjacent to an existing building.');
      return;
    }
    selectedCells[0].style.background = '';
    showPopup();
  } else {
    alert('Invalid cell.');
  }
});

demolishBtn.addEventListener('click', demolish);

leaderboardBtn.addEventListener('click', () => {
  alert('To be implemented: Leaderboard feature');
});

helpBtn.addEventListener('click', () => {
  alert('To be implemented: Help feature');
});

saveBtn.addEventListener('click', saveGame);

function showPopup() {
  const randomBuildings = getRandomBuildings();
  document.getElementById('buildOption1').innerHTML = `<img src="${buildingImages[randomBuildings[0]]}" alt="${randomBuildings[0]}"> ${randomBuildings[0]}`;
  document.getElementById('buildOption2').innerHTML = `<img src="${buildingImages[randomBuildings[1]]}" alt="${randomBuildings[1]}"> ${randomBuildings[1]}`;
  popupOverlay.style.display = 'flex';

  const buildBtn1 = document.getElementById('buildBtnOption1');
  const buildBtn2 = document.getElementById('buildBtnOption2');

  buildBtn1.addEventListener('click', () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, randomBuildings[0]);
    popupOverlay.style.display = 'none';
    selectedCells = [];
  });

  buildBtn2.addEventListener('click', () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, randomBuildings[1]);
    popupOverlay.style.display = 'none';
    selectedCells = [];
  });
}

function demolish() {
  if (coins <= 0) {
    alert('No more coins left to demolish.');
    return;
  }
  if (selectedCells.length > 0) {
    const cell = selectedCells[0];
    cell.style.background = '';
    if (cell.classList.contains('occupied')) {
      cell.classList.remove('occupied');
      cell.classList.remove(cell.classList[1]);
      cell.innerHTML = '';
      coins--;
      turn++;
      builtBuildings--;
      calculateScore();
      upkeep();
      updateInfo();
      selectedCells = [];
    } else {
      alert('No building to demolish on this cell.');
    }
  }
}

function updateInfo() {
  coinsEl.textContent = coins === Infinity ? '∞' : coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
}

function getRandomBuildings() {
  let randomIndex1 = Math.floor(Math.random() * availableBuildings.length);
  let randomIndex2 = Math.floor(Math.random() * availableBuildings.length);
  while (randomIndex1 === randomIndex2) {
    randomIndex2 = Math.floor(Math.random() * availableBuildings.length);
  }
  return [availableBuildings[randomIndex1], availableBuildings[randomIndex2]];
}

function isAdjacent(x, y) {
  const adjacentCoords = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ];

  for (let { dx, dy } of adjacentCoords) {
    const nx = parseInt(x) + dx;
    const ny = parseInt(y) + dy;
    const adjacentCell = document.querySelector(`.grid-cell[data-x='${nx}'][data-y='${ny}']`);
    if (adjacentCell && adjacentCell.classList.contains('occupied')) {
      return true;
    }
  }
  return false;
}

function placeBuilding(x, y, buildingType) {
  if (coins <= 0) {
    alert('No more coins left to build.');
    return;
  }

  const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
  cell.classList.add(buildingType, 'occupied');
  cell.innerHTML = `<img src="${buildingImages[buildingType]}" alt="${buildingType}">`;

  coins--;
  turn++;
  builtBuildings++;
  calculateScore();
  upkeep();
  updateInfo();
}

function saveGame() {
  const saveData = {
    coins,
    score,
    turn,
    builtBuildings,
    selectedCells: selectedCells.map(cell => ({
      x: cell.dataset.x,
      y: cell.dataset.y
    })),
    gridSize,
    existingCells: existingCells.map(cell => ({
      x: cell.x,
      y: cell.y,
      buildingType: document.querySelector(`.grid-cell[data-x='${cell.x}'][data-y='${cell.y}']`).classList[1]
    }))
  };

  localStorage.setItem('saveDataFree', JSON.stringify(saveData));
  alert('Game saved successfully!');
  window.location.href = '../index.html';
}

function calculateScore() {
  score = 0;
  const cells = document.querySelectorAll('.grid-cell.occupied');
  const industryCount = document.querySelectorAll('.Industry').length;

  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const buildingType = cell.classList[1];

    switch (buildingType) {
      case 'Residential':
        let adjacentR = 0;
        let adjacentC = 0;
        let adjacentO = 0;
        let adjacentI = 0;
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Residential') adjacentR++;
          if (adj === 'Commercial') adjacentC++;
          if (adj === 'Park') adjacentO++;
          if (adj === 'Industry') adjacentI++;
        });

        if (adjacentI > 0) {
          score += 1; // Residential next to industry scores 1 point
        } else {
          score += adjacentR + adjacentC + 2 * adjacentO;
        }
        break;

      case 'Industry':
        // Score 1 point per industry in the city
        score += industryCount;
        break;

      case 'Commercial':
        // Score 1 point per adjacent residential building
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Residential') {
            score += 1;
          }
        });
        break;

      case 'Park':
        // Score 2 points per adjacent residential building
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Residential') {
            score += 2;
          }
        });
        break;

      case 'Road':
        // Score 1 point per connected road in the same row
        let connectedRoads = 0;
        for (let i = 0; i < gridSize; i++) {
          if (document.querySelector(`.grid-cell[data-x='${x}'][data-y='${i}']`).classList.contains('Road')) {
            connectedRoads++;
          }
        }
        score += connectedRoads;
        break;

      default:
        break;
    }
  });

  scoreEl.textContent = score;
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

function upkeep() {
  const cells = document.querySelectorAll('.grid-cell.occupied');
  const industryCount = document.querySelectorAll('.Industry').length;

  cells.forEach(cell => {
    const buildingType = cell.classList[1];

    switch (buildingType) {
      case 'Residential':
        // Residential buildings cost 1 coin per turn in upkeep
        coins -= 1;
        break;

      case 'Industry':
        // Industry buildings generate 2 coins per turn
        coins += 2;
        break;

      case 'Commercial':
        // Commercial buildings generate 1 coin per adjacent residential building
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const adjacentResidentialCount = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += adjacentResidentialCount;
        break;

      case 'Park':
        // Parks generate 1 coin per 2 adjacent residential buildings
        const parkAdjacency = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += Math.floor(parkAdjacency / 2);
        break;

      case 'Road':
        // Road segments cost 1 coin per turn
        coins -= 1;
        break;

      default:
        break;
    }
  });

  coinsEl.textContent = coins;
}

// Initialize the grid on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeGrid(gridSize);
});

// Ensure the initial game state is displayed
updateInfo();
