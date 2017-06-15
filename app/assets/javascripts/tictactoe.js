$(document).ready(function() {
  attachListeners();  
});

const WIN_COMBINATIONS = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [6,4,2]
    ]

var turn = 0;

function attachListeners() {
  $('td').on('click', function(e) {
    if (positionAvailable(this)) {
      doTurn(this);
    }    
  });

  $('#save').on('click', function(e) {
    var gameId = $('#game-id span').text();
    
    if (gameId === "") {
      saveGame();
    } else {
      updateGame();
    }
  });

  $('#previous').on('click', function(e) {
    getPrevGames();
  });

  $(document).on('click', '#games ul li', function(e) {
    getPrevGameState(this);
  });
}

function positionAvailable(cell) {
  if ($(cell).text() === '') {
    return true;
  }
}

function doTurn(cell) {
  message(''); 
  updateState(cell);
  if (checkWinner() === false && boardFull(boardState()) === false) {
    turn++; 
  }
  checkWinner();
  checkTieGame();
}

function updateState(cell) {
  if (checkWinner() === false && boardFull(boardState()) === false) {
    $(cell).text(player());
  }
}

function player() {
  var token = "";
  turn % 2 === 0 ? (token = 'X') : (token = 'O');
  return token; 
}

function boardState() {
  var boardArray = [];
  $('td').each(function() {
    boardArray.push($(this).text());
  });
  return boardArray;
}

function clearBoard() {
  $('td').text('');
}

function resetTurn() {
  return turn = 0;
}

function checkWinner() {
  var winner = false;
  $.each(WIN_COMBINATIONS, function(index, value) {
    if ( boardState()[value[0]] ===  boardState()[value[1]] && boardState()[value[1]] ===  boardState()[value[2]] && boardState()[value[0]] != '') {
      winner = `Player ${player()} Won!`;
      saveGame();
      clearBoard();
      resetTurn();
      return message(winner);      
    }
  });
  return winner; 
}

function checkTieGame() {
  if (checkWinner() === false && boardFull(boardState()) === true) {
    saveGame();
    clearBoard();
    resetTurn();
    return message("Tie game");
  }
}

function message(string) {
  $('#message').text(string);  
}

function boardFull(boardArr) {  
  return turnNum(boardArr) === 9 ? true : false; 
}

function turnNum(boardArr) {
  var turnArr = $.map(boardArr, function(value) {
    return value === "" ? null : value;
  });
  return turnArr.length;
}

function saveGame() {
  var gameBoard = { game: { 'state': boardState() } };  
  var posting = $.post('/games', gameBoard);
  posting.done(function(data) {
    $('#game-id span').text(data.id);
  });  
}

function updateGame() {
  var gameBoard = { game: { 'state': boardState() } };  
  var gameId = $('#game-id span').text();

  $.ajax({
    url: '/games/' + gameId,
    method: 'PATCH',
    data: gameBoard
  })
  .done(function(msg) {
    console.log("Data saved: " + msg);
  });
}

function getPrevGames() {
  $.get('/games', function(data) {
    var games = data.games;
    if (data.games.length > 0) {
      $('#games').html('<ul></ul>');
      $.each(games, function(key, game) {
        $('#games ul').append('<li data-gameid=' + game.id + '>' + game.id + '</li>');
      });      
    }   
  })
}

function getPrevGameState(gameNum) {
  var gameId = $(gameNum).attr('data-gameid');

  $('#game-id span').text(gameId);
  $.get('/games', function(data) {
    
    var game = data.games[gameId-1]['state'];

    $.each(game, function(index, value) {
      $('td:eq(' + index + ')').text(value);      
    });

    turn = turnNum(game);
  });
}