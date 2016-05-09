"use strict";

var turn = 0;

var WIN_COMBOS = [
  [0,1,2], // Top row
  [3,4,5],  // Middle row
  [6,7,8],

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
    reset();
  } else {
    turn++;
  }
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(event){
  //sets the target (td) of the jquery event object to either "O" or "X"
  $(event.target).html(player());
}

function getBoard(){
  return $('td').map(function(index, item){
    return item.innerHTML; //here return adds to array
  });
}

function checkWinner(){
  var board = getBoard();

  for(var i = 0; i < WIN_COMBOS.length; i++){
    if (board[WIN_COMBOS[i][0]] !== '' && board[WIN_COMBOS[i][0]] === board[WIN_COMBOS[i][1]] && board[WIN_COMBOS[i][1]] === board[WIN_COMBOS[i][2]]){
      message("Player " + board[WIN_COMBOS[i][0]] + " Won!");
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
  message("Tie game");
  return true; //all spots are full, so it's a tie
}

function reset(){
  turn = 0;
  $('td').html('');
}

function message(string){
  $('div#message').html(string);
}

function displayGames(games){

}

function saveGame(){
  
}
