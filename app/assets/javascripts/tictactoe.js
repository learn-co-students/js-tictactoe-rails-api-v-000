// Code your JavaScript / jQuery solution here

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
  alert("not yet!")
}

var previousGames = () => {
  alert("previous games")
  //$.get('/games')
}

var clearGame = () => {
  $.each(squares, function(index, value) {
    squares[index].innerText = ""
  })
  $("div#message").innerText = ""
  turn = 0
}
