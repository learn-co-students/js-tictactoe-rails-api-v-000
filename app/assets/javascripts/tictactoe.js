// Code your JavaScript / jQuery solution here
const win_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

turn = 0;
var currentGame = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(space) {
  let token = player()
  let move = $(space)

  move.text(token)
}

function setMessage(string) {
  $("#message").text(string)
}

function getBoard() {
  return $("td").toArray().map((el) => { return el.innerHTML })
}


function saveGame() {
  let game = {"state": getBoard()}

  if (currentGame === 0 || checkWinner() === true) {
    $.post("/games", game, function(resp) {
      currentGame = parseInt(resp.data.id)
    })
  } else {
    $.ajax({
      url: `/games/${currentGame}`,
      method: "PATCH",
      data: game
    }).done(function(resp) {
      setMessage("Saved")
    })
  }
}




function clearGame() {
    $("td").toArray().forEach((el) => { el.innerHTML = "" })
    turn = 0
    currentGame = 0
  }

function loadGame(id) {
    currentGame = id

    $.getJSON(`/games/${currentGame}`, function(resp) {
        turn = resp.data.attributes.state.reduce(function(sum, el) {
          if (el !== "") {
            sum += 1
          }
          return sum
        }, 0)


        $("td").toArray().forEach((el, index) => { el.innerHTML = resp.data.attributes.state[index] })
      })
    }


function checkWinner() {
  let board = getBoard()


  for (let el of win_combos) {
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

function catsGame() {
    let board = getBoard()

  return board.every((space) => {
    return space !== ""
  });
}

function doTurn(space) {
  updateState(space)
  turn += 1
  let winner = checkWinner()
  if (winner === false && catsGame() === true) {
    setMessage("Tie game.")
    saveGame()
    clearGame()
    return
  }

  if (winner === true) {
    saveGame()
    clearGame()
    return
  }
}



function attachListeners() {
  $("td").click(function(){
  if (this.innerHTML === "" && checkWinner() === false){
    doTurn(this)
  }
  })

  $("#previous").click(function() {
    $.getJSON('/games', function(resp) {
      $("#games").empty()
      resp.data.forEach(function(game){
        $("#games").append(`<button data-id="${game.id}" onclick="loadGame(${game.id})">${game.id}</button>`)
    })
  })
})

  $("#clear").click(clearGame)

  $("#save").click(saveGame)
}

$(document).ready(function() {
  attachListeners();
});
