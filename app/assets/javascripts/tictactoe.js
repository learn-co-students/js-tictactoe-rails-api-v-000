// Code your JavaScript / jQuery solution here

//////////////////////////////////////////////////////
// Tracks what game is loaded into the board        //
//////////////////////////////////////////////////////
var currentGameNum = 0

//////////////////////////////////////////////////////
// A LIST OF ALL OF THE WINNING COMBINATIONS        //
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////
// the initial values for the game                  //
//////////////////////////////////////////////////////
var turn = 0;
var board = [ '', '', '', '', '', '', '', '', '' ];


//////////////////////////////////////////////////////
// resets the game completely                       //
//////////////////////////////////////////////////////
function reset_game() {
  turn = 0;
  board = [ '', '', '', '', '', '', '', '', '' ];
  currentGameNum = $('button.prev-game').length + 1
  empty_board();
}


//////////////////////////////////////////////////////
// empties the board by changing all of the         //
// positions to ''                                  //
//////////////////////////////////////////////////////
function empty_board() {
  jQuery.each($('table td'), function(i, td) { td.innerHTML = '' });
}

//////////////////////////////////////////////////////
// fills the backend board with the tokens on the   //
// browser board                                    //
//////////////////////////////////////////////////////
function fillGameBoard() {
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

//////////////////////////////////////////////////////
// fills the board on the browser with the contents //
// of the game board                                //
//////////////////////////////////////////////////////
function fillBrowserBoard() {
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

//////////////////////////////////////////////////////
// checks if the current player is an 'X' or an 'O' //
//////////////////////////////////////////////////////
function player() {
  return turn % 2 === 0 ? 'X' : 'O'
};


//////////////////////////////////////////////////////
// updates the board if it doesn't                  //
// have an 'X' or 'O'                               //
//////////////////////////////////////////////////////
function updateState(position) {
  if (position.innerHTML === 'X' || position.innerHTML === 'O' ) {
    turn -= 1
  } else {
    position.innerHTML = player()
  }
};


//////////////////////////////////////////////////////
// sets the message to whatever the argument is     //
// and displays is in the browser                   //
//////////////////////////////////////////////////////
function setMessage(message) {
  $('div#message')[0].innerHTML = message
};


//////////////////////////////////////////////////////
// checks if the winning combination is             //
// an 'X' or an 'O'                                 //
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////
// checks if the game is tied                       //
//////////////////////////////////////////////////////
function is_a_tied_game() {
  if (board.every(el => el === "X" || el === "O") && !has_winning_combo()) {
    return true
  }
}


//////////////////////////////////////////////////////
// Determines if there is a winner                  //
//////////////////////////////////////////////////////
function checkWinner() {
  winBool = false;
  fillGameBoard()

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


//////////////////////////////////////////////////////
// Performs a turn by updating the board,           //
// checking for a winner,                           //
// and incrementing the turn                        //
//////////////////////////////////////////////////////
function doTurn (position) {
  updateState(position)
  if (checkWinner() === true) {
    reset_game()
  } else {
    turn += 1
  }
}

//////////////////////////////////////////////////////
// Invokes the doTurn() method if the player clicks //
// on any square of the game board                  //
//////////////////////////////////////////////////////
function click_for_turn() {
  $('table td').on('click', function(event) {
    event.preventDefault();
    doTurn(this)
  })
}

//////////////////////////////////////////////////////
// Adds an event listener to each game button       //
// Fills the browser board with the contents        //
// of the game instance's Game state (board)        //
//////////////////////////////////////////////////////
function selectGame() {
  $('button.prev-game').on('click', function() {
    var id = this.innerHTML
    $.ajax({
    	url: `/games/${id}`,
    	method: 'GET'
    })
    .done(function(game) {
      currentGameNum = parseInt(game['data']['id'])
    	board = game['data']['attributes']['state']
      turn = board.filter( x => x === 'X' || x === 'O' ).length
    	fillBrowserBoard()
    });
  })
}


//////////////////////////////////////////////////////
// Creates a new button for each previous game      //
// Activates the selectGame() event listener        //
// for the buttons only if there are previous       //
// games                                            //
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////
// Saves the game if the user clicks the save       //
// button and if there is a Win or Tie              //
// If Game exists, updates it                       //
// If Game doesn't exist, creates a new game        //
//////////////////////////////////////////////////////
function saveGame() {
  $('button#save').on('click', function(event) {
    event.preventDefault();

    if ($(`#game-${currentGameNum}`)[0]) {
      //debugger;
      $.ajax({
        type: "PATCH",
        url: `/games/${currentGameNum}`,
        data: { state: board }
      })
      //debugger;

    } else {

      $.ajax({
        method: "POST",
        url: "/games",
        data: { state: board }
      })

    }

  });
}

//////////////////////////////////////////////////////
// Clears the board & resets the turn count to 0    //
//////////////////////////////////////////////////////
function clearGame() {
  $('button#clear').on('click', function() {
    reset_game()
  })
}

//////////////////////////////////////////////////////
// All of the event listeners                       //
//////////////////////////////////////////////////////
function attachListeners() {

  click_for_turn()
  previousGames()
  saveGame()
  clearGame()

};

//////////////////////////////////////////////////////
// document.ready() function                        //
//////////////////////////////////////////////////////
$(function() {
  attachListeners()
})
