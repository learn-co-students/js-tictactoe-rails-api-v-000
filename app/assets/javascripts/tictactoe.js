// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var current_game = 0

var turn = 0;

$(document).ready(function() {
  attachListeners()
})

function attachListeners() {
  $('td').on("click", function(){
    if (this.innerHTML === "" && !checkWinner()){
      doTurn(this)
    }
  })

  $("#clear").on("click", function(){
    clearBoard();
  })

  $("#previous").on("click", function(){
    previousGames();
  })

  $("#save").on("click", function(){
    saveGame();
  })

}

function previousGames() {
  $.get( "/games", function(resp) {
    var games = resp["data"]
    $('#games').empty()
    games.forEach( function(game) {
      $( "div#games" ).append(`<button id="gameid-${game.id}">${game.id}</button>`);
      $(`#gameid-${game.id}`).on('click', function(){
        loadGame(game);
      })
    })
  });
}

function saveGame() {
  var state = [];
  $('td').text((index, square) => {
    state.push(square);
  });
  console.log(current_game);
  if (current_game === 0){
    $.post("/games", {state: state}, function(game) {
      current_game = game.data.id
    })
  } else {
    $.ajax({
      method: "PATCH",
      url: `/games/${current_game}`,
      data: {state: state}
    })
  }
}

function loadGame(game) {
  $.get(`/games/${game.id}`, function(resp) {
    let state = resp.data.attributes.state;
    turn = state.filter(position => position !== "").length
    current_game = resp.data.id
    for(let i = 0; i < 9; i++){
      $('td')[i].innerHTML = state[i]
    }
  })
}

function clearBoard() {
  $('td').empty();
  turn = 0;
  current_game = 0; //change current_game to currentGame
}

function player() {
  if (turn % 2 === 0) {
    return 'X';
} else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  var board = {};

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] ===
      board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`);
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {//{$('td').empty();
    //turn = 0;
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
