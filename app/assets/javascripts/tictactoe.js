// Code your JavaScript / jQuery solution here
//const squares = document.querySelectorAll("td")

var turn = 0;

var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var square = (value) => {return squares[value].innerText}

$(function() {
  attachListeners()
})

var attachListeners = () => {
  $("td").on('click', function() {
    doTurn(this)
  })

  $("button#save").on('click', function() {
    saveGame()
  })

  $("button#previous").on('click', function() {
    previousGames()
  })

  $("button#clear").on('click', function() {
    clearGame()
  })

  $(".previous-game").on('click', function() {
    alert("Clicked")
  })
}

var doTurn = (move) => {
  // if game isn't won or tied
  if (move.innerText === "") {
    updateState(move)
    turn += 1
    checkWinner()
    tieGame()
    checkReset()
  }
}

var player = () => {
  return turn % 2 === 0 ? "X" : "O"
}

var updateState = (move) => {
    $(move).text(player)
}

var setMessage = (message) => {
  $("div#message").text(message)
}

var checkWinner = () => {
  var winner = ""

  winCombinations.forEach((combo, index) => {
    if (square(combo[0]) === square(combo[1]) && square(combo[1]) === square(combo[2]) && square(combo[2]) !== "") {
      winner = square(combo[2])
    }
  })

  if (winner !== "") {
    setMessage(`Player ${winner} Won!`)
    saveGame()
  }
  return winner === "" ? false : true
}

var tieGame = () => {
  if (turn === 9 && checkWinner() === false) {
    setMessage("Tie game.")
    saveGame()
  } else {
    false
  }
}

var checkReset = () => {
  if (turn === 9 || $("div#message").text() !== "") {
    clearGame()
  }
}

var saveGame = () => {

  var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)
  var table = document.querySelector("table")

  if (table.hasAttribute("id")) {
    var id = table.getAttribute("id")
    $.post(`/games/${id}`, {_method: "PATCH", id:id, state:board})
    } else {
    $.post('/games', {state:board})
  }
}

var previousGames = () => {
  $.get('/games', function(data) {

    var gamesData = data["data"]

    if (gamesData.length > 0) {
      var buttons = "<ul>"
      gamesData.forEach(function(game) {

      buttons +=
      `<li><button type="button" class="previous-game" onclick="displayGame(${game.id})" data-id="${game.id}">${game.id}</button></li>`
      })

      buttons += "</ul>"

    } else {
      buttons = ""
    }

    $("#games").html(buttons)
  
  })
}

var displayGame = (gameId) => {

  $.get(`/games/${gameId}`, function(data) {
  var board = document.querySelectorAll("td")
  var state = data.data.attributes.state
  turn = 9 - (state.length - state.filter(String).length)
  board.forEach((space, i) => { space.innerText = state[i]})
  document.querySelector("table").setAttribute("id", gameId)
  })

}


var clearGame = () => {
  var board = Array.from(document.querySelectorAll("td"))
  board.forEach(space => (space.innerHTML = ""))

  var table = document.querySelector("table")

  if (table.hasAttribute("id")) { table.removeAttribute("id") }

  document.querySelector("div#message").innerText = ""

  turn = 0
}
