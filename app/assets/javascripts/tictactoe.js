// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = 0;
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

// updateState()
// Invokes player() and adds the returned string('X' or 'O') to the clicked square on the game board.
function updateState(element) {
  element.innerHTML += player();
}

// setMessage()
// Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  $('div#message')[0].innerHTML += string;
}

// checkWinner()
// Returns true if the current board contains any winning combinations(three X or O tokens in a row, vertically, horizontally, or diagonally).
// Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(),
// passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function getBoard() {
  return $('td')
    .toArray()
    .map(e => {
      return e.innerHTML;
    });
}

function checkWinner() {
  let board = getBoard();

  for (c of winCombos) {
    if (board[c[0]] === 'X' && board[c[1]] === 'X' && board[c[2]] === 'X') {
      setMessage('Player X Won!');
      saveGame();
      return true;
    } else if (
      board[c[0]] === 'O' &&
      board[c[1]] === 'O' &&
      board[c[2]] === 'O'
    ) {
      setMessage('Player O Won!');
      saveGame();
      return true;
    }
  }
  return false;
}

// doTurn()
// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
function resetBoard() {
  turn = 0;
  gameId = 0;
  return $('td').empty();
}

function doTurn(square) {
  var board = getBoard();
  updateState(square);
  turn++;
  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    resetBoard();
  }
  saveGame();
}



function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      //if the text of the td element clicked doesn't exist and checkWinner is false
      doTurn(this); //do turn. this is passed in because updateState requires an argument
    }
  });

  $('#clear').on('click', () => resetBoard()); // click event --> reset current game board
  $('#previous').on('click', () => previousGames()); // click event --> show previous games
  $('#save').on('click', () => saveGame()); // click event --> save game
}

$(function() {
  attachListeners();
});

// When you name your save and previous functions, make sure to call them something like saveGame() and previousGames().
// If you call them save() and previous() you may run into problems with the test suite.
function previousGames() {
  $.get('/games', function(resp) {
    $('#games').empty();
    resp.data.forEach(function(game) {
      $('#games').append(
        `<button class data-id="${game.id}" onclick="loadGame(${
          game.id
        })"> Game ${game.id}</button><br>`
      );
    });
  });
}

function saveGame() {
  game = { state: getBoard() };
  //if the game Id is 0, then make a post request to create an id
  if (gameId === 0) {
    //post request to /games as defined in rake routes, give in game element, and function defined from resp
    $.post(`/games`, game, function(resp) {
      gameId = parseInt(resp.data.id);
    });
    //else update the game PATCH method
  } else {
    //make the ajax request with 3 pieces of data: url, method and data to patch in database
    $.ajax({
      url: `/games/${gameId}`,
      method: 'PATCH',
      data: game
    });
  }
}

function loadGame(id) {
  gameId = id;
  $.getJSON(`/games/${gameId}`, function(resp) {
    //response is heavily nested JSON object, needs to get in the state section, assign it to global turn variable
    turn = resp.data.attributes.state.reduce(function(sum, e) {
      //accumulate to understand which turn it is
      if (e !== '') {
        //if e is not blank, increase turn
        sum++;
      }
      return sum;
    }, 0);
    //puts the "td" element to an array, for each index, update it with the response data attributes' index
    $('td')
      .toArray()
      .forEach((e, index) => {
        e.innerHTML = resp.data.attributes.state[index];
      });
  });
}
