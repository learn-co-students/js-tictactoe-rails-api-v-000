$(document).ready(function() {
  attachListeners()
})

function attachListeners () {
 $("td").on("click", function() {
   if($(this).is(':empty') && !checkWinner()) {
   doTurn(this)
   }
 })

 $("button#save").on("click", () => saveGame())
 $("button#previous").on("click", () => previousGame())
 $("button#clear").on("click", () => clearGame())
}



var WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0
var currentGame = 0

function player() {
  if (turn%2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(td) {
  return td.innerHTML = player()
}

function setMessage(message) {
  $("div#message").append(message)
}


  function checkWinner() {
  let board = []
  let winner = false
  $("td").text(function(index, token){
    board[index] = token
  })

    WIN_COMBOS.forEach(function(combo){
    if (board[combo[0]]=== board[combo[1]] && board[combo[1]]=== board[combo[2]] &&
      board[combo[0]]!== ""
    ){
      setMessage(`Player ${board[combo[0]]} Won!`)
      winner = true
    }
  })
    return winner
}

  function doTurn(square) {
    updateState(square)
    turn += 1;

    if (checkWinner()){
      saveGame()
      clearGame()
    }
    else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      clearGame()
    }
  }

  function currentBoard() {
    let state = []
    $("td").text((index, square) => {
      state.push(square)
    })
    return state
  }

  function saveGame() {
    let gameData = { state: currentBoard() }
    let updatedTime = {updated_at: time.now}
    if (currentGame === 0) {
      $.post("/games", gameData, game => {
        currentGame = game.data.id
      })
    }
    else {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: "gameData"
    })
  }
}

  function clearGame() {
    $('td').empty()
    turn = 0
    currentGame = 0
  }

function previousGame() {
  $("#games").empty()
  $.get("/games", gamesAll => {
    gamesAll.data.forEach(game => {
      $("#games").append(
        `<button id="gameid-${game.id}">${game.id}</button><br>`
      )
      $(`#gameid-${game.id}`).on("click", () => loadGame(game.id))
    })
  })
}

function clearGame() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function loadGame(gameId) {
  $("#message").text("");
  $.get(`/games/${gameId}`).done(response => {
    currentGame = response.data.id;
    let state = response.data.attributes.state;
    turn = state.join("").length;
    let i = 0;
    state.forEach(e => {
      $("td")[i].innerHTML = e;
      i++;
    });
  });
}
