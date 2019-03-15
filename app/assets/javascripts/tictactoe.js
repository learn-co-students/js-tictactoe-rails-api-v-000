// Code your JavaScript / jQuery solution here

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

var turn = 0
var board = [ '', '', '', '', '', '', '', '', '' ]

function reset_game() {
  turn = 0;
  window.turn = 0;
  board = [ '', '', '', '', '', '', '', '', '' ];
  empty_board();
}

function empty_board() {
  $('table td[data-x=' + 0 + '][data-y=' + 0 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 1 + '][data-y=' + 0 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 2 + '][data-y=' + 0 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 0 + '][data-y=' + 1 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 1 + '][data-y=' + 1 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 2 + '][data-y=' + 1 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 0 + '][data-y=' + 2 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 1 + '][data-y=' + 2 + ']')[0].innerHTML = ''
  $('table td[data-x=' + 2 + '][data-y=' + 2 + ']')[0].innerHTML = ''
}

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

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
};

function updateState(position) {
  if (position.innerHTML === 'X' || position.innerHTML === 'O' ) {
    turn -= 1
  } else {
    position.innerHTML = player()
  }
};

function setMessage(message) {
  $('div#message')[0].innerHTML = message
};

function has_winning_combo() {
  for(i=0; i< winningCombos.length; i++) {
    if ((board[winningCombos[i][0]].toLowerCase() === 'x' &&
         board[winningCombos[i][1]].toLowerCase() === 'x' &&
         board[winningCombos[i][2]].toLowerCase() === 'x')) {

      setMessage(`Player X Won!`);
      return true

    } else if ((board[winningCombos[i][0]].toLowerCase() === 'o' &&
                board[winningCombos[i][1]].toLowerCase() === 'o' &&
                board[winningCombos[i][2]].toLowerCase() === 'o')) {

      setMessage(`Player O Won!`);
      return true
    }
  }
}

function is_a_tied_game() {
  if (!has_winning_combo() && board.every(el => el.toLowerCase() === "x" || el.toLowerCase() === "o")) {
    return true
  }
}

function checkWinner() {
  win_bool = false;
  fill_board()

  if (board.every(el => el === "")) {
    win_bool = false

  } else if (has_winning_combo()) {
    win_bool = true
    reset_game()

  } else if (is_a_tied_game()) {
    setMessage(`Tie game.`)
  }
  return win_bool
}

function doTurn (position) {
  updateState(position)
  checkWinner()
  turn += 1
}

function attachListeners() {
  $('table td').on('click', function() {
    doTurn(this)
  })

  $('button#previous').on('click', function() {
    $.get("/games")
      .done(function(data) {

    })
  })

  $('button#save').on('click', function() {
    $.post('/games', function(data) {
      //debugger;
    })
  })

  $('button#clear').on('click', function() {
  })



};

$(function() {
  attachListeners()
})
