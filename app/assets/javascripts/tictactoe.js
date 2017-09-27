// Code your JavaScript / jQuery solution here
$(function () {
  attachListeners();
})

var turn = 0

function player() {
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}

function isEven(num) {
  if (num % 2 === 0) {
    return true;
  }
  else {
    return false;
  }
}

function doTurn() {
  $(this).text(player());
  turn += 1
}

function updateState() {

}

function setMessage() {

}

function checkWinner() {

}

function attachListeners() {
  $("#ttt tbody tr").on("click", "td", doTurn);
}
