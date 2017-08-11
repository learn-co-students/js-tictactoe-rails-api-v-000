var turn = 0;
var winner = "";
const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];


// var player = function(){
//   if (turn % 2 === 0) {
//     return 'X';
//   } else {
//     return 'O';
//   }
// }

player = () => turn % 2 === 0 ? 'X' : 'O'

function updateState(e) {
  e.innerText = player();
}

var message = function(string) {
  $('#message').text(string)
}


var checkWinner = function() {
  var t = $('td');
  var winner = false;
  WINNING_COMBOS.some(combo => {
    if (t[combo[0]].innerText !== "" && t[combo[0]].innerText === t[combo[1]].innerText && t[combo[0]].innerText === t[combo[2]].innerText) {
      console.log("Player " + t[combo[0]].innerText + " Won!");
      message("Player " + t[combo[0]].innerText + " Won!");
      return winner = true;
    }
  })
  return winner;
}

var doTurn = function(e) {
  updateState(e);
  turn++;
  var won = checkWinner();
  if (won) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    saveGame();
    resetBoard();
    message("Tie game.");
  }
}

var resetBoard = function() {
  $('td').text((index, el) => el[index] = "");
  turn = 0;
}

var saveGame = function() {
  // save the game
}

var attachListeners = function() {
  $('#clear').on('click', () => {
    resetBoard();
    turn = 0;
  });
  $('#previous').on('click', () => {
    // show previous games
  });
  $('#save').on('click', () => {
    // save game
  });
  $('td').on('click', function() {
    console.log("cleeck!" + this.innerText)
    if (this.innerText === "" && !checkWinner() && turn < 9){
      doTurn(this);
    }
  })
}

$(function(){
  attachListeners();
})
