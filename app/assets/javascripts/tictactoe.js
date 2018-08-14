$(document).ready(function () {
  attachListeners();
});

const spaces = document.getElementsByTagName('td');
//let state = Array.prototype.slice.call(squares);
var turn = 0;
var win = false;

function attachListeners() {
  document.getElementById("save").addEventListener('click', function(){
    saveGame(event);
  });
  document.getElementById("previous").addEventListener('click', function() {
    previousGame(event)
  });
  document.getElementById("clear").addEventListener('click', function() {
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
    setMessage('Tie game.');
    resetSquares();
    //console.log(turn);
    turn = 0;
    //console.log(turn);
    //turn = 0;
}

function won(square){
  setMessage("Player " + square + " Won!");
  resetSquares();
  turn = 0;
  //return true;
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

    //console.log(turn);
    //console.log(player());
    updateState(square);
    turn = turn + 1;
    checkWinner();
    //console.log(turn);
  }
}

function resetSquares() {
  for (i=0; i< 9; i++) {
    spaces[i].innerHTML = "";
  }
}

function saveGame(event) {
  event.preventDefault();
  alert("Save!");
  let state = [];
  for (i=0; i< 9; i++) {
    state[i] = spaces[i].innerHTML;
  }
  var posting = $.post('/games', {state: state});
}

function previousGame(event) {
  event.preventDefault();
  alert("Previous!");
  $.get("/games", function(data) {
    alert(data["id"]);
  });
}

function clearGame(event) {
  event.preventDefault();
  alert("Clear!");
}

function setMessage(text) {
  document.getElementById("message").innerHTML = text;
}
