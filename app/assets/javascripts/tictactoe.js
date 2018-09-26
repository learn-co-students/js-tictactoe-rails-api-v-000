var turn = 0
var gameId = 0
$(function(){
  attachListeners();
})

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}

function doTurn(spot) {
  updateState(spot)
  turn++
    if (checkWinner() === true) {
      saveGame()
      resetBoard()
    }
    else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      resetBoard()
    }
}

function gameOver() {
  if (checkWinner() == true || turn === 9) {
    return true
  }
}

function gameBoard() {
  var board = [];
  for (el of $('td')) {
    board.push(el.innerHTML);
  }
  return board
}

function updateState(spot) {
  $(spot).text(player())
}

function checkWinner() {
  const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  let winner = false
  var current = gameBoard()

  for (i = 0; win_combos.length > i ; i++) {
    var comb = win_combos[i]
    if ((current[comb[0]] === current[comb[1]]) && (current[comb[1]] === current[comb[2]]) && (current[comb[1]] !== "")) {
      setMessage(`Player ${current[comb[1]]} Won!`)
      return true
    }
  }
  return winner
}

function saveGame() {
  var state = {state: gameBoard()}
  if (this.gameId === 0) {
    $.post('/games', {state: state}, function(data) { gameId =  data.data.id
    $('#games').append(`<p>${gameId}</p>`)
    })
  }
  else {
    $.ajax({
     type: 'PATCH',
     url: `/games/${gameId}`,
     data: state
   })
  }
}

function getGames() {
  $.get("/games", function(data) {
    $('#games').empty()
    var games = data.data
    for (const el of games) {
      $('#games').append(`<button id="${el.id}" onclick="loadGame(${el.id})">game: ${el.id} updated: ${el.attributes["updated-at"]}</button><br>`)
    }
  })
}

function resetBoard() {
  $('td').text("")
  turn = 0
  gameId = 0
}

function setMessage(msg) {
   $('#message').text(msg)
}

function loadGame(gid) {
  $.get(`/games/${gid}`, function(data) {
    gameId = data.data.id
    var board = data.data.attributes.state
    turn = board.join("").length
    i = 0
    board.forEach((el) => {$('td')[i].innerHTML = el, i++})
  })
}

function attachListeners() {
  $('td').on("click", function() {
    if (this.innerHTML === "" && !gameOver()) {
      doTurn(this);
    }
  })

  $('#clear').on("click", function() {
    resetBoard()
  })

  $('#previous').on("click", function() {
    getGames()
  })

  $('#save').on("click", function() {
    saveGame()
  })
}
