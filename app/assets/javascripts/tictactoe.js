// Code your JavaScript / jQuery solution here
var turn = 0

function player() {
  if (turn % 2) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(box) {
  var t = player()
  $(box).text(t);
}

function setMessage(string) {
  $("#message").text(string);
}
