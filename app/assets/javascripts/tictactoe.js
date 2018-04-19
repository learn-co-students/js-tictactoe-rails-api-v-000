// Code your JavaScript / jQuery solution here

// Global variables
var turn = 0;
var gameId;

// Attaching event listeners to document load so that the buttons have enough time to get created into the DOM.
$(function () {
  attachListeners();
});

// All my event listeners that will get attached to the different buttons.
function attachListeners() {
  $('td').click(function() {
    if (isValid(this) && !checkWinner()) {
      doTurn(this)
    }
  });

  $('#previous').click(function(e) {
    e.preventDefault();
    previousGames();
  });

  $('#save').click(function(e) {
    e.preventDefault();
    saveGame();
  });

  $('#clear').click(function(e) {
    e.preventDefault();
    resetGame();
  });

}

// This function will reset the game board, and the global variables
function resetGame() {
  $('td').empty();
  turn = 0;
  gameId = 0;
}

// Check if it's an X symbol
// const isX = (index) => {return getSymbol(index) === 'X'}; (ES6 syntax, that won't pass the test)
function isX(index) {
  return getSymbol(index) === 'X';
}

// Check if it's an O symbol
// const isO = (index) => {return getSymbol(index) === 'O'}; (ES6 syntax, that won't pass the test)
function isO(index) {
  return getSymbol(index) === 'O';
}

// Run an function for each board cell and check if it's innerHTML is not empty
// If all is taken it means that the board is full
function isBoardFull() {
  return $('td').toArray().every(function (cell) {
    return cell.innerHTML !== '';
  });
}

// Check if the global turn variable is divisible by 2 and if the remainder is 0, which equals even numbers.
// const player = () => { return turn % 2 === 0 ? 'X' : 'O'}; (ES6 syntax, that won't pass the test)
function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

// Takes the position and updates the board with the player symbol
// const updateState = (position) => { $(position).text(player()) };
function updateState(position) {
  $(position).text(player());
}

// Takes an messages and updates the #message div with the message
// const setMessage = (message) => { $('#message').text(message) };
function setMessage(message) {
  $('#message').text(message);
}

// Takes an index and checks if that position has an symbol in its cell
// Return the symbol if there is an symbol otherwise return null
function getSymbol(index) {
  let symbol = $('td')[index].innerHTML;
  if (symbol === "") return null;
  return symbol;
}

// Check if there is an symbol at the given position, if it is return true otherwise return false
function isValid(position) {
  let symbol = position.innerHTML;
  return !symbol;
}

// Check if the function ThreeInARow is returning an winning array from iterating over all the combinations
// Return the winning symbol and the message if it's true otherwise return false
function checkWinner() {
  const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];
  if (ThreeInARow(winningCombinations)) {
    let winning_combination = ThreeInARow(winningCombinations);
    let symbol = getSymbol(winning_combination[0]);
    setMessage(`Player ${symbol} Won!`);
    return true;
  } else {
    return false;
  }
}

// Loop over each winning combination and check if every item in the Array is either X or O if so, return the array.
function ThreeInARow(combinations) {
  for (let i = 0; i < combinations.length; i++) {
    if (combinations[i].every(isX)) return combinations[i];
    if (combinations[i].every(isO)) return combinations[i];
  }
}

// Updates the position and global variable
// Check if there is an winner or if the board is full
// If there is an winner it should save the game and reset the board
// If not the game should be tied and it should set a message, save and reset the game
function doTurn(position) {
  updateState(position);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetGame()
  } else if (isBoardFull()) {
    setMessage('Tie game.');
    saveGame();
    resetGame()
  }
}

// Send an ajax get request to `/games` which will hit the index controller action.
// For each game in the response create an button for each
// If the response doesn't find any games don't do anything.
function previousGames() {
  $.get('/games', function(response) {
    let data = response.data;
    if (data.length > 0) {
      data.forEach(function(game) {
        createButton(game);
      })
    }
  })
}

// Iterate over the game board and push the symbols into an object holding the array
// If the game has been saved previously it should have an gameId and should therefor send an PATCH request
// If it's the first time saving the game it should send an POST request with the including object
// When the game has been successfully called take the id that was stores in the database and assign it as the gameId
function saveGame() {
  let gameObject = { state: []};
  $('td').text(function (index, square) {
    gameObject.state.push(square)
  });
  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameObject
    })
  } else {
    $.ajax({
      type: 'POST',
      url: '/games',
      data: gameObject,
      success: function (game) {
        gameId = game.data.id;
      }
    });
  }
}

// Create the button from the game through the id
// Look to see if there is an button with that ID already, if so don't create a second button
// Create button with the text from the game id, add a click event that should invoke the function loadGame
// Also added stopPropagation to cancel any event capturing from clicking the previousGame button
function createButton(game) {
  let gameButton = $(`button:contains(${game.id})`);
  if (gameButton.length === 0) {
    $('#games').append(
      $('<button>')
        .text(game.id)
        .click(function(e) {
          e.stopPropagation();
          loadGame(this);
        })
    )
  }
}

// Takes the id from the button and sends an get request to the show action
// Take the responded state array and populate the board with that data
function loadGame(button) {
  let id = button.innerHTML;
  gameId = id;
  $.get(`/games/${id}`).done(function(response) {
    let stateArray = response.data.attributes.state;
    populateBoards(stateArray)
  });
}

// Loop through the game board and add in the cells into the board
// Increase the turn variable if one of the cells are X or O
function populateBoards(arr) {
  const squares = $('td').toArray();
  for (let i = 0; i < 9; i++) {
    if (arr[i] === 'X' || arr[i] === 'O') turn++;
    squares[i].innerHTML = arr[i];
  }
}