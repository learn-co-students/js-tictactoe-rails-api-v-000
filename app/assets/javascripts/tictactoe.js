// Code your JavaScript / jQuery solution here
let turn;

$(document).ready(attachListeners);

function player() {
  if(turn % 2 == 0){
  return "X";
} else {
    return "O";
  };
};

function updateState() {
let token = player();


};

function setMessage() {

};

function checkWinner() {

};

function doTurn() {
  debugger;
  alert(`${this}`);
turn++;
updateState(this);
checkWinner();

};

function saveGame() {
alert()
};

function clearGame() {
alert("text")
};

function previousGame() {

};

function attachListeners() {
  $("td").click(function () {
    doTurn.call(this);
  });
  $("#save").click(saveGame);
  $("#previous").click(previousGame);
  $("#clear").click(clearGame);
};
