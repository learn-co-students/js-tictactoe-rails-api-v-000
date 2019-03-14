// Code your JavaScript / jQuery solution here



let turn = 1

let board = ['','','','','','','','','']

function fill_board() {
  board[0] = $('table td[data-x=' + 0 + '][data-y=' + 0 + ']')[0].innerHTML
  board[1] = $('table td[data-x=' + 1 + '][data-y=' + 0 + ']')[0].innerHTML
  board[2] = $('table td[data-x=' + 2 + '][data-y=' + 0 + ']')[0].innerHTML
  board[3] = $('table td[data-x=' + 0 + '][data-y=' + 1 + ']')[0].innerHTML
  board[4] = $('table td[data-x=' + 1 + '][data-y=' + 1 + ']')[0].innerHTML
  board[5] = $('table td[data-x=' + 2 + '][data-y=' + 1 + ']')[0].innerHTML
  board[6] = $('table td[data-x=' + 0 + '][data-y=' + 2 + ']')[0].innerHTML
  board[7] = $('table td[data-x=' + 1 + '][data-y=' + 2 + ']')[0].innerHTML
  board[8] = $('table td[data-x=' + 2 + '][data-y=' + 2 + ']')[0].innerHTML
}

// ALL OF THE WINNING COMBINATIONS
winningCombos =  [
  [0,1,2],            // Top-row
  [0,3,6],            // Left column
  [0,4,8],            // T-left-B-right
  [1,4,7],            // Middle column
  [2,5,8],            // Right column
  [2,4,6],            // T-right-B-left
  [3,4,5],            // Middle row
  [6,7,8],            // Bottom row
]

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
};

function updateState(position) {
  position.innerHTML = player()
};

function setMessage(message) {
  $('div#message')[0].innerHTML = message
};


function checkWinner() {
  fill_board()
  win_bool = false;

  for(i=0; i< winningCombos.length; i++) {
    if (board.every(el => el === "")) {
      win_bool = false
    } else if (board[winningCombos[i][0]] === board[winningCombos[i][1]] &&
               board[winningCombos[i][1]] === board[winningCombos[i][2]]) {
        win_bool =  true
        //debugger;
        setMessage(`Player ${player()} Won!`);
    }
  }

  return win_bool
  // win_bool = winningCombos.every( function(combo) {
  //   board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]
  //   debugger;
  // })
  // debugger;
}

function doTurn () {};

function attachListeners() {};



$(function() {

})
