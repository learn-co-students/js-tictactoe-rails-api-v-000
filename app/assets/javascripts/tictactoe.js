var turn = 0;
var currentGame = 0;

var winCombos = [
  [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]
  ]


function doTurn(xPosition, yPosition){
  updateState(xPosition, yPosition);
  turn ++;
  checkWinner();
}

function checkTie(board){
 for(var i=0; i< board.length; i++) {
    if(board[i] === "") return false;
  }
  return true;
}

function checkWinner(){
  var board = checkBoard();
  for (var i = 0; i < winCombos.length; i++){
    combo = winCombos[i];
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != ""){
      var winner = board[combo[0]];
      var string = "Player " + winner + " Won!"
      message(string);
      break
    } else {
      var result = false;
    }
  }
  if (checkTie(board) === true ){
    message("Tie game")
  } else {
  return result;
  }
}

function checkBoard() {
  var board = [];
  $('td').each(function(index,item){
    board.push(item.innerHTML);
  });
  return board;
}

function updateState(xPosition, yPosition){
  var token = player();
  $('td[data-x="' + xPosition + '"][data-y="' + yPosition + '"]').text(token);
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function message(string){
  $('#message').html(string);
  saveGame(true);
  resetBoard();
}

function resetBoard(){
  turn = 0;
  $('td').each(function(){
    $(this).text("");
  })
}

function boardState(){
  var board = []
  $('td').each(function(){
    board.push($(this).text());
  });
  return board;
}

function saveGame(resetCurrentGame){
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: { 
      game: {
        state: boardState()
        }
      },
      success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data["game"]["id"];
      }
    }
  });
}

function returnGames(){
  $.ajax({
    url: '/games',
    method: 'GET',
    dataType: "json",
    success: function(data) {
      allGames = data["games"]
      var html = ""
      for (var i = 0; i < allGames.length; i++) {
        html += "<li data-gameid=" +  allGames[i]["id"] + " data-state=" + allGames[i]["state"] + ">" + allGames[i]["id"] + "</li>"
      };
      $('#games').html(html);
      loadGame(data);
    }
  });
}

function loadGame(data){
  $('li').on('click', function(){
    currentGame = $(this).data("gameid");
    var state = $(this).data("state").split(",");
    for(var i = 0; i < state.length; i++){
      $('td:eq(' + i + ')').text(state[i]);
    }
  });
}

function attachListeners(){
  $('td').on("click", function(){
    var x = $(this).data("x");
    var y = $(this).data("y");
    doTurn(x, y);
  });
  $('#save').on('click', function(){
    saveGame();
  });
  $('#previous').on('click', function(){
    returnGames();
  });
  
}

$(function() {
  attachListeners();
});
 