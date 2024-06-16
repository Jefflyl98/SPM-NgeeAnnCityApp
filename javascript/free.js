const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const demolishBtn = document.getElementById('demolish-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');
const popupOverlay = document.getElementById('popupOverlay');

let coins = Infinity;  // Unlimited coins for Free Play mode
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
let gridSize = 5;  // Start with a 5x5 grid
let existingCells = []; // Store existing cells

initializeGrid(gridSize);

// Update display
updateInfo();

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
saveBtn.addEventListener('click', saveGameState);
loadBtn.addEventListener('click', loadGameState);

function initializeGrid(size) {
  existingCells = Array.from(document.querySelectorAll('.grid-cell')).map(cell => ({
    x: parseInt(cell.dataset.x),
    y: parseInt(cell.dataset.y),
    classes: cell.className,
    content: cell.innerHTML
  }));

  const offset = (size - 5) / 2;
  gridContainer.innerHTML = '';  // Clear the grid
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 30px)`;

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

      // Restore existing buildings
      const existingCell = existingCells.find(c => c.x === x - offset && c.y === y - offset);
      if (existingCell) {
        cell.className = existingCell.classes;
        cell.innerHTML = existingCell.content;
      }

      gridContainer.appendChild(cell);
    }
  }
}

function showPopup() {
  const randomBuildings = getRandomBuildings();
  document.getElementById('buildOption1').innerHTML = `<img src="${buildingImages[randomBuildings[0]]}" alt="${randomBuildings[0]}"> ${randomBuildings[0]}`;
  document.getElementById('buildOption2').innerHTML = `<img src="${buildingImages[randomBuildings[1]]}" alt="${randomBuildings[1]}"> ${randomBuildings[1]}`;
  popupOverlay.style.display = 'flex';

  const buildBtn1 = document.getElementById('buildBtnOption1');
  const buildBtn2 = document.getElementById('buildBtnOption2');
  const controller = new AbortController();
  
  buildBtn1.addEventListener('click', () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, randomBuildings[0]);
    popupOverlay.style.display = 'none';
    selectedCells = [];
    controller.abort();
  }, { signal: controller.signal });

  buildBtn2.addEventListener('click', () => {
    placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, randomBuildings[1]);
    popupOverlay.style.display = 'none';
    selectedCells = [];
    controller.abort();
  }, { signal: controller.signal });
}

function demolish() {
  if (selectedCells.length > 0) {
    const cell = selectedCells[0];
    cell.style.background = '';
    if (cell.classList.contains('occupied')) {
      cell.classList.remove('occupied');
      cell.classList.remove(cell.classList[1]);
      cell.innerHTML = '';
      turn++;
      builtBuildings--;
      calculateScore();
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
  if (builtBuildings === gridSize * gridSize) {
    expandGrid();
  }
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
  const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
  cell.classList.add(buildingType, 'occupied');
  cell.innerHTML = `<img src="${buildingImages[buildingType]}" alt="${buildingType}">`;

  turn++;
  builtBuildings++;
  calculateScore();
  updateInfo();
  if (x == 0 || y == 0 || x == gridSize - 1 || y == gridSize - 1) {
    expandGrid();
  }
}

function expandGrid() {
  gridSize += 10; // Expand by 10 rows and columns
  initializeGrid(gridSize);
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
        score += industryCount;
        const adjacentResidentialI = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += adjacentResidentialI;
        break;

      case 'Commercial':
        let adjacentCommercial = 0;
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Commercial') adjacentCommercial++;
        });
        score += adjacentCommercial;
        const adjacentResidentialC = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += adjacentResidentialC;
        break;

      case 'Park':
        let adjacentPark = 0;
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Park') adjacentPark++;
        });
        score += adjacentPark;
        break;

      case 'Road':
        let connectedRoads = 0;
        for (let i = 0; i < gridSize; i++) {
          if (document.querySelector(`.grid-cell[data-x='${x}'][data-y='${i}']`).classList.contains('Road')) {
            connectedRoads++;
          }
        }
        score += connectedRoads;
        break;
    }
  });
  scoreEl.textContent = score;
}

function getAdjacentBuildings(x, y) {
  const adjacentCoords = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }
  ];

  return adjacentCoords.map(({ dx, dy }) => {
    const nx = x + dx;
    const ny = y + dy;
    const adjacentCell = document.querySelector(`.grid-cell[data-x='${nx}'][data-y='${ny}']`);
    return adjacentCell ? adjacentCell.classList[1] : null;
  }).filter(Boolean);
}

function saveGameState() {
  const gameState = {
    coins,
    score,
    turn,
    builtBuildings,
    gridSize,
    existingCells: Array.from(document.querySelectorAll('.grid-cell')).map(cell => ({
      x: parseInt(cell.dataset.x),
      y: parseInt(cell.dataset.y),
      classes: cell.className,
      content: cell.innerHTML
    }))
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
  alert('Game saved!');
}

function loadGameState() {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const gameState = JSON.parse(savedState);
    coins = gameState.coins;
    score = gameState.score;
    turn = gameState.turn;
    builtBuildings = gameState.builtBuildings;
    gridSize = gameState.gridSize;
    existingCells = gameState.existingCells;
    initializeGrid(gridSize);
    updateInfo();
  } else {
    alert('No saved game found.');
  }
}

// Start the game
updateInfo();
