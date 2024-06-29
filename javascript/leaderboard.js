const leaderboardTableBody = document.getElementById('leaderboard-score');
let scoreDataCounter = localStorage.getItem('scoreDataCounter');
if (scoreDataCounter !== null) {
    scoreDataCounter = parseInt(scoreDataCounter);
    const existingKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('scoreData')) {
            existingKeys.push(parseInt(key.replace('scoreData', '')));
        }
    }
    scoreDataCounter = Math.max(...existingKeys) + 1;
}

const scoreDataArray = [];

// Get all stored scores from local storage
for (let i = 0; i < localStorage.length - 1; i++) {
    const key = localStorage.key(i); // Use localStorage.key(i) to get the key
    if (key.startsWith('scoreData')) { // Check if the key is a scoreData key
        const scoreData = JSON.parse(localStorage.getItem(key)); // Parse the JSON
        if (scoreData !== null && scoreData !== undefined) { // Check if scoreData is not undefined
            scoreDataArray.push(scoreData); // Add the parsed JSON to the array
        }
    }
}

scoreDataArray.sort((a, b) => b.score - a.score);

leaderboardTableBody.innerHTML = '';

scoreDataArray.forEach((scoreData) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${scoreData.name}</td>
        <td>${scoreData.score}</td>
    `;
    leaderboardTableBody.appendChild(row);
});