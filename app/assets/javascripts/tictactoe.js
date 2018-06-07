const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var currentGame = 0,
    turn = 0;

$(document).ready(() => attachListeners())

function attachListeners() {
  $('td').on("click", function(){
    if (this.innerHTML === "" && !checkWinner()){
      doTurn(this)
    }
  })

  $("#clear").on("click", () => clearBoard());
  $("#previous").on("click", () => previousGames());
  $("#save").on("click", () => saveGame());
}

function previousGames() {
  $.get( "/games", resp => {
    var games = resp["data"]
    $('#games').empty()

    games.forEach(game => {
      $( "div#games" ).append(`<button id="gameid-${game.id}">${game.id}</button>`);
      $(`#gameid-${game.id}`).on('click', () => loadGame(game));
    })
  });
}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  if (currentGame === 0){
    $.post("/games", {state: state}, game => currentGame = game.data.id)
  } else {
    $.ajax({
      method: "PATCH",
      url: `/games/${currentGame}`,
      data: {state: state}
    })
  }
}

function loadGame(game) {
  $.get(`/games/${game.id}`, resp => {
    let state = resp.data.attributes.state;
    turn = state.filter(position => position !== "").length
    currentGame = resp.data.id

    for(let i = 0; i < 9; i++){
      $('td')[i].innerHTML = state[i]
    }
  })
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(square) {
  $(square).text(player);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false,
      board = {};

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(position => {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  }
}
