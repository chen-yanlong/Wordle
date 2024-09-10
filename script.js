let currentGuess = ''; // Store the current guess
let currentRow = 0;    // Track the current row of guesses
const letterColors = {}; // Track the highest priority color for each letter

document.addEventListener('DOMContentLoaded', function() {
  const submitGuessButton = document.getElementById('submit-guess');
  const keyboard = document.getElementById('keyboard');
  const inputField = document.getElementById('guess-input');
  const backspace = document.getElementById('backspace');

  // Retrieve the target word from localStorage
  const targetWord = localStorage.getItem('wordleWord')?.toLowerCase();

  if (!targetWord) {
    displayMessage('No word found. Please enter a word first.');
    return;
  }

  // Dynamically create the game board based on the word length
  createGameBoard(targetWord.length);

  // Handle keyboard clicks
  keyboard.addEventListener('click', function(e) {
    if (e.target.classList.contains('key') && !e.target.id) {
      addLetterToGuess(e.target.textContent);
    }
  });

  // Handle backspace click
  backspace.addEventListener('click', function() {
    removeLetterFromGuess();
  });

  // Submit guess button
  submitGuessButton.addEventListener('click', function() {
    if (currentGuess.length !== targetWord.length) {
      alert(`Please enter a word with exactly ${targetWord.length} letters.`);
      return;
    }

    processGuess(currentGuess, targetWord); // Update both the board and keyboard
    currentGuess = ''; // Reset the guess for the next row
  });

  // Add letter to guess
  function addLetterToGuess(letter) {
    if (currentGuess.length < targetWord.length) {
      currentGuess += letter.toLowerCase();
      inputField.value = currentGuess;
    }
  }

  // Remove letter from guess (backspace)
  function removeLetterFromGuess() {
    currentGuess = currentGuess.slice(0, -1);
    inputField.value = currentGuess;
  }

  function processGuess(guess, targetWord) {
    const boardRow = document.querySelectorAll(`#game-board div.row-${currentRow}`);
    const keyColors = {}; // Track the best color for each key
    const incorrectLetters = new Set(); // Track incorrect letters
    
    // First pass to mark cells and track incorrect letters
    for (let i = 0; i < guess.length; i++) {
      const cell = boardRow[i];
      const letter = guess[i];
      
      cell.textContent = letter;
  
      if (letter === targetWord[i]) {
        cell.classList.add('correct');
        keyColors[letter] = 'correct'; // Highest priority color
      } else if (targetWord.includes(letter)) {
        if (!keyColors[letter]) {
          keyColors[letter] = 'present'; // Set to present if it's not correct
        }
        cell.classList.add('present');
      } else {
        if (!keyColors[letter]) {
          keyColors[letter] = 'incorrect'; // Lowest priority color
          incorrectLetters.add(letter); // Track incorrect letters
        }
        cell.classList.add('absent');
      }
    }
  
    // Update the global letterColors with the highest priority colors
    for (const [letter, color] of Object.entries(keyColors)) {
      letterColors[letter] = color;
    }
    for (const letter of incorrectLetters) {
      if (!letterColors[letter]) {
        letterColors[letter] = 'incorrect'; // Ensure incorrect letters are marked
      }
    }
  
    // After processing the row, update the keyboard colors
    updateKeyboardColors();
  
    currentRow++;  // Move to the next row for the next guess
    inputField.value = ''; // Clear the input field
  }
  
  function updateKeyboardColors() {
    document.querySelectorAll('.key').forEach(keyElement => {
      const letter = keyElement.textContent.toLowerCase().trim(); // Use textContent to match key

      console.log(`Processing Key: '${letter}'`);

      // Remove all existing color classes
      keyElement.classList.remove('correct', 'present', 'absent', 'incorrect');
      
      // Apply the color based on letterColors
      if (letterColors[letter]) {
        keyElement.classList.add(letterColors[letter]);
      } else {
        keyElement.classList.add('absent'); // Apply 'absent' if not in `letterColors`
      }
    });
  }

  // Utility function to create the game board dynamically
  function createGameBoard(wordLength) {
    const board = document.getElementById('game-board');
    board.innerHTML = '';  // Clear previous content

    // Create 6 rows, each with `wordLength` number of cells
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < wordLength; col++) {
        const cell = document.createElement('div');
        cell.classList.add(`row-${row}`);
        board.appendChild(cell);
      }
    }
  }

  // Utility function to display messages
  function displayMessage(msg) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
  }
});
