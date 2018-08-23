var turnCount = 0;
const winCombos= [
  [012], [345], [678], //vertical
  [036], [147], [258], //horizontal
  [048], [246]  //diagonal
]

$(document).ready(function() {
  console.log("I am ready, sir.");
  attachListeners();
})

function attachListeners() {
  // listen for click on what?
  console.log("I am listening...");
}

function player() {
  if (turnCount % 2 === 0) {
    turnCount += 1;
    return "X";
  } else {
    turnCount += 1;
    return "O";
  }
}

function updateState(element) {
  $(element).text(player());
}

function setMessage(message_string) {
  $('#message').html(message_string);
}

function checkWinner() {

}
