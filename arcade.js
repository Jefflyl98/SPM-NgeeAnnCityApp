// script.js
const gridContainer = document.querySelector('.grid-container');
const buildBtn = document.getElementById('build-btn');
const nextBtn = document.getElementById('next-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const helpBtn = document.getElementById('help-btn');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');

let coins = 16;
let score = 0;
let turn = 0;
let currentBuilding = null;
let availableBuildings = [];


for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
        const cell = document.createElement('div');
        cell.textContent = ' ';
        const className = `grid-${y}-${x}`;
        cell.classList.add(className);
        gridContainer.appendChild(cell);
    }
}

// Add event listeners for buttons
buildBtn.addEventListener('click', build);
nextBtn.addEventListener('click', next);
leaderboardBtn.addEventListener('click', leaderboard);
helpBtn.addEventListener('click', help);

function build() {
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
}