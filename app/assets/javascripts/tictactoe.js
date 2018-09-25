var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(function() {
  attachListeners()
});

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(clickedSquare) {
  var token = player(); /* assign token to either X or O */
  $(clickedSquare).text(token) //add player token to the clickedSquare
}

function setMessage(message) {
  $('#message').text(message)
}

function checkWinner() {
  var winner = false //default value
  var board = {} // start with empty object for board

  $('td').text(function(index, square) {
    board[index] = square;  /* populate game board */
    debugger
  })
  //pull text from each td
  //index = index position; board[1] = square 2

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true
    }
  })
  return winner /* false, as defined on line 22 */
}

function doTurn(clickedSquare) {
  updateState(clickedSquare) /*add a token to the board */
  turn++; /* increment turn by 1 */
  if (checkWinner()) { /* check if there's a winner after the turn */
    saveGame(); //auto-save game
    clearBoard(); /* clear the board if there's a winner */
  } else if (turn === 9) {
    saveGame(); //auto-save game
    clearBoard();
    setMessage("Tie game.")
  }
}

function attachListeners() {
  $('td').click(function() {
    //debugger
    if ($.text(this) === "" && !checkWinner()) /* if there is no winner yet and the square is blank, invoke doTurn */
    // 'this' equals the td data-x and data-y of the clicked square
    doTurn(this)
  })

  $('#clear').click(function() {
    clearBoard();
  })

  $('#previous').click(function() {
    previousGames();
  })

  $('#save').click(function() {
    saveGame();
  })
}

function clearBoard() {
  $('td').empty(); //grab all the tds and empty any Xs and Os
  turn = 0; //reset turn count to 0
  currentGame = 0; //set currentGame back to 0
}

function previousGames() {
  $('#games').empty();
  $.get('/games', function(data) { //games have been saved to /games; get data from it
    if (data.data.length > 0) { //if data has saved games
      data.data.forEach(makePreviousGameButton); //create button for each game in data
    }
  })
  //check if previously saved games exist
  //if so, retrieve them
  //append those game buttons to $('games')
}

function makePreviousGameButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).click(function() {
    reloadGame(game.id);
  })
}

function reloadGame(gameID) {
  //GET request to games/gameid
  //take data and add to the state and gameboard
  $.get(`/games/${gameID}`, function(game) { //game = data object
    let state = game.data.attributes.state; // state array
    //debugger
    let id = game.data.id;
    let board = {}
    //debugger

    let index = 0;
    //inner loop (x) will run up to 2 before y increments by 1
    for (let y = 0; y < 3; y++) { //loop will run 0,0; 1,0; 2,0; 1,0; 1,1; 1,2; 2,0; 2,1; 2,2
      for (let x = 0; x < 3; x++) {
      document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
      index++
      }
    }
    let turnCount = 0;
    for(var i = 0; i < state.length; i++) {
      if (state[i] !== "") {
        turnCount++;
      }
    }
    turn = turnCount;
    currentGame = id;
  })
}

function saveGame() {
  var state = []; //state is stored in an array, per Game model

  $('td').text(function(index, square) {
    state.push(square);
  })
  //get text from the td and push it onto the state array

  var gameData = {state: state}

  if (currentGame) { //if we are in the current game (i.e., an already existing game)
    $.ajax({
      type: "PATCH", //to UPDATE
      url: `/games/${currentGame}`,
      data: gameData //send the state array
    })
  } else {
    $.post('/games', gameData, function(game) { //game is the data object  sent back from server
      currentGame = game.data.id; //assign currentGame the ID of game.data
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}
