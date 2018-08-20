// Code your JavaScript / jQuery solution here
$(document).ready(attachListeners)

const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var board = Array.from($('td')).map(s => s.innerHTML)
var turn = 0
var currentGame = 0

function currentBoard() {
  var board = []
  $("td").each(function (i) {
    board.push($(this).text())
  })
  return board
}

var getPreviousGames = function() {
  $.getJSON("/games", function(data) {
    showPreviousGames(data["data"])
  })
}

var showPreviousGames = function(games) {
  var gameList = $()
  games.forEach(function(game) {
    gameList = gameList.add(showGame(game))
  })
  $("#games").html(gameList)
}

var showGame = function(game) {
  //buttons = buttons.add(`<button data-gameid='${id}' data-state='${state}' onclick='previousGame(this.getAttribute(${id}), this.getAttribute("${state}"))'>Game: ${id}</button><br>`)
  var newGame = $(`<button data-state='${game.attributes.state}' data-gameid='${game.id}'>Game: ${game.id}</button><br>`)
  newGame.click(function () {
    previousGame(this.getAttribute("data-gameid"), this.getAttribute("data-state"))

  })
  return newGame
}

$(function () {
  $("#save").on("click", function (e) {
    saveGame()
  })
})

var saveGame = function(winOrDraw) {
  var url
  var method

  if (currentGame) {
    var url = "/games/" + currentGame
    var method = "PATCH"
  } else {
    var url = "/games"
    var method = "POST"
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: currentBoard()
      }
    },
    success: function(data) {
      if(winOrDraw) {
        resetBoard();
      } else {

        currentGame = data["data"].id;
      }
    }
  })
}

//$(function () {
//  $("#previous").on("click", function (e) {
//    e.preventDefault();
//    getPreviousGames()
    //$.getJSON("/games", function(data) {
      //var games = data["data"]
    //  debugger
    //  var buttons = $()
    //  for (var i = 0; i < data["data"].length; i++) {
    //    var id = data["data"][i].id
    //    var state = data["data"][i].attributes.state
    //    buttons = buttons.add(`<button data-gameid='${id}' data-state='${state}' onclick='previousGame(this.getAttribute(${id}), this.getAttribute("${state}"))'>Game: ${id}</button><br>`)
    //  }
    //  $("#games").html(buttons)
    //})
//})

$(function () {
  $("#clear").on("click", function (e) {
    e.preventDefault();
    resetBoard();
  })
})

function previousGame(gameId, previousState) {
  resetBoard()

  var currentState = previousState.split(",")
  turn = currentState.length
  currentGame = gameId
  var i = 0
  $("td").each(function () {
    this.append(currentState[i])
    i++
  })
}

//Begin helper functions


function positionTaken(index) {
  if (currentBoard()[index] !== "") { return true }
  else { return false }
}

function won(array) {
  //debugger
  if (positionTaken(array[0]) == true) {
    if (currentBoard()[array[0]] == currentBoard()[array[1]] && currentBoard()[array[0]] == currentBoard()[array[2]] &&
    currentBoard()[array[1]] == currentBoard()[array[2]]) { return true }
      else { return false }
  } else { return false }
}

function resetBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function fullBoard() {
  let notFull = function(e) {
    return e == ""
  }
  return !currentBoard().some(notFull)
}

function tieGame() {
  if (fullBoard() == true && checkWinner() == false) {
    return true
  } else {
    return false
  }
}

//function over() {
//
//}

//End Helper Functions



function newGame() {

}

function player() {
  if (this.turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(cell) {
  let token = player()
  cell.innerHTML = token
}

function setMessage(string) {
  $("#message").html(string)
}


function checkWinner() {
  for (var i = 0; i < winCombinations.length; i++) {
    if (won(winCombinations[i]) == false) {
      continue
    } else {
      if (currentBoard()[winCombinations[i][0]] == 'X') {
        setMessage('Player X Won!')
      } else if (currentBoard()[winCombinations[i][0]] == 'O') {
        setMessage('Player O Won!')
      }
      return true
      break
    }
  }
  return false
}

function doTurn(cell) {
  if (cell.innerHTML == "") {
    updateState(cell)
    if (checkWinner() == true) {
      checkWinner()
      saveGame(true)
      resetBoard()
    } else if (tieGame() == true) {
        setMessage('Tie game.')
        saveGame(true)
        resetBoard()
      } else {
        this.turn += 1
      }
    }
  }

function attachListeners() {
  let tds = document.querySelectorAll('td')
  for (let i = 0; i < tds.length; i++) {
    tds[i].addEventListener('click', function () {
      doTurn(tds[i])
    })
  }

  $('#previous').click(function(event) {
    getPreviousGames();
  });

  $('#save').click(function(event) {
    saveGame();
  });

  $("#previous").click(function() {
    getPreviousGames();
  });
}
