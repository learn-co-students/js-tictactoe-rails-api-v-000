// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(sq) {
  var result = player();
  sq.innerHTML = result;
}

function message(string) {
  $('div#message').append(string);
}


function checkWinner() {

  var combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]//, [0, 4, 8]] //diagonal win positions
  var sq = window.document.querySelectorAll('td')
  var win = false
  
  combos.forEach (combo => {

    if (sq[combo[0]].innerHTML == sq[combo[1]].innerHTML &&
    sq[combo[1]].innerHTML == sq[combo[2]].innerHTML) {
      win = true 
    } else {
      return false
    };
  });

  return win 
}


function doTurn() {
  turn += 1;
  updateState();
  checkWinner();
}

function attachListeners() {


}