// Code your JavaScript / jQuery solution here

//////////////////////////////////////////////////////
// Tracks what game is loaded into the board        //
//////////////////////////////////////////////////////
var currentGameNum = 0
var previousGameIds = []


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
// empties the board by changing all of the         //
// positions to ''                                  //
//////////////////////////////////////////////////////
function emptyBoard() {
  jQuery.each($('table td'), function(i, td) { td.innerHTML = '' });
}


//////////////////////////////////////////////////////
// resets the game completely                       //
//////////////////////////////////////////////////////
function resetGame() {
  turn = 0;
  board = [ '', '', '', '', '', '', '', '', '' ];
  currentGameNum = 0;
  emptyBoard();
}


//////////////////////////////////////////////////////
// checks if the current player is an 'X' or an 'O' //
//////////////////////////////////////////////////////
function player() {
  return turn % 2 === 0 ? 'X' : 'O'
};

//////////////////////////////////////////////////////
// Checks if a position is valid                    //
//////////////////////////////////////////////////////
function isNotValid(position) {
  if (position.innerHTML === 'X' || position.innerHTML === 'O' ) {
    return true
  }
}


//////////////////////////////////////////////////////
// updates the board if it doesn't                  //
// have an 'X' or 'O'                               //
//////////////////////////////////////////////////////
function updateState(position) {
  if (isNotValid(position)) {
    turn -= 1
  } else {
    position.innerHTML = player()
    fillGameBoard()
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
function hasWinningCombo() {
  for(i=0; i < winningCombos.length; i++) {
    if (board[winningCombos[i][0]] === board[winningCombos[i][1]] &&
        board[winningCombos[i][1]] === board[winningCombos[i][2]] &&
        board[winningCombos[i][0]] !== '') {

      const winner = board[winningCombos[i][0]]

      setMessage(`Player ${board[winningCombos[i][0]]} Won!`);
      return true
    }
  }
}

//////////////////////////////////////////////////////
// checks if the game is tied                       //
//////////////////////////////////////////////////////
function isTiedGame() {
  if (board.every(el => el === "X" || el === "O") && !hasWinningCombo()) {
    setMessage(`Tie game.`)
    return true
  }
}


//////////////////////////////////////////////////////
// Determines if there is a winner                  //
//////////////////////////////////////////////////////
function checkWinner() {
  winBool = false;
  fillGameBoard()

  if (hasWinningCombo()) {
    winBool = true
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
  turn += 1
  if (checkWinner() || isTiedGame()) {
    $('button#save').trigger('click')
    $('button#clear').trigger('click')
  }
}

//////////////////////////////////////////////////////
// Allows Users to Take a Turn by Clicking Squares  //
// Invokes the doTurn() method if the player clicks //
// on any square of the game board                  //
//////////////////////////////////////////////////////
function allowTurns() {
    $('table td').on('click', function() {
      if (!checkWinner() && !isTiedGame()) {
        doTurn(this)
      }
    })
  }

//////////////////////////////////////////////////////
// Prevents users from being able to click squares  //
// This prevents them from taking a turn            //
//////////////////////////////////////////////////////
// function preventTurns() {
//   if (hasWinningCombo() || isTiedGame()) {
//     $('table td').off('click')
//   }
// }

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
    	fillBrowserBoard();
    });
  });
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
        selectGame() //activates the event handler for clicking on buttons for previous games
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

    if (jQuery.inArray(currentGameNum, previousGameIds) !== -1) {
      $.ajax({
        method: "PATCH",
        url: `/games/${currentGameNum}`,
        data: { state: board }
      });
    } else {
      $.ajax({
        method: "POST",
        url: "/games",
        data: { state: board }
      })
      .done(function(game) {
        // sets the currentGameNum to be the same as the saved game
        // Add the saved game's ID to the previousGameIds array
        currentGameNum = parseInt(game['data']['id'])
        previousGameIds.push(parseInt(game['data']['id']))
      })
    }
  });
}

//////////////////////////////////////////////////////
// Clears the board & resets the turn count to 0    //
//////////////////////////////////////////////////////
function clearGame() {
  $('button#clear').on('click', function() {
    resetGame();
  });
}

//////////////////////////////////////////////////////
// All of the event listeners                       //
//////////////////////////////////////////////////////
function attachListeners() {
  allowTurns();
  previousGames();
  saveGame();
  clearGame();
};

//////////////////////////////////////////////////////
// document.ready() function                        //
//////////////////////////////////////////////////////
$(function() {
  attachListeners();
})
