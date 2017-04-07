tryAgain = "That move is not available. Please pick an open spot."

var winningCombinations = [
   [[0,0], [1,0], [2,0]],
   [[0,1], [1,1], [2,1]],
   [[0,2], [1,2], [2,2]],
   [[0,0], [0,1], [0,2]],
   [[1,0], [1,1], [1,2]],
   [[2,0], [2,1], [2,2]],
   [[0,0], [1,1], [2,2]],
   [[2,0], [1,1], [0,2]]
]



$(function() {
  attachListeners();
})

function attachListeners() {
$(document).on("click","td", function(e){
//  coordinate = [$(this).attr('data-x'), $(this).attr('data-y')]
  potentialSpot = $(this)
  doTurn(potentialSpot);
  });
}

//bind click listener to square
//call doTurn
//if space value is nil or an empty string 
//update value to player token

function doTurn(potentialSpot) {
  turn = 0;
  if (potentialSpot.val() === "" || !potentialSpot) {
    updateState();
    turn++;
  } else {
    message(tryAgain);
  }
}

function checkWinner() {

}

function updateState() {
  potentialSpot.val() = player(); 
}

var player = function player() {
  if (turn % 2 == 0) {
    return 'X'; //X is first player
  } else {
    return 'O';
  }
}

function message(inputString) {
  console.log(inputString);
}