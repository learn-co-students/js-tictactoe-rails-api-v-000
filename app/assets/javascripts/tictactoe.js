// Code your JavaScript / jQuery solution here

var turn = 0;

var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(function() {
  attachListeners()
})

var attachListeners = () => {
  $("td").on('click', function() {
    if (!this.innerText && !checkWinner()) {
      doTurn(this)
    }
  })

  $("button#save").on('click', function() {
    saveGame()
  })

  $("button#previous").on('click', function() {
    previousGames()
  })

  $("button#clear").on('click', function() {
    resetBoard()
  })

  $(".previous-game").on('click', function() {
    alert("Clicked")
  })
}

var doTurn = (move) => {
  // if game isn't won or tied
  updateState(move)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
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
  var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)

  winCombinations.forEach((combo, index) => {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[2]] !== "") {
      winner = board[combo[2]]
    }
  })

  if (winner !== "") {
    setMessage(`Player ${winner} Won!`)
  }
  return winner === "" ? false : true
}

var saveGame = () => {
  var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)
  var table = document.querySelector("table")
  if (table.hasAttribute("id")) {
    var id = table.getAttribute("id")
    $.ajax({url:`/games/${id}`, type:'PATCH', data:{id:id, state:board}});
    } else {
    $.post('/games', {state:board})
  }
}

var previousGames = () => {
  $.get('/games', function(data) {
    var gamesData = data["data"]
    if (gamesData.length > 0) {
      var buttons = ""
      gamesData.forEach(function(game) {
      buttons += `<button type="button" class="previous-game" onclick="displayGame(${game.id})" data-id="${game.id}">${game.id}</button>`
      })
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


var resetBoard = () => {
  var board = Array.from(document.querySelectorAll("td"))
  board.forEach(space => (space.innerHTML = ""))
  var table = document.querySelector("table")
  if (table.hasAttribute("id")) { table.removeAttribute("id") }
  setMessage("")
  turn = 0
}
