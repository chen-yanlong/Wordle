// Submit the custom word (index.html)
document.addEventListener('DOMContentLoaded', function() {
  const submitWordButton = document.getElementById('submit-word');
  const submitGuessButton = document.getElementById('submit-guess');

  // If we are on the word input page
  if (submitWordButton) {
    submitWordButton.addEventListener('click', function() {
      const customWord = document.getElementById('custom-word-input').value.toLowerCase();

      if (customWord.length === 0) {
        displayMessage('Please enter a valid word.');
        return;
      }

      // Store the word in localStorage
      localStorage.setItem('wordleWord', customWord);

      // Navigate to the guess page
      window.location.href = 'guess.html';
    });
  }

  // If we are on the guessing page (guess.html)
  if (submitGuessButton) {
    const targetWord = localStorage.getItem('wordleWord');
    let currentRow = 0;

    if (!targetWord) {
      displayMessage('No word found. Please enter a word first.');
      return;
    }

    // Dynamically create the game board based on the word length
    createGameBoard(targetWord.length);

    submitGuessButton.addEventListener('click', function() {
      const guess = document.getElementById('guess-input').value.toLowerCase();

      if (guess.length !== targetWord.length) {
        alert(`Please enter a word with exactly ${targetWord.length} letters.`);
        return;
      }

      if (currentRow >= 6) {
        displayMessage('Game Over! No more guesses!');
        return;
      }

      for (let i = 0; i < guess.length; i++) {
        const cell = document.getElementById(`cell-${currentRow * targetWord.length + i}`);
        cell.textContent = guess[i];

        if (guess[i] === targetWord[i]) {
          cell.classList.add('correct');
        } else if (targetWord.includes(guess[i])) {
          cell.classList.add('present');
        } else {
          cell.classList.add('absent');
        }
      }

      if (guess === targetWord) {
        displayMessage('Congratulations! You guessed the word!');
      } else if (currentRow === 5) {
        displayMessage(`Game Over! The word was ${targetWord}`);
      }

      currentRow++;
      document.getElementById('guess-input').value = '';
    });
  }
});

// Utility function to create the game board dynamically
function createGameBoard(wordLength) {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;

  for (let i = 0; i < wordLength * 6; i++) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}`;
    board.appendChild(cell);
  }
}

// Utility function to display messages
function displayMessage(msg) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = msg;
}
