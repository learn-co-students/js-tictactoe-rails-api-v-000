// Code your JavaScript / jQuery solution here
var turn = 0
var gameId = 0
var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(msg){
  $('#message').text(msg);
}

function checkWinner(){
  var board = $('td');
  var winner = winningCombos.find((combo) => {
    return combo.every(i => board[i].innerHTML === 'X') || combo.every(i => board[i].innerHTML === 'O');
});
  if (winner) {
    setMessage(`Player ${board[winner[0]].innerHTML} Won!`);
    return true;
  } else {
    return false;
  };
}

function doTurn(square){
  updateState(square);
  turn ++;

  if (checkWinner()){
    saveGame();
    resetBoard();
  }

  if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty()
  turn = 0;
  gameId = 0;
}

function currentBoard(){
  let squares = window.document.querySelectorAll('td')
  var currentSquares = Array.prototype.map.call(squares, function(object){
    return object.innerHTML
  })
  return currentSquares
}

function saveGame() {
let gameState = {state: currentBoard()}

if (gameId === 0) {
  $.post("/games", gameState, function(resp) {
    gameId = parseInt(resp.data.id)
})
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      method: "PATCH",
      data: gameState
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
  let game = $.get(`/games/${id}`, function(resp) {
    $('td').toArray().forEach((el, index) => {el.innerHTML = resp.data.attributes.state[index]
      if (el.innerHTML != "") {turn++}})
    })
}

$(function() {
  attachListeners();
});

function attachListeners(){

  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });

  $("#save").on('click', function(e){
    e.preventDefault();
    saveGame()
  })

  $("#clear").on('click', function(e){
    e.preventDefault();
    resetBoard()
  })

  $("#previous").on('click', function(e){
    e.preventDefault();
    previousGames();
  })
}
