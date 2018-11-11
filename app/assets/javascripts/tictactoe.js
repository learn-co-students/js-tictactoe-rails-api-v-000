// Code your JavaScript / jQuery solution here

// button#save
// button#previous
// button#clear

let turn = 0;
let winner;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}


function updateState(space) {
  $(space).text(player())
}


function setMessage(winner) {
  $("#message").text(`Player ${winner} Won!`)
}


function checkWinner() {
  // if() {
  //   setMessage(winner);
  //   return true
  // }; else {
  //   return false
  // };
}


function doTurn() {
  ++turn;
  updateState();
  // need to pass in clicked element above
  checkWinner();
}


function attachListeners() {

}
