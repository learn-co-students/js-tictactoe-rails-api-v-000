// Code your JavaScript / jQuery solution here
var winConditions = [[0,1,2],
                      [3,4,5],
                      [6,7,8],
                      [0,3,6],
                      [1,4,7],
                      [2,5,8],
                      [0,4,8],
                      [2,4,6]];

var turn = 0;
var board = ['', '', '', '', '', '', '', '', ''];
var currentGameId = 0;


var player = function(){
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(position) {
  position.innerHTML = player();
  loadBoard();
}

var message = function(message){
  $("#message").text(message);
}

var loadBoard = function(){
     board = []
    document.querySelectorAll("[data-y]").forEach(function(cell){
     board.push(cell.innerHTML)
 })
}

var resetBoard = function() {
  turn = 0
  $("td").html('');
}



var clearGame = function() {
  resetBoard();
}


function checkWinner() {
  //LOAD BOARD TO GET THE BOARD STATE
  loadBoard();
  for (var i = 0; i < winConditions.length; i++) {
    var row = winConditions[i];
    if (board[row[0]] == board[row[1]] && board[row[2]] == board[row[1]] && board[row[0]] != ""){
      message(`Player ${board[row[0]]} Won!`)
      return true;
    }
  }
  return false
}

function doTurn(position) {
  updateState(position);
  turn += 1;
  if (checkWinner()) {
    save();
    resetBoard();
  } else if ((!checkWinner()) && turn ===9) {
    var msg = "Tie game.";
    save();
    message(msg);
  };
}


var save = function() {
  var myArray = [];
  document.querySelectorAll("[data-y]").forEach(function(cell){
    myArray.push(cell.innerHTML);
  });
  var gameButtons = document.getElementsByClassName("gameButton");
  var action = "post";
  if (gameButtons.length === 0) {
    action = "post";
  } else {
    for (var i=0; i < gameButtons.length; i++) { 
      if (gameButtons[i].id === currentGameId) {
        action = "patch";
        break;
      }
    }
  }
  if (action === "post") {
    $.ajax({
      type: 'POST',
      url: '/games',
      data: {state: myArray},
      success: function(data) {
        console.log("Game " + data.data.id + " saved!");
      }
    });
  } else {
    $.ajax({
      type: 'POST',
      url: '/games/' + currentGameId,
      data: {state: myArray, _method: 'put' },
      success: function(data) {
        console.log("Game " + data.data.id + " updated!");
      }
    });
  }  
};


var showAllGames = function() {
  Array.prototype.contains = function(val) {  //extended Array prototype to easily compare visible button values(in an array) to data ids
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) {
        return true;
      }
    }
    return false;
  }

  var gameButtons = document.getElementsByClassName("gameButton"); // accesses all game buttons in the current window
  var buttonIds = Array.prototype.map.call(gameButtons, function(el) { // gathers all existing game button ids into an array
      return el.id;
  });

  $.ajax({
    type: 'GET',
    url: '/games',
    success: function(data) {
      $.each(data.data, function(i, item) {
        var game = data.data[i];       
        if (!(buttonIds.contains(game.id))) {
          
          var myButton = $('<button type="submit" class="gameButton" data-value=' + '"' + game.attributes.state + '"' + '  id=' + '"' + game.id + '"' + '>' + 'Game ' + game.id + '</button>');
          myButton.appendTo($('#games'));
        }
      });
    }
  });
};



$(document).ready(function() {
   attachListeners();
 })

var attachListeners = function() {


 $("tbody").click(function(e) {
   if (e.target.innerHTML == "" && !checkWinner()){
    doTurn(e.target);
   }
 });

 $("#save").click(function() {
  save();

 });

 $("#previous").click(function() {
  showAllGames();

 });

 $("#clear").click(function() {
   clearGame();
 });

  $(document).on('click', '.gameButton', function() {
    var gameState =  ($(this).data('value')).split(",");
    var gameTurn= 0;
    currentGameId = (this.id);

    var squares = document.querySelectorAll("[data-y]");
    for (var i=0; i < 9; i++) {
      squares[i].innerHTML = gameState[i];
      if (gameState[i] === "X" || gameState[i] === "O") {
        gameTurn += 1;
      }
    };
    turn = gameTurn;
  })
}



