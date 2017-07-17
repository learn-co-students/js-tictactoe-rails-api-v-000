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
var currentGame = 0;


var player = function(){
  return turn % 2 === 0 ? "X" : "O";
}

// var updateState = function(e){
//   var result = player()
//   $(e.target).text(result);
// }

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

var save = function() {
  var myArray = [];
  document.querySelectorAll("[data-y]").forEach(function(cell){
    myArray.push(cell.innerHTML);
  });
  $.ajax({
    type: 'POST',
    url: '/games',
    state: 'myArray',
    success: function(data) {
      alert("Game " + (data.data.id) + " saved!");
    }
  })
}

var clearGame = function() {
  resetBoard();
}

var showAllGames = function() {
  Array.prototype.contains = function(val) {  //extended Array prototype to easily compare visible button values(in an array) to data ids
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) {
        return true;
      }
    }
    return false;
  }
  var gameButtons = document.getElementsByClassName("gameButton"); // accesses all game buttons currently in the current window
  var buttonIds = Array.prototype.map.call(gameButtons, function(el) { // this gathers all existing game button ids in an array
      return el.id;
  });

  $.ajax({
    type: 'GET',
    url: '/games',
    success: function(data) {
      $.each(data.data, function(i, item) {
        var game = data.data[i];
        if (!(buttonIds.contains(game.id))) {
          var myButton = $('<button type="submit" class="gameButton" value=' + '"' + game.attributes.state + '"' + 'id=' + '"' + game.id + '"' + '>' + 'Game ' + game.id + '</button>');
          myButton.appendTo($('#games'));
        }
      });
    }
  });
};

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

   $(".gameButton").click(function(e) {
    console.log(e.target.id);
   })
}


