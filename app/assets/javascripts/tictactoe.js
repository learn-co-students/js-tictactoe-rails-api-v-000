// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8]];

var player = () => turn % 2 ? 'O' : 'X';

function updateState(el) {
  var token = player();
  $(el).text(token);
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message;
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, box) => board[index] = box);
  WINNING_COMBOS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player $("board[combo[0]]") Won!`);
      winner = true;
    }
  });
  return winner;
}
