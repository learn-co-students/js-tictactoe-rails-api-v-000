var turn = 0;
var currentGame = 0;
var gamestate;
var winCombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];





$(function(){
  attachListeners();
});



function attachListeners(){

  $('td').on('click', function(e){
    doTurn(e);
  });

  $('#previous').on('click', function(){
    showPrevious();
  });

  $('#games').on('click', function(e){
    gamestate = $(e.target).data("state").split(",")
    loadGame(gamestate, $(e.target).data("gameid"));
  });

  $('#save').on('click', function(){
    saveGame();

  });
}


function doTurn(e){
  updateState(e);
  if (checkWinner()) {
    saveGame(true);
    resetBoard();
  }
    else {
     turn += 1;
  }
}

function player(){
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(e){
  var entry = player();
  $(e.target).text(entry);
  message("");
}

function message(string){
  $('div#message').text(string);
}

function resetBoard() {
  turn = 0;
  currentGame = 0;
  $("td").html("");
}

var populateBoard = function(entry) {
  $("td").each(function(i) {
    $(this).text(entry[i]);
  })
};

var getBoard = function() {
  var board = []
  $("td").each(function(i) {
    board.push($(this).text())
  })
  return board;
};


function checkWinner(){
if (winner()){
  message("Player " + player() + " Won!");
  return true;
  } else if (turn == 8){
  message("Tie game");
  return true;
  }
  else {
  return false;
  }
}


function winner(){

  var cell1 = $("td:eq(0)").text();
  var cell2 = $("td:eq(1)").text();
  var cell3 = $("td:eq(2)").text();
  var cell4 = $("td:eq(3)").text();
  var cell5 = $("td:eq(4)").text();
  var cell6 = $("td:eq(5)").text();
  var cell7 = $("td:eq(6)").text();
  var cell8 = $("td:eq(7)").text();
  var cell9 = $("td:eq(8)").text();

  var gameBoard = [cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9];

  return winCombo.find(function(combo){
  return (gameBoard[combo[0]] === 'X' && gameBoard[combo[1]] === 'X' && gameBoard[combo[2]] === 'X') || (gameBoard[combo[0]] === 'O' && gameBoard[combo[1]] === 'O' && gameBoard[combo[2]] === 'O')
 });
}

function currentState(){
  return  $('td').map(function(index, item){
     return $(item).text();
    });
}


function showPrevious(){

  $.getJSON("/games").done(function(resp) {

   resp.games.forEach(function(game) {
  // debugger;
    $("#games").append("<li data-state="+game.state+" data-gameid='"+game.id+"'>"+game.id+"</li>");
  });

 });

}

function loadGame(gamestate, gameid){
    populateBoard(gamestate);
    currentGame = gameid;
    var turn = 0;
    gamestate.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
 };


function saveGame(bool){
  var method;
  var url;
  if (currentGame === 0) {
    method = "POST";
    url = '/games';
  }
  else {
    method = "PATCH";
    url = '/games/' + currentGame;
  }
  $.ajax({
    url: url,
    type: method,
    dataType: 'json',
    data: { 'game': {
      'state': getBoard()
      }
    },
    success: function(resp, text, xhr){
      if(bool){
  //      alert("reset!")
        currentGame = 0;
      }
      else {
  //      alert('did not reset!')
        currentGame =  resp["game"]["id"];
      }
    }
  });
}
