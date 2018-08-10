$(document).ready(function () {
  attachListeners();
});

const spaces = document.getElementsByTagName('td');
//let state = Array.prototype.slice.call(squares);
var turn = 0;

function attachListeners() {
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
  spaces[0].addEventListener('click', function() {
    doTurn(this);
  });
  spaces[1].addEventListener('click', function() {
    doTurn(this);
  });
  spaces[2].addEventListener('click', function() {
    doTurn(this);
  });
  spaces[3].addEventListener('click', function(){
    doTurn(this);
  });
  spaces[4].addEventListener('click', function(){
    doTurn(this);
  });
  spaces[5].addEventListener('click', function(){
    doTurn(this);
  });
  spaces[6].addEventListener('click', function(){
    doTurn(this);
  });
  spaces[7].addEventListener('click', function(){
    doTurn(this);
  });
  spaces[8].addEventListener('click',function(){
    doTurn(this);
  });
}

function checkWinner() {
  let won = false;
  let board = [];
  for (i=0; i< 9; i++) {
    board[i] = spaces[i].innerHTML;
  }
  if (board[0] !== "" && board[0] === board[1] && board[1] === board[2]) {
    won = true;
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[3] !== "" && board[3] === board[4] && board[4] === board[5]) {
    won = true;
    setMessage("Player " + board[3] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[6] !== "" && board[6] === board[7] && board[7] === board[8]) {
    won = true;
    setMessage("Player " + board[6] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[0] !== "" && board[0] === board[3] && board[3] === board[6]) {
    won = true;
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[1] !== "" && board[1] === board[4] && board[4] === board[7]) {
    won = true;
    setMessage("Player " + board[1] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[2] !== "" && board[2] === board[5] && board[5] === board[8]) {
    won = true;
    setMessage("Player " + board[2] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
    won = true;
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[6] !== "" && board[6] === board[4] && board[4] === board[2]) {
    won = true;
    setMessage("Player " + board[6] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else {
    if (turn === 9) {
      setMessage('Tie game.');
      resetSquares();
      console.log(turn);
      turn = 0;
      console.log(turn);
      turn = 0;
    }
    return false;
  };
}

function updateState(square) {
  square.innerHTML = player();
}

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(square) {
  if (square.innerHTML === "" && (won !== true && turn !== 9)) {

    console.log(turn);
    //console.log(player());
    updateState(square);
    turn = turn + 1;
    checkWinner();
    console.log(turn);
  }
}

function resetSquares() {
  for (i=0; i< 9; i++) {
    spaces[i].innerHTML = "";
  }
}

function saveGame() {
  setMessage("testing save");
}

function previousGame() {
  setMessage("testing previous");
}

function clearGame() {
  setMessage("testing clear");
}

function setMessage(text) {
  document.getElementById("message").innerHTML = text;
}
