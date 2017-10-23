var WIN_COMBOS = [

  [0,1,2],

  [3,4,5],

  [6,7,8],

  [0,3,6],

  [1,4,7],

  [2,5,8],

  [0,4,8],

  [2,4,6]

];

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(square) {
  square.innerHTML = player()
  return square
}

function setMessage(string) {
  $('#message').text(string)
}

function checkWinner() {
  var board = {}
  var winner = false

  $("td").text((i, square) => board[i] = square)

  WIN_COMBOS.some((combo) => {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
       winner = true
       setMessage (`Player ${board[combo[0]]} Won!`)
     }
   })
   return winner
}

function doTurn(move) {
  updateState(move)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function saveGame() {
  var state = []
  $("td").text((i, data) => state.push(data))
  if (currentGame) {
    $.ajax({
      url: `/games/${currentGame}`,
      data: {
        state: state,
        id: currentGame
      },
      type: 'PATCH'
    })
  } else {
    $.post('/games', {state: state}, (game) => {
      currentGame = parseInt(game.data.id, 10)
    })
  }
}

function resetBoard() {
  $("td").empty()
  turn = 0
  currentGame = 0
}

function reloadGame() {
  var id = this.id
  $.get(`/games/${id}`, (game) => {
    currentGame = game["data"]["id"]
    var $td = $('td')
    game["data"]["attributes"]["state"].forEach((data, i) => {
      if (data) {
        $td[i].innerHTML = data
        turn++
      } else {
        $td[i].innerHTML = ''
      }
    })
  })
}

function previousGames() {
  $.get('/games', (previousGames) => {
    if (previousGames.data.length) {
      var $games = $("#games")[0].innerHTML
      previousGames.data.forEach((game) => {
        if (!$games.includes(game.id)) {
          $("#games").append(`<button id="${game.id}">Game ${game.id}</button>`)
        }
      })
      $("#games button").click(reloadGame)
    }
  })
}

function attachListeners() {
  $("td").click(function() {
    if (!this.innerHTML && !checkWinner()) {
      doTurn(this)
    }
  })
  $("#previous").click(() => previousGames())
  $("#save").click(() => saveGame())
  $("#clear").click(() => resetBoard())
}
