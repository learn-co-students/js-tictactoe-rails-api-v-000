$(document).ready(function () {
  attachListeners();
});

const spaces = document.getElementsByTagName('td');
var turn = 0;
var win = false;

function attachListeners() {
  document.getElementById("save").addEventListener('click', function(event){
    saveGame(event);
  });
  document.getElementById("previous").addEventListener('click', function(event) {
    previousGame(event)
  });
  document.getElementById("clear").addEventListener('click', function(event) {
    clearGame(event)
  });
  for (i=0; i< 9; i++) {
    spaces[i].addEventListener('click', function() {
      doTurn(this);
    });
  }
}

function checkWinner() {
  let board = [];
  for (i=0; i< 9; i++) {
    board[i] = spaces[i].innerHTML;
  }
  if (board[0] !== "" && board[0] === board[1] && board[1] === board[2]) {
    won(board[0]);
    return true;
  } else if (board[3] !== "" && board[3] === board[4] && board[4] === board[5]) {
    won(board[3]);
    return true
  } else if (board[6] !== "" && board[6] === board[7] && board[7] === board[8]) {
    won(board[6]);
    return true;
  } else if (board[0] !== "" && board[0] === board[3] && board[3] === board[6]) {
    won(board[0]);
    return true;
  } else if (board[1] !== "" && board[1] === board[4] && board[4] === board[7]) {
    won(board[1]);
    return true;
  } else if (board[2] !== "" && board[2] === board[5] && board[5] === board[8]) {
    won(board[2]);
    return true;
  } else if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
    won([board[0]]);
    return true;
  } else if (board[6] !== "" && board[6] === board[4] && board[4] === board[2]) {
    won(board[6]);
    return true;
  } else {
    if (turn === 9) {
      tie();
    }
    return false;
  };
}

function tie(){
    saveGame();
    setMessage('Tie game.');
    resetSquares();
    turn = 0;
}

function won(square){
  saveGame();
  setMessage("Player " + square + " Won!");
  resetSquares();
  turn = 0;
}

function updateState(square) {
  square.innerHTML = player();
}

function player() {
  if (turn % 2 == 0) {
    return "X" }
  else {
    return "O" }
}

function doTurn(square) {
  if (square.innerHTML === "" && (win !== true && turn !== 9)) {
    updateState(square);
    turn = turn + 1;
    checkWinner();
  }
}

function resetSquares() {
  for (i=0; i< 9; i++) {
    spaces[i].innerHTML = "";
  }
}

function saveGame() {
  let state = [];
  for (i=0; i< 9; i++) {
    state[i] = spaces[i].innerHTML;
  }
  var posting = $.post('/games', {state: state});
  posting.done(function(data){
    //var game = data;
    console.log(data);
    //$("#games").text(games[0]["id"]);
  });
}

function previousGame() {
  $.get("/games", function(data){
      var games = data;
      for (i=0; i< games["data"].length; i++) {
          $("#games").append("<button>" + games["data"][i]["id"] + "</button>");
        }
  });
}

function clearGame() {
  //event.preventDefault();
  //alert("Clear!");
}

function setMessage(text) {
  document.getElementById("message").innerHTML = text;
}
