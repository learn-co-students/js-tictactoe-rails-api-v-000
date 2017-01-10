var turn = 0;
var currentGame = 0;
var WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

$(document).ready(function() {
  attachListeners();
});

function currentState() {
  var currentState = [];
  $('td').each(function(index){
    currentState.push( $(this).text() );
  });
  return currentState;
}

function attachListeners() {
  $('td').click(function(event) {
    doTurn(event);
  });

  $('#previous').click(function(event){
    $.get("/games", function(data){
      var games = data["games"];
      $("#games").text("");
      data["games"].forEach(function(value){
        $("#games").append("<p>" + value["id"] + "</p>");
      })

      console.log(games);
    });
  });

  $("#save").click(function(event){
    if (currentGame > 0){
      $.ajax({
        url: '/games/' + currentGame,
        type: 'PATCH',
        data: { game: { state: currentState() } }
      });
    }
    else {
      $.post("/games", { game: { state: currentState() } }, function(result){
        currentGame = result.game.id;
      });
    }
  })
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn ++;
}

function player() {
  var playerSym = "O";
  if (turn % 2 === 0){
    playerSym = "X";
  }
  return playerSym
}

function updateState(event) {
  var symbol = player();
  $(event.target).text(symbol);
}

function checkWinner() {
  var cells = [];
  var winner = false;
  var result;
  $('td').each(function(index){
    cells.push( $(this).text() );
  });

  var cellCount = 0
  cells.forEach(function(value){
    if(value != ""){
      cellCount ++;
    }
  });

  WIN_COMBINATIONS.forEach(function(combo){
    if ( (cells[combo[0]] === cells[combo[1]]) && (cells[combo[0]] === cells[combo[2]]) ) {
      if (cells[combo[0]] === "X"){
        result = "Player X Won!";
        message(result);
        winner = true;
      }
      else if (cells[combo[0]] === "O") {
        result = "Player O Won!";
        message(result);
        winner = true;
      }
    }
    else if (cellCount === 9){
      result = "Tie game";
      message(result);
    }
  });

  return winner;
}

function message(result) {
  $("#message").text(result);
  $.post("/games", { game: { state: currentState() } });
  resetBoard();
}

function resetBoard(){
  turn = -1;
  currentGame = 0;
  $('td').each(function(index){
    $(this).text("");
  });
}

function getCurrentGame(){
  return currentGame;
}
