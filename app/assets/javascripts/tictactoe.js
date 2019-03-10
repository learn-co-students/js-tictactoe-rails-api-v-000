// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});

var turn = 0


// sets the player token to X or O
var player = () => turn % 2 ? 'O' : 'X';

function getBoard() {
  squares = document.querySelectorAll('td')
  return squares
}

// setMessage() Accepts a string and adds it to the div#message element in the DOM.
var setMessage = (note) => {
  $('#message').html('<p>' + note + '</p>')
}

function updateState(square) {
    var token = player();
    $(square).text(token)
}

function clearBoard() {
   var fullBoard = $('td')
   fullBoard.empty()
   turn = 0
}

function checkWinner() {
  var winner = false
  const winningCombos = [
     [0, 1, 2],
     [3, 4, 5],
     [6, 7, 8],
     [0, 3, 6],
     [1, 4, 7],
     [2, 5, 8],
     [0, 4, 8],
     [2, 4, 6]
   ]
  var board = []
  var currentState = $('td')

  currentState.text((i, square) =>  {
    board.push(square)
  })

  winningCombos.some(function(element) {
    var position_1 = board[element[0]]
    var position_2 = board[element[1]]
    var position_3 = board[element[2]]

    if (position_1 !== "" && position_1 === position_2 && position_2 === position_3) {
           setMessage(`Player ${board[element[0]]} Won!`);
           winner = true;
           saveGame()
      } else if (turn === 9) {
        setMessage("Tie game.")
        saveGame()
      }
  });
  return winner
}

  function attachListeners(){
    $('td').on('click', function() {
      setMessage("")
      doTurn(this);
    });

    $('#previous').on('click', () => previousGames());
    $('#save').on('click', () => saveGame());
    $('#clear').on('click', () => clearBoard());
  }


function doTurn(square) {
   if (square.textContent === "") {
     updateState(square);
     turn++
   } else {
     setMessage('That square is taken.');
   };
   // checkWinner()
    if (checkWinner() === true || turn === 9) {
        // $("td").off("click");
        clearBoard()
    }
}


function previousGames() {
  $.get("/games", function(games) {
    $.each(games.data, function(index, game) {
      $("#games").append(`<p>${game.id}</p>`);
    });
  });
}

function saveGame() {
let values = $(this).serialize();
let saving = $.post('/games', values);

clearBoard();
}
