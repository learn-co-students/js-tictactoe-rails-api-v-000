// Code your JavaScript / jQuery solution here
var WINNING_COMBOS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

var turn = 0;

function player(){
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square){
      $(square).text(player())
      // var gamestate = []
      // gamestate =
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })

  return winner;
}

function doTurn(square){
    updateState(square);
      turn++;
  if (checkWinner()) {
    $('td').empty();
    turn = 0;
  } else if (turn === 9){
    $('td').empty();
    turn = 0;
    setMessage("Tie game.")
  }
}

function attachListeners(){
  //debugger
  $("td").click(function(){
    if (!$.text(this)&& !checkWinner()){
    doTurn(this)}
  });
}

function saveGame(){
  var save = []
  $("td").text( (index, square) => { save << square } )
}

$(document).ready(function(){
  $("#save").click(function(){

    alert("The game was saved.");
  });

  $("#previous").click(function(){
    $("#games").html("")
    $.get("/games", function(savedGames){
      console.log(savedGames)
      if (savedGames.data.length > 0){
        savedGames.data.forEach(function(game){
          $("#games").append(`<button>${game.id}</button>`)
        })
      }
    })
  });

  $("#clear").click(function(){
    alert("You started a new game.");
  });

  attachListeners()
});
