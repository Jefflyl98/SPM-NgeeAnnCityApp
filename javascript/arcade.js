// script.js
const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const demolishBtn = document.getElementById('demolish-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');

let coins = 16;
let score = 0;
let turn = 0;
let builtBuildings = 0;
let currentBuilding = null;
let availableBuildings = ['R', 'I', 'C', 'O', 'road'];
let selectedCells = [];

// Code to generate button for 20x20
for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
        const cell = document.createElement('div');
        cell.textContent = ' ';
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.classList.add('grid-cell');
        // cell.addEventListener('click', () => placeBuilding(x, y));
        cell.addEventListener('click', () => {
          if (!selectedCells.includes(cell)){
            if (selectedCells.length > 0){
              selectedCells[0].style.background = '';
            }
            selectedCells = [cell];
            cell.style.background = 'red';
          } 
        });
        gridContainer.appendChild(cell);
    }
}

// Add event listeners for buttons
buildBtn.addEventListener('click', () => {
  if (selectedCells.length != 0) {
    const x = selectedCells[0].dataset.x;
    const y = selectedCells[0].dataset.y;  
    console.log(selectedCells);
    if (builtBuildings > 0 && !isAdjacent(x, y)) {
      alert('You must build adjacent to an existing building.');
      return;
    }
    selectedCells[0].style.background = '';
    const randomBuildings = getRandomBuildings();
    console.log(randomBuildings);
    let buildingOptions = null;
    //const buildingOptions = prompt(`Choose a building to build on cell (${selectedCells[0].dataset.x}, ${selectedCells[0].dataset.y}): ${randomBuildings.join(', ')}`);
    document.getElementById('buildOption1').innerHTML = randomBuildings[0];
    document.getElementById('buildOption2').innerHTML = randomBuildings[1];
    document.querySelector('.popup-form').style.display = 'block';

    document.getElementById('buildBtnOption1').addEventListener('click', () => {
      buildingOptions = randomBuildings[0];
      document.querySelector('.popup-form').style.display = 'none';
      placeBuilding(x, y, buildingOptions);
      selectedCells = [];
    });
    document.getElementById('buildBtnOption2').addEventListener('click', () => {
      buildingOptions = randomBuildings[1];
      document.querySelector('.popup-form').style.display = 'none';
      placeBuilding(x, y, buildingOptions);
      selectedCells = [];
    });
    // if (buildingOptions) {
    //   placeBuilding(selectedCells[0].dataset.x, selectedCells[0].dataset.y, buildingOptions);
    //   selectedCells = [];
    // }
  } else {
    alert('Invalid cell.');
  }
});
demolishBtn.addEventListener('click', demolish);
leaderboardBtn.addEventListener('click', leaderboard);
helpBtn.addEventListener('click', help);

function demolish(x, y) {
  //The player may select any cell with buildings to demolish it for 1 coin.
    if (selectedCells != null) {
      selectedCells[0].style.background = '';
      const cell = document.querySelector(`.grid-cell[data-x='${selectedCells[0].dataset.x}'][data-y='${selectedCells[0].dataset.y}']`);
      if (cell.classList.contains('occupied')) {
        cell.classList.remove('occupied');
        cell.classList.remove(cell.classList[1]);
        cell.textContent = '';
        cell.background = '';
        coins--;
        builtBuildings--;
        updateInfo();
        selectedCells = [];
      } else {
        alert('No building to demolish on this cell.');
      }
    }
}

function updateInfo() {
  coinsEl.textContent = coins;
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

// function randomBuilding() {
//   return availableBuildings[Math.floor(Math.random() * availableBuildings.length)];
// }

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
  // if (!cell || cell.classList.contains('occupied')) {
  //     alert('Invalid placement.');
  //     return;
  // }

  // if (turn > 1 && !isAdjacent(x, y)) {
  //     alert('You must build adjacent to an existing building.');
  //     return;
  // }

  cell.classList.add(buildingType, 'occupied');
  cell.textContent = buildingType;

  coins--;
  turn++;
  builtBuildings++;
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

function leaderboard() {
  alert('Leaderboard feature is not implemented yet.');
}

function help() {
  alert('Help instructions are not implemented yet.');
}

// Start the game
startTurn();