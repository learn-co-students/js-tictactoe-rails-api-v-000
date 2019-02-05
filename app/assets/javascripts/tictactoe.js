window.onload = () => {
  attachListeners();
  doTurn();
};

var turn = 0;
var squares = ['X', 'O', 'X', 'X', 'O', 'X', 'O', '', 'O'];

function player() {
  console.log("player fires");
  return turn % 2 === 0 ? "X" : "O";
}

function updateState() {
  console.log("updateState fires");
  squares[x].push(player());
  // document.getElementById("").innerHTML = player();
}

function setMessage(string) {
  console.log("setMessage fires");
  document.getElementById("message").innerHTML = string;
}

function checkWinner() {
  console.log("checkWinner fires");
  console.log("squares=", squares);
  if (
    squares[0] !== "" &&
    squares[0] === squares[1] &&
    squares[1] === squares[2]
  ) {
    return true;
  } else if (
    squares[3] !== "" &&
    squares[3] === squares[4] &&
    squares[4] === squares[5]
  ) {
    return true;
  } else if (
    squares[6] !== "" &&
    squares[6] === squares[7] &&
    squares[7] === squares[8]
  ) {
    return true;
  } else if (
    squares[1] !== "" &&
    squares[0] === squares[3] &&
    squares[3] === squares[6]
  ) {
    return true;
  } else if (
    squares[1] !== "" &&
    squares[1] === squares[4] &&
    squares[4] === squares[7]
  ) {
    return true;
  } else if (
    squares[2] !== "" &&
    squares[2] === squares[5] &&
    squares[5] === squares[8]
  ) {
    return true;
  } else if (
    squares[6] !== "" &&
    squares[6] === squares[7] &&
    squares[7] === squares[8]
  ) {
    return true;
  } else if (
    squares[0] !== "" &&
    squares[0] === squares[4] &&
    squares[4] === squares[8]
  ) {
    return true;
  } else if (
    squares[2] !== "" &&
    squares[2] === squares[4] &&
    squares[4] === squares[6]
  ) {
    return true;
  } else {
    return false;
  }
}

function doTurn() {
  console.log("doTurn fires");
  turn++;
  updateState();
  checkWinner();
}

function attachListeners() {
  document.getElementById("save").addEventListener("click", saveGame);
  document.getElementById("previous").addEventListener("click", previousGame);
  document.getElementById("clear").addEventListener("click", clearGame);
  // let tableRow = document.getElementsByTagName("tr");
  // tableRow.getElementsByTagName("td").addEventListener("click", doTurn)
}

function saveGame() {
  console.log("saveGame fires");
}

function previousGame() {
  console.log("previousGame fires");
}

function clearGame() {
  console.log("clearGame fires");
}