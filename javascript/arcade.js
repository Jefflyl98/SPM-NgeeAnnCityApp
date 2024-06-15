const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const demolishBtn = document.getElementById('demolish-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');
const popupOverlay = document.getElementById('popupOverlay');

let coins = 16;
let score = 0;
let turn = 0;
let builtBuildings = 0;
let currentBuilding = null;
let availableBuildings = ['Road', 'Industry', 'Commercial', 'Park', 'Road'];
let buildingImages = {
  'Residential': '../buildinggraphics/residential.png',
  'Industry': '../buildinggraphics/industry.png',
  'Commercial': '../buildinggraphics/commercial.png',
  'Park': '../buildinggraphics/park.png',
  'Road': '../buildinggraphics/road.png'
};
let selectedCells = [];

// Code to generate grid for 20x20
for (let y = 0; y < 20; y++) {
  for (let x = 0; x < 20; x++) {
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
  coinsEl.textContent = coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
  if (coins <= 0 || builtBuildings === 400) {
    end();
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

function end() {
  const endScreen = document.createElement('div');
  endScreen.className = 'end-screen';
  endScreen.innerHTML = `
    <div class="end-info">
      <div><h1>Game Over!</h1></div>
      <div><p>Your score is ${score}.</p></div>
      <div>
        <label for="name">Enter your name:</label>
        <input type="text" id="name" placeholder="Optional">
      </div>
      <div class="end-button">
        <button onclick="submitScore()">Submit Score</button>
        <button id="end">Back to Home</button>
      </div>
    </div>
  `;
  document.body.appendChild(endScreen);

  document.getElementById('end').addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

function submitScore() {
  const nameInput = document.getElementById('name');
  const name = nameInput.value.trim() || 'Anonymous';
  const scoreData = { name, score };
  localStorage.setItem('scoreData', JSON.stringify(scoreData));
  nameInput.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
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

        if (adjacentI > 0) {
          score += 1; // Residential next to industry scores 1 point
        } else {
          score += adjacentR + adjacentC + 2 * adjacentO;
        }
        break;

      case 'Industry':
        // Score 1 point per industry in the city
        score += industryCount;

        // Generate coins based on adjacent residential buildings
        const adjacentResidentialI = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += adjacentResidentialI;
        break;

      case 'Commercial':
        // Score 1 point per commercial adjacent to it
        let adjacentCommercial = 0;
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Commercial') adjacentCommercial++;
        });
        score += adjacentCommercial;

        // Generate coins based on adjacent residential buildings
        const adjacentResidentialC = getAdjacentBuildings(x, y).filter(adj => adj === 'Residential').length;
        coins += adjacentResidentialC;
        break;

      case 'Park':
        // Score 1 point per park adjacent to it
        let adjacentPark = 0;
        getAdjacentBuildings(x, y).forEach(adj => {
          if (adj === 'Park') adjacentPark++;
        });
        score += adjacentPark;
        break;

      case 'Road':
        // Score 1 point per connected road in the same row
        let connectedRoads = 0;
        for (let i = 0; i < 20; i++) {
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

function upkeep() {
  const cells = document.querySelectorAll('.grid-cell.occupied');
  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const buildingType = cell.textContent;

    switch (buildingType) {
      case 'R':
        const adjacentR = getAdjacentBuildings(x, y).filter(adj => adj === 'R').length;
        coins++;
        if (adjacentR > 0) {
          for (let i = 0; i < adjacentR; i++) {
            coins--;
          }
        }
        break;
      case 'I':
        coins += 2;
        coins--;
        break;
      case 'C':
        coins += 3;
        coins -= 2;
        break;
      case 'O':
        coins--;
        break;
      case 'road':
        const adjacentRoad = getAdjacentBuildings(x, y).filter(adj => adj === 'road' || adj === 'R' || adj === 'C' || adj === 'I' || adj === 'O').length;
        if (adjacentRoad === 0) {
          coins--;
        }
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

// Start the game
updateInfo();
