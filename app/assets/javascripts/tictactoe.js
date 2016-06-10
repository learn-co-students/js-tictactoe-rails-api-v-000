var gameTurn;
var turn = 0;

var winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];

var savedGame = false;
var gameTracker;

$(function() {
  currentGame = $('td').map(function(index, item){
   return $(item).text();
  });
  attachListeners(); 
});

function attachListeners(){
  $('td').on('click', function(event){
    doTurn(event);
  });
  $('#save').on('click', function(event){
    saveGame();
  });
  $('#previous').on('click', function(event){
    getGames();
  });
  $('#games').each( function(){
      $(this).on('click', 'div', function(data){
        loadGame(this);
      })
  });
}

function doTurn(event){
  updateState(event);
  turn += 1;
  checkWinner();
}

//calls on player and adds return value to the clicked cell
function updateState(event){
  $(event['currentTarget']).text(player());
}

//if turn number is even, return 'X'; else, return 'O'
function player(){
  if(turn % 2 === 0){
    return 'X';
  } else {
    return 'O';
  };
}

//evaluates board to see if anyone has won
//if winner, make "Player X Won!" or "Player O Won!"
//then call message(string);
function checkWinner(){
  var currentGame = $('td').map(function(index, item){ return $(item).text(); });
  var winner = winningCombo(currentGame);
    if (typeof winner === "undefined" && turn === 9){
    saveAndStartNewGame();
    message("Tie game");
  } else if (typeof winner === "undefined"){
    return false;
  } else {
    var string = "Player " + currentGame[winner[0]] + " Won!";
    saveAndStartNewGame();
    message(string);
  };
}

function message(string){
  $('#message').text(string);
  resetBoard();
}

function resetBoard(){
  $('td').each(function(index, item){
    $(item).text("");
  });
  turn = 0;
}

function winningCombo(currentGame){
  return winCombos.find(function(combo){
   return (currentGame[combo[0]] === 'X' && currentGame[combo[1]] === 'X' && currentGame[combo[2]] === 'X') || (currentGame[combo[0]] === 'O' && currentGame[combo[1]] === 'O' && currentGame[combo[2]] === 'O')
  });
}

function saveGame(){
  var currentGame = $('td').map(function(index, item){
   return $(item).text();
  });
  var gameState = gameString(currentGame)
  
  if (typeof gameTracker === "undefined"){
    var posting = $.post("/games", {game: {state: gameState}});
    posting.done(function(data){
      if (data["game"]){
      gameTracker = data["game"]["id"];
      } else {
      gameTracker = data["id"];
      };
    });
  } else {
    var method = "PATCH";
    var patching = $.ajax({
      url: '/games/' + gameTracker,
      method: method,
      data: {
        game: {
          state: gameState
        }
      }
    });
  };
}

function getGames(){
  var games = $.get("/games");
  games.done(function(data){
    var gameList = data["games"];
    var gamesDisplayed = $('#games').children().length;
    if(gamesDisplayed === 0){
      gameList.forEach(function(game, index, self){
        addToDom(game["state"], game["id"]);
      });
    } else if(gamesDisplayed < gameList.length){
      var numToAdd = gameList.length - gamesDisplayed;
      var addList = gameList.splice(gamesDisplayed, numToAdd);
      addList.forEach(function(game, index, self){
        addToDom(game["state"], game["id"]);
      });
    };
  });
}

function gameString(currentGame){
  var gameArray = jQuery.makeArray(currentGame);
    return gameArray.map(function(pos){
      if(pos === ""){
        return " ";
      } else {
          return pos;
      };
    });
}

function saveAndStartNewGame(){
  currentGame = $('td').map(function(index, item){
   return $(item).text();
  });
  var gameState = gameString(currentGame)
  var posting = $.post("/games", {game: {state: gameState}});
  gameTracker = undefined;
}

function loadGame(game){
  var state = game.dataset.gamestate.replace(/-/g, " ");
  var gameState = state.split(",");
  gameTracker = game.dataset.gameid;
  $('td').each(function(index, item){
    $(item).text(gameState[index]);
  });
  var turns = $('td').map(function(index, item){
    if ($(item).text() === 'X' || $(item).text() === 'O'){
      return item;
    };
  });
  turn = turns.length;
}

function addToDom(gameState, gameId){
  var gameHolder = $.map(gameState, function(pos){
    if(pos === " "){
      return "-";
    } else {
      return pos;
    };
  });
  $('#games').append('<div  data-gameid=' + gameId + ' data-gameState=' + gameHolder +'>' + gameId + '</div>');
}







