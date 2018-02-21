// Code your JavaScript / jQuery solution here
$(document).ready(function () {
	attachListeners();
});

var turn = 0;
var gameId = 0;

function player() {
  if (this.turn % 2 == 0 || this.turn === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(move) {
  var currentPlayer = player();
  $(move).text(currentPlayer)
  // #move is already a click event. Just need to replace the text with the value of player function.
}

function setMessage(string) {
  document.getElementById("message").innerHTML += string
}

function getBoard() {
  var board = []
  var squares = $("td")
  for(var i = 0; i < squares.length; i++) {
    board.push(squares[i].innerHTML)
  }
  return board
}

function checkWinner() {
  var winners = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  var board = getBoard()
    for(var i = 0; i < winners.length; i++) {
      var winCombo = winners[i]
      if(board[winCombo[0]] == "X" && board[winCombo[1]] == "X" && board[winCombo[2]] == "X") {
        setMessage("Player X Won!")
        return true
      } else if (board[winCombo[0]] == "O" && board[winCombo[1]] == "O" && board[winCombo[2]] == "O"){
        setMessage("Player O Won!")
        return true
      }
    }
  return false
}

function doTurn(board) {
  updateState(board)
  turn ++
  if (checkWinner()) {
    saveGame()
    reset()
  } else if (full()) {
      setMessage("Tie game.")
      saveGame()
      reset()
    }
}

function reset() {
  $('td').empty()
  turn = 0
  gameId = 0
}

function full() {
  var board = getBoard()

  if (board.includes('')) {
    return false
  } else {
    return true
  }
}

function attachListeners(){
  $("td").click(function(){
      if (this.innerHTML === "" && checkWinner() === false ) {
          doTurn(this)
      }
  })
  $('#save').on('click', function() {
      saveGame();
  })
  $('#clear').on('click',function(){
      reset();
  })
  $("#previous").click(function() {
      $.getJSON('/games', function(response) {
          $("#games").empty()
          response.data.forEach(function(game) {
              $("#games").append(`<button data-id="${game.id}" onclick = "loadGame(${game.id})">${game.id}</button>`)
          })
      })
  })
}

function saveGame() {
  var board = getBoard()

  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: { state: board }
    });
  } else {
    $.post('/games', { state: board }, function(game) {
      gameId = game.data.id;
    });
  }
}

function loadGame(id) {
  gameId = id
  var total = 0
  $.getJSON(`/games/${gameId}`, function(response) {
      response.data.attributes.state.forEach(function(element) {
          if (element !== "") {
              total += 1

          }
          return total
      })
      turn = total

      $("td").toArray().forEach((token, index) => { token.innerHTML = response.data.attributes.state[index]})
  })
}
