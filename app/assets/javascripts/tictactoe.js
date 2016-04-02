$(document).ready(function(){
  //getGames();
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

  $("#games").on('click', 'li', function(event) {
    getSingle(event.target);
    event.stopPropagation();
  });
  $("td").on('click', function(event) {
    doTurn(event.target);
    event.preventDefault();
  });
  //$('#getAllGames').on('click', function(event) {
   // getGames();
    //event.preventDefault;

  //});
  $('#save').on('click', function(event) {
    saveGame(event);

  });
  $('#previous').on('click', function(event) {
    //getPrevious();
    getAllGames(event);
    event.preventDefault();

  });

}

function doTurn(selector){
  updateState(selector);
  if(!checkWinner()){
    turn++;
  }else{
    saveGame();
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

function getAllGames(event){
  $('ul#games li').replaceWith('')
  $.get('/games').done(function(allGames){
   $(allGames.games).each(function(id){
      //$('div#games').
      $('ul#games').append('<li id="indi">' + (id + 1) + '</li>');
    });
  });
  //getSingle('ul#games li:last-child');
}

//function getPrevious(){
  //getSingle('ul#games li:last-child');
  //console.log($('div#games:last-child').html());
//}

function saveGame(event){
  //alert("this should save the game then reset the board");
  var boardPositions = [];
  $("table tr").each(function(row, tr){
    boardPositions.push($(tr).find('td:eq(0)').text())
    boardPositions.push($(tr).find('td:eq(1)').text())
    boardPositions.push($(tr).find('td:eq(2)').text())
  });
  var saveBoard = $.post('/games', su{state: boardPositions});

  saveBoard.done(function(data){

  });
  resetBoard();
}

function getSingle(selector){
  var id = $(selector).text();
   var gameId = parseInt(id, 10);
    $.get('/games/' + gameId).done(function(data){
      var state = data["game"]["state"];
      console.log(state);
      loadGamePositions(state);
  });
}

function loadGamePositions(board){
  var position = -1;
  $("table tr").each(function(row, tr){
       position++;
   $(tr).find('td:eq(0)').text(board[position]);
       position++;
   $(tr).find('td:eq(1)').text(board[position]);
       position++;
   $(tr).find('td:eq(2)').text(board[position]);
 });
}




