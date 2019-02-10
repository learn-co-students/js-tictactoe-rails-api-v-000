
var turn = 0;
var currentGame = 0;
var gameBoard = { state: []}

$(document).ready(function() {
  attachListeners();
});


function player() {
  if (turn % 2) {
    return 'O'
  } else {
    return 'X'
  }
}

function updateState(boxChoice) {
  $(boxChoice).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  let squareZero = $('td')[0].textContent
  let squareOne = $('td')[1].textContent
  let squareTwo = $('td')[2].textContent
  let squareThree = $('td')[3].textContent
  let squareFour = $('td')[4].textContent
  let squareFive = $('td')[5].textContent
  let squareSix = $('td')[6].textContent
  let squareSeven = $('td')[7].textContent
  let squareEight = $('td')[8].textContent


  const board = [squareZero, squareOne, squareTwo, squareThree, squareFour, squareFive, squareSix, squareSeven, squareEight]
  let winner = false;

  var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [2,5,8], [1,4,7], [0,4,8], [6,4,2]];

  for (const element of winCombinations) {
    if (board[element[0]] === 'X' && board[element[1]] === 'X' && board[element[2]] === 'X') {
      setMessage('Player X Won!');
      winner = true;
    } else if (board[element[0]] === 'O' && board[element[1]] === 'O' && board[element[2]] === 'O') {
      setMessage('Player O Won!');
      winner = true;
    }
  }
  return winner;
}

function doTurn(boxChoice) {
  updateState(boxChoice);
  turn ++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').text('');
  turn = 0;
  currentGame = 0;
  setMessage('')
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  let squareZero = $('td')[0].textContent
  let squareOne = $('td')[1].textContent
  let squareTwo = $('td')[2].textContent
  let squareThree = $('td')[3].textContent
  let squareFour = $('td')[4].textContent
  let squareFive = $('td')[5].textContent
  let squareSix = $('td')[6].textContent
  let squareSeven = $('td')[7].textContent
  let squareEight = $('td')[8].textContent

  let board = [squareZero, squareOne, squareTwo, squareThree, squareFour, squareFive, squareSix, squareSeven, squareEight]
  gameBoard.state = board;

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameBoard
    });
  } else {
    $.post('/games', gameBoard, function(game) { //sends to /games-this is where saved games will be stored
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => loadGame(game.data.id));
    });
  }

}

function showPreviousGames() {
  $('#games').text('');
  $.get('/games', (games) => {
    if (games.data) {
    for (const game of games.data) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      $("#gameid-" + game.id).on('click', () => loadGame(game.id));
     }
      }
    });
  }


function loadGame(gameID) {
  document.getElementById('message').innerHTML = '';
  $.get(`/games/${gameID}`).done( function(data) {
    const state = data.data.attributes.state;
    const id = parseInt(data.id);
    for (const element of state) {
        document.getElementById(`${state.indexOf(element)}`).textContent = element;
      }
      turn = state.join('').length;
      console.log(turn)
      currentGame = id;
  })
}
