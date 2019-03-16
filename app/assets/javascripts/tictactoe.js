// Code your JavaScript / jQuery solution here

var currentGameNum = 0
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

var turn = 0;
var board = [ '', '', '', '', '', '', '', '', '' ];

function reset_game() {
  turn = 0;
  board = [ '', '', '', '', '', '', '', '', '' ];
  empty_board();
}

function empty_board() {
  jQuery.each($('table td'), function(i, td) { td.innerHTML = '' });
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

function board_fill() {
  $('table td[data-x=' + 0 + '][data-y=' + 0 + ']')[0].innerHTML = board[0]
  $('table td[data-x=' + 1 + '][data-y=' + 0 + ']')[0].innerHTML = board[1]
  $('table td[data-x=' + 2 + '][data-y=' + 0 + ']')[0].innerHTML = board[2]
  $('table td[data-x=' + 0 + '][data-y=' + 1 + ']')[0].innerHTML = board[3]
  $('table td[data-x=' + 1 + '][data-y=' + 1 + ']')[0].innerHTML = board[4]
  $('table td[data-x=' + 2 + '][data-y=' + 1 + ']')[0].innerHTML = board[5]
  $('table td[data-x=' + 0 + '][data-y=' + 2 + ']')[0].innerHTML = board[6]
  $('table td[data-x=' + 1 + '][data-y=' + 2 + ']')[0].innerHTML = board[7]
  $('table td[data-x=' + 2 + '][data-y=' + 2 + ']')[0].innerHTML = board[8]
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
    if ((board[winningCombos[i][0]] === 'X' &&
         board[winningCombos[i][1]] === 'X' &&
         board[winningCombos[i][2]] === 'X')) {

      setMessage(`Player X Won!`);
      return true

    } else if ((board[winningCombos[i][0]] === 'O' &&
                board[winningCombos[i][1]] === 'O' &&
                board[winningCombos[i][2]] === 'O')) {

      setMessage(`Player O Won!`);
      return true
    }
  }
}

function is_a_tied_game() {
  if (board.every(el => el === "X" || el === "O") && !has_winning_combo()) {
    return true
  }
}

function checkWinner() {
  winBool = false;
  fill_board()

  if (board.every(el => el === "")) {
    winBool = false

  } else if (has_winning_combo()) {
    winBool = true
    $('button#save').trigger('click')

  } else if (is_a_tied_game()) {
    setMessage(`Tie game.`)
    $('button#save').trigger('click')
  }
  return winBool
}

function doTurn (position) {
  updateState(position)
  if (checkWinner() === true) {
    currentGameNum = $('button.prev-game').length + 1
    reset_game()
  } else {
    turn += 1
  }
}

function click_for_turn() {
  $('table td').on('click', function(event) {
    event.preventDefault();
    doTurn(this)
  })
}

function selectGame() {
  $('button.prev-game').on('click', function() {
    var id = this.innerHTML
    $.ajax({
    	url: `/games/${id}`,
    	method: 'GET'
    })
    .done(function(game) {
      currentGameNum = game['data']['id']
    	board = game['data']['attributes']['state']
      turn = board.filter( x => x === 'X' || x === 'O' ).length
    	board_fill()
    });
  })
}

function previousGames() {
  $('button#previous').on('click', function(event) {
    event.preventDefault();

    $.get("/games", function(prev_games) {
      if (prev_games['data'].length > 0) {
        const games_div = $('div#games').empty()
        jQuery.each(prev_games['data'], function(i, game) {
          games_div.append(`
            <button class="prev-game" id="game-${game.id}">${game.id}</button> <br />
            `)
        });
        selectGame()
      };
    });
  });
}

function saveGame() {
  $('button#save').on('click', function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/games",
      data: { state: board }
    })
  });
}

function clearGame() {
  $('button#clear').on('click', function() {
    reset_game()
  })
}

function attachListeners() {

  click_for_turn()
  previousGames()
  saveGame()
  clearGame()






};

$(function() {
  attachListeners()
})
