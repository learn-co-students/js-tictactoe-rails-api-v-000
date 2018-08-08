$(document).ready(attachListeners);

const squares = document.getElementsByTagName('td');
let turn = 0;

function attachListeners() {
  document.getElementById("save").addEventListener('click', saveGame);
  document.getElementById("previous").addEventListener('click', previousGame);
  document.getElementById("clear").addEventListener('click', clearGame);
  squares[0].addEventListener('click', doTurn, false);
  squares[1].addEventListener('click', doTurn, false);
  squares[2].addEventListener('click', doTurn, false);
  squares[3].addEventListener('click', doTurn, false);
  squares[4].addEventListener('click', doTurn, false);
  squares[5].addEventListener('click', doTurn, false);
  squares[6].addEventListener('click', doTurn, false);
  squares[7].addEventListener('click', doTurn, false);
  squares[8].addEventListener('click', doTurn, false);
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

function doTurn() {
  turn = turn + 1;
  updateState(this);
}

function saveGame() {
  document.getElementById("message").innerHTML = "testing save";
}

function previousGame() {
  document.getElementById("message").innerHTML = "testing previous";
}

function clearGame() {
  document.getElementById("message").innerHTML = "testing clear";
}
