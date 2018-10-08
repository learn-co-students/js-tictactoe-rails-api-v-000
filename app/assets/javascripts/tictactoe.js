// Code your JavaScript / jQuery solution here
//const squares = document.querySelectorAll("td")

var turn = 0;

const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

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

  $(".load-game").on('click', function() {
    displayGame()
  })

}

var doTurn = (move) => {
  if (move.innerText === "") {
    updateState(move)
    checkWinner()
    turn += 1
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
  $.each(winCombinations, function(index, value) {
    if (square(value[0]) === square(value[1]) && square(value[1]) === square(value[2]) && square(value[2]) !== "") {
      winner = square(value[2])
    }
  })
  if (winner !== "") {setMessage(`Player ${winner} Won!`)}
  return winner === "" ? false : true
}

var tieGame = () => {
  return turn === 9 && checkWinner() === false ? setMessage("Tie game.") : false
}

var checkReset = () => {
  if (turn === 9 || $("div#message").text() !== "") {
    clearGame()
  }
}

var saveGame = () => {
  var board = Array.from(document.querySelectorAll("td")).map(x => x.innerHTML)

  $.post('/games', {state:board})
}

var previousGames = () => {
  $.get('/games', function(data) {
    gamesData = data["data"]
    if (gamesData.length > 0) {
      var buttons = "<ul>"
      $.each(gamesData, function(i, v) {
      buttons += `<li><button class="load-game" data-id="${gamesData[i]["id"]}">${gamesData[i]["id"]}</button></li>`
      })
      buttons += "</ul>"
    } else {
      buttons = ""
    }
    $("#games").html(buttons)
  })
}

var displayGame = () => {
  // var id = $(this).data("id")
  // alert(`${id}`)
//   //var board = document.querySelectorAll("td")
//   //var state = ["L", "U", "V", "", "U", "", "L", "O", "T"]
//   //$.each(board, (i) => {board[i].innerText = state[i]} )
}

var clearGame = () => {
  $.each(squares, function(index, value) {
    squares[index].innerText = ""
  })
  $("div#message").innerText = ""
  turn = 0
}
