$(document).ready(attachListeners);

const squares = document.getElementsByTagName('td');
//let state = Array.prototype.slice.call(squares);
let turn = 0;

function attachListeners() {
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
  squares[0].addEventListener('click', function() {
    doTurn(this);
  });
  squares[1].addEventListener('click', function() {
    doTurn(this);
  });
  squares[2].addEventListener('click', function() {
    doTurn(this);
  });
  squares[3].addEventListener('click', function(){
    doTurn(this);
  });
  squares[4].addEventListener('click', function(){
    doTurn(this);
  });
  squares[5].addEventListener('click', function(){
    doTurn(this);
  });
  squares[6].addEventListener('click', function(){
    doTurn(this);
  });
  squares[7].addEventListener('click', function(){
    doTurn(this);
  });
  squares[8].addEventListener('click',function(){
    doTurn(this);
  });
}

function checkWinner() {
  let board = [];
  for (i=0; i< 9; i++) {
    board[i] = squares[i].innerHTML;
  }
  if (board[0] !== "" && board[0] === board[1] && board[1] === board[2]) {
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[3] !== "" && board[3] === board[4] && board[4] === board[5]) {
    setMessage("Player " + board[3] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[6] !== "" && board[6] === board[7] && board[7] === board[8]) {
    setMessage("Player " + board[6] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[0] !== "" && board[0] === board[3] && board[3] === board[6]) {
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[1] !== "" && board[1] === board[4] && board[4] === board[7]) {
    setMessage("Player " + board[1] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[2] !== "" && board[2] === board[5] && board[5] === board[8]) {
    setMessage("Player " + board[2] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
    setMessage("Player " + board[0] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else if (board[6] !== "" && board[6] === board[4] && board[4] === board[2]) {
    setMessage("Player " + board[6] + " Won!");
    resetSquares();
    turn = 0;
    return true;
  } else {
    return false;
  };
}

function updateState(square) {
  square.innerHTML = player();
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(square) {


  //console.log(turn);

  //console.log(player());
  updateState(square);
  checkWinner();
  ++turn;
}

function resetSquares() {
  for (i=0; i< 9; i++) {
    squares[i].innerHTML = "";
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
