var game_url = "/games";
var turn = 0;
var currentGame = 0;
var currentState = false;
WINCOMBO = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6],[1,4,7], [2,5,8],[0,4,8], [6,4,2]];
var board = ["", "", "", "", "", "", "", "", ""];

function attachListeners() {
  $('td').each(function() {
    var self = $(this);
     self.click(function() {
       if(self.html() === "" && currentState === false){
        doTurn(self)
      }
    });

  });
  getAllGames()
  saveGame()

}

function doTurn(data) {
  updateState(data)
  turn +=1 ;
  checkWinner()
  if(currentState)
  {
    message("Player " + currentState + " Won!")
    requestGameSave()
    resetting()

  }else if(!(board.includes(""))){
    message("Tie game")
    resetting()
  }
}


function resetting() {
  board = ["", "", "", "", "", "", "", "", ""];
  turn = 0;
  currentGame = 0;
  currentState = false;
  $('td').each(function() {
    $(this).html("");
  });

}

function checkWinner() {

  WINCOMBO.forEach(function(value, index){
    if(board[value[0]] == board[value[1]] && board[value[1]] == board[value[2]] && board[value[0]] !== ""){
      currentState = board[value[0]];
    }
  });
  return currentState;
}

function updateState(data) {
  var x = $(data).data('x');
  var y = $(data).data('y');
  switch(y){
    case 1:
      x += y+2;
      break;
    case 2:
      x += y+4;
      break;
    default:
      x;
    }

  board[x] = player();
  $(data).html(board[x]);

}


function player() {
  return (turn % 2 == 0) ? "X" : "O"
}

function message(data) {
  $("#message").text(data);
}



function getAllGames() {
  $('#previous').click(function() {
      resetting()
      $.getJSON(game_url).done(function (data) {
        var games = data['games'];
        var html = "";
        games.forEach(function(game) {
            html += "<li data-gameid="+game.id+">"+ game.id + "</li>"
        });
        $('#games').html(html);
        loadGame(games)
    });
  });

}

function loadGame(games) {
  $('li').each(function() {
    var self = $(this);
     self.click(function() {
          var index = self.data('gameid') - 1;
          currentGame = games[index]['id']
          board = games[index]['state']
          turn = board.reduce(turn_count, 0);
          currentState = checkWinner()
          showGame()
    });
  });

}

function showGame() {
    $('td').each(function(index) {
      $(this).html(board[index])
  })

}

function turn_count(turn, moves) {
  if(moves !== "") turn++;
  return turn;
}



function requestGameSave() {
  var data = {
    game: {
      state: board
    }
  }
  var preState = currentState;
  var url = currentGame === 0 ? game_url : game_url+ "/"+currentGame
  var requestType = currentGame === 0 ? "POST" : "PATCH"
  $.ajax({
    type: requestType,
    url: url,
    data: data,
    dataType: 'json',
    success: function (response) {
      if(!preState){
        currentGame = response['game']['id'];
      }
    }
  });

}

function saveGame() {
  $('#save').click(function() {
      requestGameSave()
  });

}

$(function() {
  attachListeners()
})
