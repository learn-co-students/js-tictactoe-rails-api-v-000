// Code your JavaScript / jQuery solution here
window.turn = 0;

$(function() {
  updateState();

  console.log("ready");
});

function player() {
  if (window.turn % 2 === 0) {
    window.turn += 1;
    return "X";
  } else {
    window.turn += 1;
    return "O";
  }
}

function updateState() {
  $("td").click(function() {
    let playerTurn = player();
    $(this).text(playerTurn);
    console.log(playerTurn);
    console.log("turn is " + turn);
    console.log("clicked" + " " + this.dataset.x + " " + this.dataset.y);
  });
}

function setMessage() {}

function checkWinner() {}

function doTurn() {}

function attachListeners() {}
