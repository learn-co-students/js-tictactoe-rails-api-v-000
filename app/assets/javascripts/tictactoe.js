// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
var win_combinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

$( document ).ready( attachListeners )

var player = () => turn % 2 === 0 ? "X" : "O"


function doTurn(td) {
  // console.log(`start turn #: ${turn}`)
  updateState(td)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    saveGame()
    setMessage("Tie game.")
    resetBoard()
    }
  }


function updateState(td) {
//console.log(`current turn #: ${turn}`)
      $(td).text(player())
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  var board = []
  var winner = false
  $("td").text(function(index, token){ board[index] = token})

  win_combinations.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
     setMessage(`Player ${board[combo[0]]} Won!`);
     return winner = true;
    }
  })
  return winner
}

function resetBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function saveGame() {
  var board = []
  $("td").text(function(index, token){ board[index] = token})
  // $("td").toArray().map(x => x.innerText)
  var boardValue = {state: board}
  debugger
  if (currentGame) {
    //console.log(`current game: ${currentGame}`)
    //for patch/update requests you need to run low level ajax query
    $.ajax({
      url: `/games/${currentGame}`,
      data: boardValue,
      type: 'patch'
    })
  } else {
    //console.log(`New game: ${currentGame}`)
    $.post( "/games", boardValue, function( game ) {
      currentGame = game.data.id
    })
  }


}

function previousGames() {
  $('#games').empty()
  $.get("/games", function(game) {
    games = game.data
    games.forEach(function(gameData) {
      $('#games').append(`<button id="gameid-${gameData.id}">${gameData.id}</button><br>`)
      $(`#gameid-${gameData.id}`).on('click',function() {

          $.get(`/games/${gameData.id}`, function(gameData) {
              var gameData2 = gameData.data.attributes.state
            $('td').empty()
            $("td[data-x=0][data-y=0]").append(gameData2[0])
            $("td[data-x=1][data-y=0]").append(gameData2[1])
            $("td[data-x=2][data-y=0]").append(gameData2[2])
            $("td[data-x=0][data-y=1]").append(gameData2[3])
            $("td[data-x=1][data-y=1]").append(gameData2[4])
            $("td[data-x=2][data-y=1]").append(gameData2[5])
            $("td[data-x=0][data-y=2]").append(gameData2[6])
            $("td[data-x=1][data-y=2]").append(gameData2[7])
            $("td[data-x=2][data-y=2]").append(gameData2[8])

            gameData2.forEach(function(token) {
              if (token != "") {
                debugger
                turn = turn + 1
              }
            })

          })
          currentGame = gameData.id
      })
    }
    )
  })
}


function attachListeners() {
  $("td").on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })

  $("#save").on('click', function() {
    saveGame()
  })

  $("#previous").on('click', function() {
    previousGames()
  })

  $("#clear").on('click', function() {
    resetBoard()
  })

}
