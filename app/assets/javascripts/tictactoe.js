$(function(){
  attachListeners();
})

var win_combos = [    
  [0,1,2], 
  [3,4,5],
  [6,7,8], 
  [0,4,8], 
  [6,4,2], 
  [0,3,6], 
  [1,4,7], 
  [2,5,8]
];
var turn = 0;
var currentGame = 0;

function attachListeners(){
  $('#save').on('click', function(event){
    event.preventDefault();
    saveGame();
  });

  $('#newGame').on("click", function(event){
    newGame();
  });

  $('#previous').on("click", function(event){
    showGames();
  });
}

function doTurn(event){
  turn++;
  updateState(event);
}

function updateState(){}

function checkWinner(){}

function player(){}

function message(){}