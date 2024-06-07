// script.js
const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const nextBtn = document.getElementById('next-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');

let coins = 50;
let score = 0;
let turn = 1;
let currentBuilding = null;
let availableBuildings = [];

// Create grid cells
for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 5; x++) {
    const cell = document.createElement('div');
    cell.textContent = ' ';
    const className = `grid-${y}-${x}`;
    cell.classList.add(className);
    gridContainer.appendChild(cell);
  }
}

// Update the coin and score displays
coinsEl.textContent = coins;
scoreEl.textContent = score;

// Add event listeners for buttons
buildBtn.addEventListener('click', build);
nextBtn.addEventListener('click', next);
leaderboardBtn.addEventListener('click', leaderboard);
helpBtn.addEventListener('click', help);

// Function to build a structure
function build() {
  // Implement your logic for building here
}

// Function to go to the next stage
function next() {
  // Implement your logic for going to the next stage here
}

// Function to show the leaderboard
function leaderboard() {
  // Implement your logic for showing the leaderboard here
}

// Function to show help instructions
function help() {
  // Implement your logic for showing help here
}