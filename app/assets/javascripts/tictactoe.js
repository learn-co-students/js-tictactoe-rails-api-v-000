// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners();
  })

const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

var turn = 0;

function player () {
  if (turn % 2 === 0 ){
    return `X`;
  } else {
    return `O`;
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);

}

function setMessage(message) {
  $(`#message`).text(message);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
       winner = true;
    }
  });

  return winner;
}

function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()){
    $(`td`).empty()
    turn = 0;
  } else if (turn === 9){
    setMessage(`Tie game.`)
    }
  }

  function attachListeners() {
    $(`td`).on(`click`, function() {
      if ((this.innerHTML === `` || ` ` === this.innerHTML) && checkWinner() === false && turn !== 9) {
          doTurn(this);
      };
    });
  }
