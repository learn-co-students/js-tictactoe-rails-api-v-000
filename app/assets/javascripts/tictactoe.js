"use strict";

var turn = 1;

$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('button#save').on('click', function(){
    //save game to database
  });

  $('button#previous').on('click', function(){
    //load previously saved games
  });

  $('td').on('click', function(){
    //process turn when clicking on a table element
    doTurn(event);
  });
}

function doTurn(event){
  turn++;
  updateState(event);
  checkWinner();
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(event){
  //$('td')
}

function checkWinner(){

}

function message(string){
  $('div#message').append(string);
}
