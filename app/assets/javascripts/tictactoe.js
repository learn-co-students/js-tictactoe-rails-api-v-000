var gameNumber = 0;
var turn = 1;
var winCombos = [
[[0,0], [1,0], [2,0]],
[[0,1], [1,1], [2,1]],
[[0,2], [1,2], [2,2]],
[[0,0], [0,1], [0,2]],
[[1,0], [1,1], [1,2]],
[[2,0], [2,1], [2,2]],
[[0,0], [1,1], [2,2]],
[[0,2], [1,1], [2,0]]];

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {

  $('#newGame').on('click', function(event) {
    newGame();
  });

  $('#games').click(function(event) {
    loadGame($(event.target).data('state').split(','));
    gameNumber = $(event.target).data('game');
    
  });

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    listGames();
  })


  $('td').on('click', function(event) {
    doTurn(this, event)
  });
}

function doTurn(cell, event) {
  updateState(cell);
  checkWinner();
  turn += 1
}

function message(player) {
  $('#message').html("Player " + player + " Won!");
}

function checkWinner() {

  for (var i = 0; i < winCombos.length; i++) {
    var combo = winCombos[i];

    var currentBoard = [];
    $.each(combo, function(i, position){
      var x = position[0],
          y = position[1],
          board = $('[data-x="' + x +'"][data-y="' + y + '"]').html();

        if (board === player()) {
          currentBoard.push(board);
        }
        debugger;
        if (currentBoard.length === 3) {
          message(player());
          //debugger;
        }
    });
  }
}

function newBoard() {
  $('table td').empty();
}

function newGame() {
  $('#message').html("");
  newBoard();
  turn = 1;
  gameNumber = 0;
}

function player() {
  var token = (turn %2 ) ? 'X' : 'O';
  return token;
}

function updateState(cell) {
  
    if($.trim($("selector").html())=='') {
      $(cell).html(player());
      //turn += 1;
    } else {
      alert("This position is taken.")
    }


    if(turn == 10) {
      alert("Cats Game!");
      saveGame();
      $('table td').empty(); //removes the content from all td within the table.
      turn = 1; //resets the turn counter to 1 for a new game
    }
  }

  function loadGame(game) {
    $('td').each(function(index) {
      $(this).html(game[index]);
      
    });
  }

  function listGames() {
    clearGameList();
    var gameList = [];
    $.getJSON("/games").done(function(data) {
      gameList = data.games;
      var listSelector = $("#games");
      listSelector.html("");
      gameList.forEach(function(game) {
        listSelector.append('<button class="loader" data-game="' + game['id'] + '" data-state="' + game['state'] + '">' + game['id'] + '</button>');
      });
    });
  }

  function clearGameList() {
    $('#games').html("");
  }

  function saveGame() {
    var board = [];
    var url = '/games';
    var method = 'POST';

    if (gameNumber != 0) { 
      url = '/games/' + gameNumber;
      method = 'PATCH';
    }
      debugger;
    $('td').each(function() {
      board.push($(this).text());
    });

    $.ajax({
      url: url,
      type: method,
      dataType: JSON,
      data: {
        game: {
          state: board
        }
      }
    });

    board = [];
    clearGameList();
    //listGames();

  }


