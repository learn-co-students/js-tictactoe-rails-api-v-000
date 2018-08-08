$(document).ready(attachListeners);

const squares = document.getElementsByTagName('td');
let turn = 0;

function attachListeners() {
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
  squares[0].addEventListener('click', doTurn);
  squares[1].addEventListener('click', doTurn);
  squares[2].addEventListener('click', doTurn);
  squares[3].addEventListener('click', doTurn);
  squares[4].addEventListener('click', doTurn);
  squares[5].addEventListener('click', doTurn);
  squares[6].addEventListener('click', doTurn);
  squares[7].addEventListener('click', doTurn);
  squares[8].addEventListener('click', doTurn);
}

function checkWinner() {
  let board = [];
  for (let i=0; i<9; i++) {
    board[i] = squares[i].innerHTML;
  }
  if (board[0] !== "" && board[0] === board[1] && board[1] === board[2]) {
    setMessage("Player " + board[0] + " Won!");
    return true;
  } else if (board[3] !== "" && board[3] === board[4] && board[4] === board[5]) {
    setMessage("Player " + board[3] + " Won!");
    return true;
  } else if (board[6] !== "" && board[6] === board[7] && board[7] === board[8]) {
    setMessage("Player " + board[6] + " Won!");
    return true;
  } else if (board[0] !== "" && board[0] === board[3] && board[3] === board[6]) {
    setMessage("Player " + board[0] + " Won!");
    return true;
  } else if (board[1] !== "" && board[1] === board[4] && board[4] === board[7]) {
    setMessage("Player " + board[1] + " Won!");
    return true;
  } else if (board[2] !== "" && board[2] === board[5] && board[5] === board[8]) {
    setMessage("Player " + board[2] + " Won!");
    return true;
  } else if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
    setMessage("Player " + board[0] + " Won!");
    return true;
  } else if (board[6] !== "" && board[6] === board[4] && board[4] === board[2]) {
    setMessage("Player " + board[6] + " Won!");
    return true;
  } else {
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

function doTurn() {
  turn = turn + 1;
  updateState(this);
  checkWinner();

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
