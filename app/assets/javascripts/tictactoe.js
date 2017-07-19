var current = 0
var turn = 0
var WINNING_COMBINATIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

$(() => attachListeners())

var player = () => turn % 2 === 0 ? "X" : "O"

var updateState = (square) => {
  square.innerHTML = player()
  return square
}

var message = (string) => $("#message").html(string)

function checkWinner() {
  var board = {}
  var winner = false

  $("td").text((i, square) => board[i] = square)

  WINNING_COMBINATIONS.some((combo) => {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function emptyBoard() {
  $("td").empty()
  turn = 0
  current = 0
}

function doTurn(move) {
  updateState(move)
  turn++
  if (checkWinner()) {
    saveGame()
    emptyBoard()
  } else if (turn === 9) {
    message("Tie game.")
    saveGame()
    emptyBoard()
  }
}

function addGameButton(game) {
  $("#games").append(`<button id="${game.id}">Game ${game.id}</button>`)
}

function showPrevious() {
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      var $games = $("#games")[0].innerHTML
      savedGames.data.forEach((game) => {
        if (!$games.includes(game.id)) {
          addGameButton(game)
        }
      })
      $("#games button").click(reloadGame)
    }
  })
}

function reloadGame() {
  var id = this.id
  $.get("/games/" + id, (game) => {
    current = parseInt(game.data.id, 10)
    var $td = $("td")
    game.data.attributes.state.forEach((data, i) => {
      if (data) {
        $td[i].innerHTML = data
        turn++
      } else {
        $td[i].innerHTML = ""
      }
    })
  })
}

function saveGame() {
  var state = []
  $("td").text((i, data) => state.push(data))
  if (current) {
    $.ajax({
      url: `/games/${current}`,
      data: {
        state: state,
        id: current
      },
      type: 'PATCH'
    })
  } else {
    $.post('/games', {state: state}, (game) => {
      current = parseInt(game.data.id, 10)
    })
  }
}

function clearGame() {
  emptyBoard()
}

function attachListeners() {
  $("td").click(function() {
    if (!this.innerHTML && !checkWinner()) {
      doTurn(this)
    }
  })
  $("#previous").click(() => showPrevious())
  $("#save").click(() => saveGame())
  $("#clear").click(() => clearGame())
}
