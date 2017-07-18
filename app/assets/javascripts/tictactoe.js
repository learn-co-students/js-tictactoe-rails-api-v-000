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
  turn = 0;
  currentGameId = 0;
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

var doTurn = function(element){
   updateState(element);
   if(checkWinner() || tie()) {
     save();
     resetBoard();
   } else {
     turn += 1;
   }
 }

 var tie = function() {
   var tie = true;
   $("td").each(function() {
     if ($(this).html() === "") {
       tie = false;
     }
   });

   if (tie) {
     message("Tie game.");
   }

   return tie;
 }

var save = function() {
  var method;
  var url;
  var value = {
    state: loadBoard()
  }

  if(currentGameId > 0) {
    url = "/games/" + `${currentGameId}`
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    data: value,
    success: function(game) {
      currentGameId = game.data.id;
    }
  })
};

var showAllGames = function() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
      });
    }
  });
}

function reloadGame(gameID) {
    message("");
    $.get('/games/' + gameID, function(data) {
        var index = 0, state = data.data.attributes.state;
        for (var y = 0; y < 3; y++){
            for (var x = 0; x < 3; x++) {
                $("[data-x='" + x + "'][data-y='" + y + "']").html(state[index]);
                index++;
            }
        }

        turn = state.join("").length;
        currentGame = data.data.id;

        if(!checkWinner() && turn == 9){
            message('Tie game.');
        }
    })
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

  $(document).on('click', '.gameButton', function() { //this is actually memoized, will convert tomorrow to api call
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
