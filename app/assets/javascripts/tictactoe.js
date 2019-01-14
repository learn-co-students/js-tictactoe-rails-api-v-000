// Code your JavaScript / jQuery solution here

var turn = 0;
var currentGame = 0;

function player() {
  return turn % 2 ? "O" : "X";
}

function updateState(clickedSquare) {
  let token = player();
  $(clickedSquare).text(token);
}

function setMessage(string) {
  $('div#message').text(string);
}


var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function checkWinner() {

// we're checking to see if there's a winner everytime a move is made.
// so we need to take the move that was just made and compare the board now with the winning combos

// by default a player isn't a winner
  var winner = false;

  // now we need to create a board out of the td nodes there. convert the token strings to something we can use to compare.
  // const board = $("td").map(function() { return $(this).html() }).toArray();
  // using the lines below is better and easier to read at the end

  var board = {};
  // index comes from the different 'td' nodes/elements
  // square is the user click at the moment
  // the board is iniatialized above (as empty), and when a user clicks, we're creating a key/value pair using the td node index and the user click
  $('td').text((index, square) => board[index] = square);


  winningCombos.some(function(combo) {
    position1 = board[combo[0]]
    position2 = board[combo[1]]
    position3 = board[combo[2]]
    comparison_set = JSON.stringify([position1, position2, position3])
    xSet = JSON.stringify(["X","X","X"])
    oSet = JSON.stringify(["O","O","O"])
    // debugger

    if (comparison_set === xSet || comparison_set === oSet) {
      winner = true;
      setMessage(`Player ${position1} Won!`)
    }

  });

  return winner;
}

function doTurn(clickedSquare) {
  updateState(clickedSquare);
  turn ++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn > 8) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

var attachListeners = () => {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
 }

$(document).ready(function() {
  attachListeners();
});


 var resetBoard = (click) => {
   $('td').empty();
   turn = 0;
   currentGame = 0;
 }


var saveGame = () => {
  var state = [];

  $('td').text((index, square) => state.push(square));

  var gameData = {state: state}

  if(currentGame){
    $.ajax({
     type: 'PATCH',
     url: `/games/${currentGame}`,
     data: gameData,
     success: () => { console.log('Game update successful.')},
     fail: () => { console.log('Game update failed.')},
    });
  } else {
    // $.ajax({
    //   type: 'POST',
    //   url: '/games',
    //   data: gameData,
    //   success: successFn,
    //   fail: failFn,
    //   complete: function(xhr, status) {
    //     console.log('Save game request is complete.')
    //   }
    // });
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
      console.log("Save was successful")
    });
  }

}

var showPreviousGames = () => {
  $("#games").empty();
  // grab the data
  $.get('/games', function(data) {
    // create a button for each game-data and make it reload that game
    data.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      $("#gameid-" + game.id).on('click', () => reloadGame(game.id));
    })
  })
}
var reloadGame = (gameId) => {
  $.get(`/games/${gameId}`, function(data) {
    var state = data.data.attributes.state;
    // state.forEach(function(game) {
    //   var index = 0
    //   for (let y = 0; y < 3; y++) {
    //     for (let x = 0; x < 3; x++) {
    //       document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
    //       // $('td[data-x=""][data-y=""]').innerHTML = state[index]
    //       index++;
    //     }
    //   }
    // });
    $("td").text(function(index) {
      return state[index];
    });

    $('#games').empty();
    turn = state.filter((ele) => ele !== '').length;
    state = [];

    currentGame = gameId;
    checkWinner();
  });

}


// function successFn(game) {
//   currentGame = game.data.id;
//   $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
//   $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
// }
// function failFn() {
//   console.log('failed')
// }
