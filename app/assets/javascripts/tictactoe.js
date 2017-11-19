var turn = 0;
var winner = ""
var token = player()
var gameId = 0

$(document).ready(function() {
  attachListeners();
})

function getValue(cell) {
  return cell.innerHTML
}

function attachListeners() {
  document.querySelector("table").addEventListener('click', function(e) {
    doTurn(e.target)
  })

  getSaveListener()

  getPreviousListener()

  document.getElementById("clear").addEventListener('click', function(e) {
    resetGame()
  })
}

function getSaveListener() {
  document.getElementById("save").addEventListener('click', function() {
    saveOrUpdate()
  })
}

function saveOrUpdate() {
  var cells = document.querySelectorAll('td')
  var values = []
  cells.forEach(function(cell) {
    values.push(getValue(cell))
  })

  if (gameId === 0 ) {
    $.post('/games',
      { state: values },
      function(data) {
        var game = this["success"]["arguments"][0]["data"]
        gameId = game["id"];
    });
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      type: 'PATCH',
      data: {state: values, id: gameId},
      success: function(data) {
        console.log(data)
      }
    })
  }
}

function getPreviousListener() {
  document.getElementById("previous").addEventListener('click', function(e) {
        $.get("/games", function(data) {
          getPreviousGame(data)
        })
    })
}

function getPreviousGame(data) {
  var previousGames = data["data"]
  var previousGameNode = document.getElementById("games");
  previousGames.forEach(function(game) {
    if (document.getElementById(game["id"]) === null) {
      previousGameNode.innerHTML += `<BUTTON id='${game["id"]}' onclick=showPreviousGame(${game["id"]})>Game ${game["id"]}</button>`
    }
  })
}

function showPreviousGame(id) {
  resetBoard()
  $.get(`/games/${id}`, function(data) {
    gameId = id
    var spots = document.querySelectorAll('td')
    var state = data["data"]["attributes"]["state"]
    for (let i = 0; i < spots.length; i++) {
      if (state[i] != "") {
        spots[i].innerHTML = state[i]
        turn += 1
      }
    };
  });
}

function player() {
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(spot) {
  if (spot.innerHTML === ""){
    updateState(spot)
    turn += 1
  }
  if (checkWinner()) {
    saveOrUpdate()
    resetGame()
  } else if(turn === 9) {
    setMessage('Tie game.')
    saveOrUpdate()
    resetGame()
  }

}

function updateState(spot) {
    spot.innerHTML = player()
}

function checkWinner() {
  if (horizontalWin() || verticalWin() || diagonalWin()) {
    var string = `Player ${winner} Won!`
    setMessage(string)
    return true
  } else {
    return false
  }
}

function setMessage(string) {
  $("#message").html(string)
}

function resetBoard() {
  turn = 0;
  var spots = document.querySelectorAll('td')
  spots.forEach(function(spot) {
    spot.innerHTML = ""
  });
}
function resetGame() {
  resetBoard()
  gameId = 0;

}

function box(num) {
  return $("table td")[num - 1].innerHTML
}

function horizontalWin() {
  if (
    box(1) != "" && box(1) === box(2) && box(1) === box(3)){
    winner = box(1)
    return true
  } else if (box(4) != "" && box(4) === box(5) && box(4) === box(6)) {
    winner = box(4)
    return true
  } else if (box(7) != "" && box(7) === box(8) && box(7) === box(9)) {
    winner = box(7)
    return true
  } else {
    return false
  }
}

function verticalWin() {
  if (
    box(1) != "" && box(1) === box(4) && box(1) === box(7)){
    winner = box(1)
    return true
  } else if (box(2) != "" && box(2) === box(5) && box(2) === box(8)) {
    winner = box(2)
    return true
  } else if (box(3) != "" && box(3) === box(6) && box(3) === box(9)) {
    winner = box(3)
    return true
  } else {
    return false
  }
}

function diagonalWin() {
  if (
    box(1) != "" && box(1) === box(5) && box(1) === box(9)){
    winner = box(1)
    return true
  } else if (box(3) != "" && box(3) === box(5) && box(3) === box(7)) {
    winner = box(3)
    return true
  } else {
    return false
  }
}

function isEven(num) {
  return num % 2 === 0;
}
