// script.js
const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const nextBtn = document.getElementById('next-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');

let coins = 16;
let score = 0;
let turn = 0;
let currentBuilding = null;
let availableBuildings = ['R', 'I', 'C', 'O', 'road'];


for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
        const cell = document.createElement('div');
        cell.textContent = ' ';
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.classList.add('grid-cell');
        cell.addEventListener('click', () => placeBuilding(x, y));
        gridContainer.appendChild(cell);
    }
}

// Add event listeners for buttons
buildBtn.addEventListener('click', build);
nextBtn.addEventListener('click', next);
leaderboardBtn.addEventListener('click', leaderboard);
helpBtn.addEventListener('click', help);

function updateInfo() {
  coinsEl.textContent = coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
}


/*function build() {
  // Build a structure in the grid
  // Implement your logic for building here
}

function next() {
  // Go to the next stage of the game
  // Implement your logic for going to the next stage here
}

function leaderboard() {
  // Show the leaderboard
  // Implement your logic for showing the leaderboard here
}

function help() {
  // Show help instructions
  // Implement your logic for showing help here
}*/

function randomBuilding() {
  return availableBuildings[Math.floor(Math.random() * availableBuildings.length)];
}

function startTurn() {
  if (coins <= 0) {
      alert('No more coins left to build.');
      return;
  }
  turn++;
  updateInfo();
}

function isAdjacent(x, y) {
  const adjacentCoords = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 }
  ];

  for (let { dx, dy } of adjacentCoords) {
      const nx = x + dx;
      const ny = y + dy;
      const adjacentCell = document.querySelector(`.grid-cell[data-x='${nx}'][data-y='${ny}']`);
      if (adjacentCell && adjacentCell.classList.contains('occupied')) {
          return true;
      }
  }
  return false;
}

function placeBuilding(x, y) {
  if (coins <= 0) {
      alert('No more coins left to build.');
      return;
  }
  
  const cell = document.querySelector(`.grid-cell[data-x='${x}'][data-y='${y}']`);
  if (!cell || cell.classList.contains('occupied')) {
      alert('Invalid placement.');
      return;
  }

  if (turn > 1 && !isAdjacent(x, y)) {
      alert('You must build adjacent to an existing building.');
      return;
  }

  const selectedBuilding = randomBuilding();
  cell.classList.add(selectedBuilding, 'occupied');
  cell.textContent = selectedBuilding;

  coins--;
  calculateScore();
  updateInfo();
}

function calculateScore() {
  score = 0;
  const cells = document.querySelectorAll('.grid-cell.occupied');
  const industryCount = document.querySelectorAll('.I').length;
  
  cells.forEach(cell => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      const buildingType = cell.textContent;

      switch (buildingType) {
          case 'R':
              let adjacentR = 0;
              let adjacentC = 0;
              let adjacentO = 0;
              let adjacentI = 0;
              getAdjacentBuildings(x, y).forEach(adj => {
                  if (adj === 'R') adjacentR++;
                  if (adj === 'C') adjacentC++;
                  if (adj === 'O') adjacentO++;
                  if (adj === 'I') adjacentI++;
              });
              score += adjacentI > 0 ? 1 : adjacentR + adjacentC + 2 * adjacentO;
              break;
          case 'I':
              score += industryCount;
              break;
          case 'C':
              let adjacentCommercial = 0;
              getAdjacentBuildings(x, y).forEach(adj => {
                  if (adj === 'C') adjacentCommercial++;
              });
              score += adjacentCommercial;
              break;
          case 'O':
              let adjacentPark = 0;
              getAdjacentBuildings(x, y).forEach(adj => {
                  if (adj === 'O') adjacentPark++;
              });
              score += adjacentPark;
              break;
          case 'road':
              let connectedRoads = 0;
              for (let i = 0; i < 20; i++) {
                  if (document.querySelector(`.grid-cell[data-x='${x}'][data-y='${i}']`).textContent === 'road') {
                      connectedRoads++;
                  }
              }
              score += connectedRoads;
              break;
      }
  });
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
      return adjacentCell ? adjacentCell.textContent : null;
  }).filter(Boolean);
}

function next() {
  startTurn();
}

function leaderboard() {
  alert('Leaderboard feature is not implemented yet.');
}

function help() {
  alert('Help instructions are not implemented yet.');
}

// Start the game
startTurn();