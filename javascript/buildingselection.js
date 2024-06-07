document.getElementById('openPopupBtn').addEventListener('click', function() {
    document.getElementById('popupOverlay').style.display = 'flex';
});

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('popupOverlay')) {
        document.getElementById('popupOverlay').style.display = 'none';
    }
});
