// Code your JavaScript / jQuery solution here
var turn = 0
const spaces = window.document.querySelectorAll('td');
var currentGame = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerText = player();
}

function setMessage(str) {
  $('#message').append(str);
}

function checkWinner() {
  const winCombos = [
                    [0,1,2], 
                    [3,4,5], 
                    [6,7,8], 
                    [0,3,6], 
                    [1,4,7], 
                    [2,5,8], 
                    [0,4,8], 
                    [2,4,6]
                  ]
  var board = {};
  var winner = false;
  $('td').text(function(i, square) {
    board[i] = square;
  })
  winCombos.some(function(combo) {
    if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;      
    }
  })
  return winner;
}

 function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage('Tie game.')
    saveGame();
    clearBoard();
  }
 } 

 function clearBoard() {
   $('td').empty();
   turn = 0;
   currentGame = 0;
 }

 function attachListeners() {
  $('td').click(function() {
    if (!checkWinner() && this.innerHTML === "") {
      doTurn(this);
    }
   })
   previousGames();
   $('#save').click(function() {
    saveGame();
   });
   clickClearButton();
 }

 function previousGames() {
  $('#previous').click(function() {
    $.get('/games', function(resp) {
      if (resp.data.length > 0) {
        let gamesList = resp.data
        $.each(gamesList, function(i, game) {
          let gameButton = `<button id="button-${game.id}" onclick="gameRequest(${game.id})">Game ${game.id}</button>`
          if (!$('#games').has(`#button-${game.id}`).length) {
            $('#games').append(gameButton)
          }
        })
      }
    })
  })
 }

 function gameRequest(gameId) {
   $.get(`/games/${gameId}`, function(game) {
    debugger

    var board = game.data.attributes.state
    $('td').each(function(i) {
      $('td')[i].innerHTML = board[i]
    });
   });
 }

 function saveGame() {
    var board = [];
    $('td').text(function(i, square) {
      board.push(square);
    })
    var gameData = {state: board}
    if (currentGame > 0) {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: gameData
      })
    } else {
      $.post('/games', gameData, function(game) {
        currentGame = game.data.id
      })
    } 
 }

 function clickClearButton() {
   $('#clear').click(function() {
     clearBoard();
   })
 }

 $(document).ready(function() {
   attachListeners();
 });