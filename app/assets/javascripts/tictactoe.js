let turn = 0
let gameId = 0

function player() {
  if(turn % 2) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner(){
  var board = $("td").toArray().map((el) => { return el.innerHTML })
  const win_combinations = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,4,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [2,4,6]
    ]

  for (let el of win_combinations) {
    if(board[el[0]] === "X" && board[el[1]] === "X" && board[el[2]] === "X") {
      setMessage("Player X Won!")
      return true
    } else if (board[el[0]] === "O" && board[el[1]] === "O" && board[el[2]] === "O") {
      setMessage("Player O Won!")
      return true
    }
  }
  return false
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
  }
}

function currentBoard() {
  let squares = window.document.querySelectorAll('td')
  var currentSquares = Array.prototype.map.call(squares, function(obj) {
    return obj.innerHTML
  })
  return currentSquares
}

function saveGame() {
  let game = {state: currentBoard()}
  let gameId = 0

  if (gameId === 0) {
    $.post("/games", game, function(resp) {
      gameId = parseInt(resp.data.id)
    })
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      method: "PATCH",
      data: game
    })
  }
}

function previousGames() {
  $('#games').empty()
  $.get("/games", function (resp) {
    resp.data.forEach(function(game) {
      $("#games").append(`<button data-id="${game.id}" onclick="savedGame(${game.id})">${game.id}</button>`).val()
    })
  })
}

function clearBoard() {
  turn = 0;
  $('td').empty()
  gameId = undefined;
}


$(document).ready(function() {
  attachListeners()
})

function attachListeners(){
  $('#save').on('click', function(e){
    e.preventDefault()
    saveGame()
  })

  $('#previous').on('click', function(e){
    e.preventDefault()
    previousGames()
  })

  $('#clear').on('click', function(e){
    e.preventDefault()
    clearBoard()
  })

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}
