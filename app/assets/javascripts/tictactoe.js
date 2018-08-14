// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners()
})

var turn = 0
const WIN_COMBINATIONS = [
 [0, 1, 2], [3, 4, 5], [6, 7, 8],
 [0, 3, 6], [1, 4, 7], [2, 5, 8],
 [0, 4, 8], [2, 4, 6]
]
var board = []
var currentGame = 0


function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $("div#message").text(string)
}


function boardState() {
  $("td").text((index, square) => board[index] = square)
  return board
}


function checkWinner() {
  let winner = false
  boardState()

  var winCombo = WIN_COMBINATIONS.find(function(combo) {
    return board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]
  })

  if (winCombo) {
    winner = true
    setMessage(`Player ${board[winCombo[0]]} Won!`)
  }
  return winner
}

function resetBoard() {
  $("td").empty()
  turn = 0
  currentGame = 0
}

function doTurn(square) {
  updateState(square)
  turn++

  var fullBoard = boardState().every(e => e != "")

  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
      saveGame()
      setMessage("Tie game.")
      resetBoard()
  }
}

function saveGame() {
  let state = []
  let gameData;

  $("td").text((index, square) => state[index] = square)
  gameData = {state: state}
  if (currentGame) {
    $.ajax({url: "/games/" + currentGame, type: "patch", data: gameData})
  } else {
    $.post("/games", gameData, function(game) {
      currentGame = game.data.id
      $("#games").append("<button data-id=" + currentGame + ">"+ currentGame +"</button>")
    })
  }

}



function previousGames(){
  $("#games").empty();

  $.get("/games", function(games) {
    games.data.forEach(buttonizePreviousGame)
  })
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameId) {
  document.getElementById('message').innerHTML = ''; //message will be used later for won or drawn games

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open("GET", `/games/${gameId}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]; //repopulate board //elements with state
        index++;
      }
    }

    turn = state.join("").length//how can you use the .length property to figure out what turn it is?
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}



function attachListeners() {
  $("td").click(function() {
    if ($(this).text() == "" && checkWinner() == false  && turn != 9)  {
      doTurn(this)
    }

    if (checkWinner() || turn === 9) {
      saveGame()
    }
  })

  $("#previous").click(function() {
    previousGames()
  })

  $("#save").click(function() {
    saveGame()
  })

  $("#clear").click(function() {
    resetBoard()
  })

  $("#games button")[0].click(function() {
    alert("I was clicked")
    debugger

    var id = $(this).data("id")
    $.get("/games/" + id, function(game) {
      game
    })
  })
}
