
var turn = 0;
var winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
[1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var currentGame;


//attachListeners must be invoked inside
$(function() {
  attachListeners()
})


//Returns token of player whose turn is x when even and o when odd
function player() {
  return turn % 2 === 0 ? 'X' : "O"
}


//invokes player() and adds returned string x or o to clicked square on board
function updateState(square) {
  square.innerHTML = player()
}

// accepts a string and adds it to the div#message element in DOM

function setMessage(message) {
  $('div#message').html(message)
}


//Returns true if board contains any winning combinations otherwise false
//if won pass the appropriate string 'Player X Won!' or 'Player O Won!'

function checkWinner() {
  // search through board and get elements
  let board = $('td').map(function(){
    return $(this).text()
  }).get()
  // detect the first winner
 winCombos.find((win) => {
   debugger
    if (board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]] && board[win[0]] !== "" && board[win[0]] !== undefined) {
      //winner message
      setMessage(`Player ${board[win[0]]} Won!`)
      return winner = true

    } else {
      return winner = false
    }
  })
  return winner
}

// increment the turn by 1
// invoke updateState() passing it the element that was clicked
// invoke checkWinner() to determine whether the move results in winning play [?]

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    clearGame()
  } else if (turn === 9) {
      setMessage("Tie Game.")
      saveGame()
      clearGame()
  }
}


//Attaches event listeners to squares of game board and button#save/previous/clear
//When user clicks on square e.listener invokes doTurn and pass it to element clicked []

function attachListeners() {
  $('td').on('click', function() {
    if ($(this).text() === '' && !checkWinner()) {
      doTurn(this)
    }
  })
  //set the buttons as functions

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => clearGame())
}


//Save current game state
//If game is already in database/update instead[]
//Game can be saved if blank[]

function saveGame() {
 let boardState = $('td').map(function(){
     return $(this).text()
  }).get()

  //get state data and put in variable here ""
  data = {state: boardState}

  if (currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: data
    })

  } else {
    $.ajax({
      type: "POST",
      url: '/games',
      data: data,
      success: function(game) {
        currentGame = game.data.id
        $('#games').append(`<button id='gameid-${game.data.id}'>${game.data.id}</button>`)
        $(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id))
      }
    })
  }
}


//Grabs all persisted games from DB and create a button for each
//All buttons should be added to the div#games element []

function showPreviousGames() {
  previousGamesButton = function(game){
    $('#games').append(`<button id='gameid-${game.id}'>${game.id}</button>`)
    $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
  }
  $('#games').empty();
   //hijack the route
   $.ajax({
     type: 'get',
     url: '/games',
     success: function(games) {
       if (games['data'].length > 0) {
         games['data'].forEach(previousGamesButton())
       }
     }
   })
}


//Clears the board and starts a new game

function clearGame() {
  //set turn to 0 and currentGame
  turn = 0;
  currentGame = undefined;

// set board to ''
  $('td').empty();
}
