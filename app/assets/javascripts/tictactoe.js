$(document).ready(function(){
  attachListeners();
});


var turn = 0;
var currentGame = 0;
var winningCombinations = [
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'], //[0, 1, 2],
  ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'],//[3, 4, 5],
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'],  ///[6, 7, 8]

  ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'], ///[0, 3, 6],//
  ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'], ///[1, 4, 7],//
  ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="1"]', '[data-x="2"][data-y="2"]'], ///[2, 5, 8],//

  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'], ///[0, 4, 8],//
  ['[data-x="2"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="0"][data-y="2"]'] ///[2, 4, 6]//
];

var player = function(){
  return (turn % 2 === 0) ? 'X' : 'O'
};

//////functions/////

function attachListeners() {
  $("td").on('click', function(event) {
    doTurn(event.target);
  });
  $('#previous').on('click', function(event) {
    getGames(event);
  });
  $('#save').on('click', function(event) {
    saveGame(event);
  });
}

function doTurn(selector){
  updateState(selector);
  if(!checkWinner()){
    turn++;
  }else{
    resetBoard();
  }

};

function updateState(selector){
  if($(selector).text() === ""){
    $(selector).text(player());
  }else{
    updateState(selector);
  }
};

function checkWinner() {
  var won = false;
  var tie = false;
  var notOver = true;
  $.each(winningCombinations, function (index, combo) {
    if($(combo[0]).text() === player() && $(combo[1]).text() === player() && $(combo[2]).text() === player()) {
      won = true;
    }else if(turn > 7){
      tie = true;
    }else{
      notOver = false;
    }
  });
  if(won){
    message("Player " + player() + " Won!");
    return player();
  }
  else if(tie){
    message("Tie game");
    return true;
  }
  else{
    return notOver;
  }
}

function resetBoard(){
  turn = 0
  $("td").text("");
};


function message(text) {
  $('div#message').text(text);
};


var currentGame = function(){

};

function getGames(event){
    $.get('/games').done(function(allGames){
      $(allGames.games).each(function(id){
        $('ul#games').append('<li><a href="/games/' + (id + 1) + '">' + (id + 1) + '</a></li>');

      });
    });
}

function saveGame(event){

  


}


