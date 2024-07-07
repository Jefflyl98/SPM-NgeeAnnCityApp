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
          console.log('Loaded Data:', saveData);  // Debugging line to check loaded data

          // Check the game mode
          if (saveData.mode !== 'arcade') {
            alert('Loaded file is not for Arcade mode.');
            return;
          }

          // Restore game state variables
          coins = saveData.coins;
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
  coinsEl.textContent = coins;
  scoreEl.textContent = score;
  turnEl.textContent = turn;
  if (coins <= 0 || builtBuildings === 400) {
    end();
  }
}

