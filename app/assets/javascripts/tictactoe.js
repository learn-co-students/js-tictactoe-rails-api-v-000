var turn = 0;
var winCombos = [
  ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'], 
  ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'], 
  ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="1"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'], 
  ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'], 
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'], 
  ['[data-x="2"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="0"][data-y="2"]'] 
]

function attachListeners(){
  $("td").click(function(event){
    doTurn(event);
  });
}

function doTurn(event){
  updateState(event);
  turn += 1;
  checkWinner();
}

function player(){
  if (turn % 2 === 0) {
    return "X";
  }
  else {
    return "O"
  }
}

function updateState(event){
  $(event.target).text(player());
}

function message(string){
  $('#message').text(string);
}

function resetBoard(){
  turn = 0;
  $("td").each(function(index, element){
    $(this).text("")
  });    
}

function checkWinner(){
    var winner = "";
    if (winCombos.some(function(combo) { // if this function returns true, aka if there is a winning combo
      var allX = combo.every(function(element){
        return $(element).text() === "X";
      });
      var allO = combo.every(function(element){
        return $(element).text() === "O";
      });
      allX ? winner = "X" : allO ? winner = "O" : winner // set the winner variable for the message
      return allX || allO;
    })) { // call message with winner
    message("Player " + winner + " Won!");
    resetBoard();
  }
  else if (turn === 9) { // if the board is full and nobody won
    message("Tie game");
    resetBoard();
  }
  else {
    return false;
  }
}




$(document).ready(function(){
  attachListeners();
});