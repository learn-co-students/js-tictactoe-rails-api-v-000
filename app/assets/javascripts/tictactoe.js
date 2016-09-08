$(function() {
  attachListeners();
})

// ################# Game Functions ################# //

var turn = 0;
var currentGame = ["","","","","","","","",""];
var currentGameId = undefined;
var persisted = false;

var winners = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]]
];


function attachListeners() {
  // When a client clicks on a cell,
  // the function doTurn() should be called and passed a
  // parameter of the event
  $('tbody').click(function(event) {
    doTurn(event)
  });

  $('#previous').click(function(event) {
    listGames();
  });

  $('#save').click(function(event) {
    if (persisted == false) {
      save();
      persisted = true
    } else {
      update();
    }
  });

  $('#games').on('click', function(event) {
    currentGameId = $(event.target).data('gameid');
		currentGame = $(event.target).data('gamestate');
		var i = 0;
		$('table tr td').each(function() {
			$(this).text(currentGame[i]);
			i++;
		});
	});
}

function doTurn(event) {
  // Should call on the function updateState() and pass it the event
  updateState(event);
  // Should call on checkWinner()
  if (checkWinner()) {
    // resets the board and sets turn to zero when there is a winner
    // resets the board and sets turn to zero when there is a tie
    // it should autosave at the end of the game
    save();
    resetBoard();
  } else {
    // Increment the variable turn by one
    turn ++;
  }
  currentGame = getBoard();

}

var player = function () {
  // Should return the string "X",
  // else it should return the string "O"
  if ((turn % 2) == 0) {
    return "X"
  } else {
    return "O"
  }
};

function updateState(event) {
  // Should call on player() and add the return
  // value of this function to the clicked cell on the table
  $(event.target).html(player());
};

function currentCell(data1, data2) {
  return $('[data-x="' + data1 + '"][data-y="' + data2 + '"]').html();
}

function checkWinner() {

  var gameOver = false

  // Should evaluate the board to see if anyone has won
  winners.forEach(function(combo) {
    var cell1 = currentCell(combo[0][0], combo[0][1]);
    var cell2 = currentCell(combo[1][0], combo[1][1]);
    var cell3 = currentCell(combo[2][0], combo[2][1]);

    if (cell1 == player() && cell2 == player() && cell3 == player()) {
      // should then pass this string to message()
      // should make one of two strings: "Player X Won!" or "Player O Won!"
      message("Player " + player() + " Won!");
      gameOver = true;
    }
    // Calls on 'message' and passes it the string 'Tie game' when there is a tie
    if (tie()) {
      message("Tie game");
      gameOver = true;
    }
  })
  return gameOver
}

function message(string) {
  // Should accept a string and add the string to the div with an id of "message"
  $('#message').text(string)
}

function getBoard() {
  // Return board as an array board = ["","","","","","","","",""]
  var board = [];
  $('td').each(function(cell){
  	board.push($(this).text());
  });
  return board;
}

function tie() {
  // Checks if board is full and current turn is the last one
  var board = getBoard();
  return board.every(cell => cell != '') && turn == 8;
}

function resetBoard() {
  // Reset board to all blank 'td'
  // Set turn to zero
  $('td').html('');
  turn = 0;
  currentGameId = undefined
}


// ################# AJAX Functions ################# //

function listGames() {
  $.ajax({
    url: '/games',
    method: 'GET',
    success: function(data) {
       $('#games li').remove();
      var games = data.games;
      if (games.length != 0) {
        $.each( games, function(index, game) {
          $('#games').append('<li data-gameid=' + game.id + ' data-gamestate=' + game.state + ' id="old" >' + game.id + '</li>');
        });
      }
    }
  });
}

function save() {
  $.ajax({
    url:'/games',
    method: 'post',
    dataType: 'json',
    data: {
      game: {state: JSON.stringify(currentGame)}
    },
    success: function(data){
      game = {
        id: data.id ,
        state: data.state
      };
      currentGameId = data.id
    }
  })
}

function update() {

  $.ajax({
    url: '/games/' + currentGameId,
    method: "PATCH",
    data: {game: {state: JSON.stringify(currentGame)}},
    success: function(data){
      game = {
        id: data.id ,
        state: data.state
      };
    }
  })
}
