'use strict';

var turn = 0;
var currentGame = 0;

var WIN_COMBOS = [
  [0,1,2], //top row
  [3,4,5], //middle row
  [6,7,8], //bottom row

  [0,3,6], //verticals
  [1,4,7],
  [2,5,8],

  [0,4,8], //diagonals
  [6,4,2]
]

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('button#save').on('click', function(){
    //save game to database
    saveGame();
  });

  $('button#previous').on('click', function(){
    //load previously saved games
    $.getJSON('/games').done(function(response){
      displayGames(response.games);
    });
  });

  $('td').on('click', function(event){
    //process turn when clicking on a table element
    doTurn(event);
  });
}

function doTurn(event){
  updateState(event);
  if (checkWinner() || checkTie()){
    saveGame(); //autosave at end of game
    reset();
  } else {
    turn++;
  }
}

function player(){
  if (turn % 2 === 0){
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(event){
  //sets the target (td) of the jquery event object to either 'O' or 'X'
  $(event.target).html(player());
}

function getBoard(){
  return $('td').map(function(index, item){
    return item.innerHTML; //here return adds to array
  }).toArray(); //.toArray() forces conversion to array, forgoing jquery objects
}

function checkWinner(){
  var board = getBoard();

  for(var i = 0; i < WIN_COMBOS.length; i++){
    if (board[WIN_COMBOS[i][0]] !== '' && board[WIN_COMBOS[i][0]] === board[WIN_COMBOS[i][1]] && board[WIN_COMBOS[i][1]] === board[WIN_COMBOS[i][2]]){
      message('Player ' + board[WIN_COMBOS[i][0]] + ' Won!');
      return true;
    }
  }

  return false;
}

function checkTie(){
  var board = getBoard();

  for (var i = 0; i < board.length; i++ ) {
    if (board[i] === ''){
      return false; //if one of the spots on the board is empty, it's not a tie
    }
  }
  message('Tie game');
  return true; //all spots are full, so it's a tie
}

function reset(){
  turn = 0;
  currentGame = 0; //reset current game id
  $('td').html('');
}

function message(string){
  $('div#message').html(string);
}

function displayGames(games){

}

function saveGame(){
  //console.log(getBoard());
  var ajaxUrl, ajaxMethod;

  //determine whether updating saved game or creating new save in db
  if (currentGame) {
    ajaxUrl = '/games/' + currentGame;
    ajaxMethod = 'PATCH';
  } else {
    ajaxUrl = '/games';
    ajaxMethod = 'POST';
  }

  $.ajax({
    url: ajaxUrl,
    method: ajaxMethod, //POST/PATCH
    data: { //structure data in the form of a game object hash for rails
      game: {
        state: getBoard() //array of spots on the board
      }
    },
    dataType: 'json'
  }).success(function(response){
    currentGame = response.game.id; //get the database game id from the response
    console.log(response);
  });
}
