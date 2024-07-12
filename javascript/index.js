const loginButton = document.querySelector('.login-button');
const loginOverlay = document.getElementById('loginOverlay');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginCancelBtn = document.getElementById('loginCancelBtn');

loginButton.addEventListener('click', () => {
  loginOverlay.style.display = 'flex';
});

loginCancelBtn.addEventListener('click', () => {
  loginOverlay.style.display = 'none';
});

loginSubmitBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Add your login logic here
  alert(`Username: ${username}, Password: ${password}`);
  loginOverlay.style.display = 'none';
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
          console.log('Loaded Data:', saveData); // Debugging line to check loaded data

          // Store the save data in localStorage
          localStorage.setItem('saveData', JSON.stringify(saveData));

          // Redirect based on the game mode
          if (saveData.mode === 'arcade') {
            window.location.href = './html/arcade.html';
          } else if (saveData.mode === 'freePlay') {
            window.location.href = './html/free.html';
          } else {
            alert('Unknown game mode in the save file.');
          }
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

document.addEventListener('DOMContentLoaded', () => {
  const saveData = JSON.parse(localStorage.getItem('saveData'));
  if (saveData) {
    try {
      console.log('Loaded Data:', saveData); // Debugging line to check loaded data

      if (saveData.mode === 'arcade') {
        restoreGameState(saveData, 'arcade');
      } else if (saveData.mode === 'freePlay') {
        restoreGameState(saveData, 'freePlay');
      } else {
        alert('Invalid game mode for this page.');
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Error parsing the save data:', error);
      alert('Failed to load the game. The save file may be corrupted.');
    }
  }
});

function restoreGameState(saveData, mode) {
  if (mode === 'arcade') {
    coins = saveData.coins;
  } else if (mode === 'freePlay') {
    coins = Infinity;
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
}

function updateInfo() {
  // Update any game information displays here
  // Example:
  document.getElementById('score-display').textContent = `Score: ${score}`;
  document.getElementById('turn-display').textContent = `Turn: ${turn}`;
}


