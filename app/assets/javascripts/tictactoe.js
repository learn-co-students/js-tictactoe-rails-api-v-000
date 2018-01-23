$(document).ready(function() {

  attachListeners();

});

// global variables

var game_id = null;
var state = ["", "", "", "", "", "", "", "", ""];
var turn = 0;

var WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

// Attach listeners

function attachListeners() {

  $('td').on("click", () => doTurn(event.target));
  $('button#previous').on("click", () => showPreviousGames());
  $('button#clear').on("click", () => clearGame());
  $('button#save').on("click", () => saveGame());

}

// save game

function saveGame() {
  event.preventDefault();

  if(!game_id) {
    var posting = $.post('/games', {state: state});

    posting.done(function(data) {
      console.log(data);
      game_id = data.data.id
    });
  } else {
    var posting = $.put(`/games/${game_id}`, {state: state});

    posting.done(function(data) {
      console.log(data);
    });
  }
};

// clear game board and start new game

function clearGame() {
  event.preventDefault();
  console.log("Game has been cleared");
  game_id = null;
  state = ["", "", "", "", "", "", "", "", ""];
  $('td').html("");
  turn = 0;
};

// show previous games

function showPreviousGames() {
  event.preventDefault();
  var games = $.get('/games')

  games.done(function(data) {
    console.log(data);
    var html = [];
    for (var game of data.data) {
      if (game != null) {
        game = `<a href="/games/${game.id}" onClick="loadGame(event.target);"> Game ${game.id} </a>`;
        html += game;
      }
    }
    $('div#games').html(html);
  });

};

function loadGame(target) {
  event.preventDefault();
  var game = $.get(target.href)

  game.done(function(data) {
    console.log(data.data.attributes.state);
    state = data.data.attributes.state;
    populateBoard(state);
  });

};

function populateBoard(array) {
  let squares = window.document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = array[i];
    window.state[i] = array[i];
  }
};

// doTurn()

function doTurn(element) {
  turn += 1;
  updateState(element);
  if (checkWinner() == true) {
    saveGame();
    clearGame();
    console.log('Won game saved.');
  };
  if (checkWinner() == false && turn == 9) {
    setMessage('Tie game.');
    saveGame();
    clearGame();
    console.log('Tie game saved.');
  };
};

// updateState()

function updateState(element) {
  var token = player();
  $(element).html(token);
  state[element.id] = token;
};

// player()

function player() {
  if (turn == 0 || turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
};

// checkWinner()

function checkWinner() {

  for (const combo of WIN_COMBINATIONS) {
    if (state[combo[0]] === state[combo[1]] && state[combo[1]] === state[combo[2]] && state[combo[0]] != "")
    {
      var token = state[combo[0]];
      setMessage("Player " + token +  " Won!");
      console.log(combo);
      return true;
    }
  }
  return false;
};

// setMessage()

function setMessage(message) {
  $('div#message').text(message);
};

// Add put and delete methods to jQuery
// data must be an object (a hash), as in {satay: satay}

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});
