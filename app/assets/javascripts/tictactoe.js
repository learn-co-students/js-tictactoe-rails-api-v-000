var attachListeners = function() {
  $('td').on('click', function(event) {
    doTurn(event)
  })
  $('#save').on('click', function() {
    saveGame()
  })
  $('#previous').on('click', function() {
    loadGames()
  })
}

$(document).ready(function() {
  attachListeners()
})

var currentGame = 0
var turn = 0
const winCombinations = [
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]],
];

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function message(string) {
  $("#message")[0].innerText = string
}

function doTurn(event) {
  updateState(event)
  turn += 1
  checkWinner()
}

function updateState(event) {
  event.currentTarget.innerText = player()
}

function checkWinner() {
  winCombinations.forEach(function(combo) {
    if (readBoard(combo[0]) != '' &&
       readBoard(combo[0]) === readBoard(combo[1]) &&
       readBoard(combo[0]) === readBoard(combo[2])) {
       var winner = readBoard(combo[0])
       saveGame(true)
       resetBoard()
       return message(`Player ${winner} Won!`)
     }
  })
  if (turn === 9) {
    saveGame(true)
    resetBoard()
    return message(`Tie game`)
  } else {
    return false
  }
}

function resetBoard() {
  $('td').each(function() {
    this.innerText = ''
  })
  turn = 0
  currentGame = 0
}

function readBoard(position) {
  var x = position[0]
  var y = position[1]
  return $("td[data-x='" + x +"'][data-y='" + y +"']")[0].innerText;
}

function loadGames() {
  $('#games')[0].innerHTML =''
  $.get(
    '/games',
    function(data) {
      $.each(data['games'], function(k, v) {
        $('#games')[0].innerHTML += `<li><a href='#' class="load-game" onclick="loadGame(this)">${v.id}</a></li>`
      })
    }
  )

  //Was going to add the click events with jquery but simply adding it when the HTML is already being generated seemed to make more sense.
  // $('.load-game').each(function(index) {
  //   $(this).on('click', function() {
  //   })
  // })
}

function loadGame(thing) {
  $.get(
    '/games/' + thing.innerText,
    function(data) {
      currentGame = data.game.id
      var gameState = data.game.state
      for (let i = 0; i < gameState.length; i++) {
        $('td')[i].innerText = gameState[i]
      }
    }
  )
}

function saveGame(gameOver = false) {
  var gameState = []
  var requestType = currentGame === 0 ? "POST" : "PATCH"
  var requestURL = currentGame === 0 ? '/games' : '/games/' + currentGame


  $('td').each(function() {
    gameState.push(this.innerText)
  })

  $.ajax({
    url: requestURL,
    data: {
        'game[state]': gameState
    },
    type: requestType,

    success: function(data) {
      if (gameOver) {
        currentGame = 0
        } else {
        currentGame = data.game.id
      }
    }
  })
}
