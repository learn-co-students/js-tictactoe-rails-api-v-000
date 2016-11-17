
$(document).ready(function(){
  attachListeners();
});

var turn = 0;
var currentGame = 0;
var counter = 0;
var wins = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function attachListeners(){
  $('td').on('click', function(event) {
    if (event.target.innerHTML == "") {
      doTurn(event);
    };
  });

  $('#save').on('click', function() {
    if(counter === 0){
      saveGame();
      counter++
    } else {
      updateGame();
    }
  });

  $('#previous').on('click', function() {
    listGames();
  })
};

function doTurn(event){
  updateState(event);
  if (checkWinner()) {
  } else {
  turn += 1;
  }
};

function checkWinner(){
  var box_values = getBoard();
  var game_status = null;
  for(var i = 0; i < wins.length; i++){
    var a = box_values[wins[i][0]];
    var b = box_values[wins[i][1]];
    var c = box_values[wins[i][2]];
    if (a == b && a == c && a != 0){
      game_status = 'Player ' + a + ' Won!';
      endGame(game_status);
      }
    }
    if (gameOver()) {
      game_status = 'Tie game';
      endGame(game_status);
    } else {
    return false;
  }
};

function endGame(status) {
  message(status);
  saveGame();
  resetBoard();
}


function updateState(event){
  var move = player();
  $(event.target).text(move);
};

function player(){
  if ((turn % 2) == 0) {
    return "X";
  } else {
    return "O";
  }
};

function message(string){
  $('#message').html(string);
};

function resetBoard(){
  $('td').text("");
  turn = 0;
  turn -= 1;
  currentGame = 0;
}

function gameOver(){
  var box_values = getBoard();
  if (box_values.includes("")){
    return false;
  } else {
    return true;
  }
}

function getBoard(){
  var box_values = []
  var boxes = document.getElementsByTagName('td');
  for (var i = 0; i < boxes.length; i++) {
    box_values.push(boxes[i].innerHTML)
  };
  return box_values;
}

function saveGame() {
  $.ajax({
    url: '/games',
    method: 'POST',
    dataType: "json",
    data: {
      game: {
        state: getCurrentState()
      }
    },
    success: function(data) {
      currentGame = data.game.id;
    }
  });
};

function updateGame(){
  $.ajax({
    url: "/games/" + currentGame,
    method: "PATCH",
    dataType: "json",
    data: {
      game: {
        state: getCurrentState()
      }
    },
    success: function(data) {
      currentGame = data.game.id;
    }
  });
};

function getCurrentState() {
  var board = [];
  $("td").each(function() {
    board.push($(this).text())
  })
  return board
}

function listGames(){
  $("#games").text("");
  $.get('/games', function(data) {
    data = data.games
    $.each(data, function(index, game) {
      $("#games").append("<li>" + game.id + "</li>");
    })
  })
}
