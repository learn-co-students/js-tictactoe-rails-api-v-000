// // Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});

var win_combinations = [
// var winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0
var currentGame = 0

function attachListeners() {
  $("td").on("click", function() {
    if($(this).text() == "" && !checkWinner() && !tiedGame()) {
      doTurn(this)
    }
  })
  $('#clear').on('click', clearGame)
  $("#previous").on("click", previousGame)
  $("#save").on("click", saveGame)
}

function player() {
  return turn % 2 ? "O" : "X"
}

function updateState(square) {
  let token = player()
  $(square).append(token)
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  let won = false
  let board = currentBoard()
  win_combinations.forEach(function(combo) {
    if(board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]] && board[combo[0]] != ""){
    won = true
    let token = board[combo[0]]
    setMessage(`Player ${token} Won!`)
  }
  })
  return won
}

function tiedGame() {
  let board = currentBoard()
  let tied = false
  if(!board.includes('')){
    tied = true
  }
  return tied
}

function doTurn(square){
  let board = currentBoard()
  updateState(square)
  ++turn
  if(checkWinner()) {
    saveGame()
    clearGame()
  }else if(tiedGame()) {
    setMessage("Tie game.")
    saveGame()
    clearGame()
  }
}


function saveGame() {
  board = currentBoard()
  gameData = {state: board}
  if(currentGame) {
    $.ajax({url:`/games/${currentGame}`, type: 'PATCH', data: gameData})
    console.log("editing with patch request")
  }else {
  $.post("/games", gameData, function(data) {
      currentGame = (data["data"]["id"])
      console.log("saving with post request")
    })
  }
}

function previousGame() {
  $.get("/games", function(data) {
    data.data.forEach(createButton)
  })
}

  // function populateBoard(game) {
  //   arr = game.attributes.state
  //   for (let i = 0; i < 9; i++) {
  //     $(`td:eq(${i})`).text(arr[i])
  //   }
  // }

function createButton(game) {
  if(!document.getElementById(`game-id-${game.id}`)){
    $('#games').append(`<button id="game-id-${game.id}">${game.id}</button><br>`)
    $(`#game-id-${game.id}`).on("click", function() {
      // populateBoard(game)
      reloadGame(game.id)
    })
  }
}

function clearGame() {
    $('td').empty();
    turn = 0
    currentGame = 0
}

function currentBoard() {
  let board = []
  $('td').text((index, position) => {
  board.push(position);
});
  return board
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
