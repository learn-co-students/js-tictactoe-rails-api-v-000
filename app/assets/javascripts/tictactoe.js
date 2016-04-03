$(document).ready(function(){
  attachListeners();
});

var gameid = null;
var turn = 0;


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

  });
  $("td").on('click', function(event) {
    doTurn(event.target);
  });

  $('#save').on('click', function(event) {
    saveGame(event);

  });
  $('#previous').on('click', function(event) {
    getAllGames(event);
  });

}

function doTurn(selector){
  updateState(selector);
  if(!checkWinner()){
    message("");
    turn++;
  }else{
    saveGame();
  }
};

function updateState(selector){
  if($(selector).text() === ""){
    $(selector).text(player);
  }
};

function checkWinner() {
  var won = false;
  var tie = false;
  var notOver = true;
  $.each(winningCombinations, function (index, combo) {
    if($(combo[0]).text() === player() && $(combo[1]).text() === player() && $(combo[2]).text() === player()) {
      won = true;
    }else if(turn === 8){
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

function resetGame(){
  turn = 0
  gameid = null;
  $("td").text("");
};

function resetBoard(){
  turn = 0
  $("td").text("");
}


function message(text) {
  $('div#message').text(text);
};


var currentGame = function(){
  return gameid;
};

function getAllGames(event){
  $('#games li').replaceWith('');
  $.get('/games').done(function(data){
    var gamesArr = data["games"];
    gamesArr.forEach(function(game){
    gameid = game["id"];
    $('#games').append('<li data-gameid="'+gameid+'">' + gameid + '</li>');
    });
  });
}

function saveGame(event){
  var boardPositions = [];
  $("table tr").each(function(row, tr){
    boardPositions.push($(tr).find('td:eq(0)').text())
    boardPositions.push($(tr).find('td:eq(1)').text())
    boardPositions.push($(tr).find('td:eq(2)').text())
  });
  if(gameid === null){
    var saveNewBoard = $.ajax({
      type: "POST",
      url: '/games',
      data: {state: boardPositions},
      success: {}
    });

    saveNewBoard.done(function(data){
      gameid = data["game"]["id"]
    });

  }else{
    var saveOldBoard = $.ajax({
      type: "PATCH",
      url: '/games/'+gameid, 
      data: {state: boardPositions},
      success: {}
    });

    saveOldBoard.done(function(data){
    });
  }
  resetGame();
}

function getSingle(selector){
   gameid = $(selector).text();
    $.get('/games/' + gameid).done(function(data){
      var state = data["game"]["state"];
      gameid = data["game"]["id"]
      loadGamePositions(state);
  });
}

function loadGamePositions(board){
  resetBoard();
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




