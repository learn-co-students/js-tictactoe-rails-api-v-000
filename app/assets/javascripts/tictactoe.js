// Code your JavaScript / jQuery solution here

var win_combinations = [[0,1,2], [3,4,5], [6,7,8],
                        [0,3,6], [1,4,7], [2,5,8],
                        [0,4,8], [2,4,6]];

var turn = 0;
var gameId = 0;


function player() {
    // Some code
    if (turn % 2) {
      return "O"
    } else {
      return "X"
    }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner(){
  var board = $("td").toArray().map((el) => { return el.innerHTML })

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

// function checkWinner() {
//   var winner = false;
//   var board = {}
//   $('td').text((index, square) => board[index] = square);
//
//   win_combinations.forEach(position => {
//     if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[0]]
//           && board[position[0]] !== "") {
//         setMessage(`Player ${board[position[0]]} Won!`)
//         return winner = true;
//           }
//   })
//     return winner;
// }

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetBoard()
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
      $("#games").append(`<button data-id="${game.id}" onclick="previousGame(${game.id})">${game.id}</button>`).val()
    })
  })
}

function previousGame(id) {
  gameId = id
  debugger
  let game = $.get(`/games/${id}`, function(resp) {
    $('td').toArray().forEach((el, index) => {el.innerHTML = resp.data.attributes.state[index]
      if (el.innerHTML != "") {turn++}})
  })
}

function resetBoard() {
  turn = 0;
  $('td').empty()
  gameId = 0;
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
    resetBoard()
  })

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}
