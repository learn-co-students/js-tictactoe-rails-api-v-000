var gameUrl = "/games";
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
      $.getJSON(gameUrl).done(function (data) {
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
  var url = currentGame === 0 ? gameUrl : gameUrl+ "/"+currentGame
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

// $(function(){
//   attachListeners();
// });

// var turn = 0;
// var currentGame;
// var gameUrl = '/games'

// function attachListeners(){
//   $('td').click(function(event){
//     doTurn(event)
//   });

//   $('#games').on('click', function(event){
//     loadSavedGame(event);
//   });

//   $('#previous').on('click', function(event){
//     getAllGames();
//   });

//   $('#save').on('click', function(){
//     save();
//   });
// }

// function doTurn(event) {
//   updateState(event);
//   if (checkWinner()){
//     save(true);
//     resetBoard();
//   } else {
//     turn += 1;
//   }
// }

// function insertPrevGames(){
//   $.get(gameUrl, function(data){
//     var games = data["games"];
//     if (games.length > 0){
//       var gameString = "";
//       games.forEach(function(game){
//         gameString += ("<div data-gameid=" + game.id + ">" + game.id + "</div>");
//       });
//       $('#games').append(gameString);
//     }
//   });
// }

// function loadSavedGame(event){
//   var id = event.target.textContent;
//   $.get(gameUrl + id, function(data){
//     currentGame = data["id"];
//     turn = 0;
//     var state = data["state"];
//     for (var i = 0; i < state.length; i++) {
//       if (state[i] == "X" || state[i] == "O") {
//         turn += 1;
//       }
//       $('[data-x=' + i % 3 + '][data-y=' + Math.floor(i/3) + ']').text(state[i]);
//     }
//   });
// }

// var getAllGames = function(){
//   $.getJSON(gameUrl).done(function(response) {
//     showGames(response.games)
//   })
// }

// var showGames = function(games) {
//   var dom = $()
//   games.forEach(function(game){
//     dom = dom.add(showGame(game));
//   });
//   $('#games').html(dom)
// }

// var showGame = function(game) {
//   return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
// }

// var save = function(reset=false){
//   var method;
//   var reqUrl;
//   if (currentGame) {
//     method = "PATCH";
//     reqUrl = gameUrl + currentGame;
//   } else {
//     method = "POST";
//     reqUrl = gameUrl;
//   }
//   $.ajax({
//     url: reqUrl,
//     type: method,
//     dataType: 'json',
//     data: { 'game': {
//       'state': currentState(),
//       'id': currentGame
//       }
//     },
//     success: function(resp, text, xhr){
//       if(reset){
//         currentGame = 0;
//       } else {
//         currentGame = resp["id"] || resp["game"]["id"];
//       }
//     }
//   });
// }

// var currentState = function(){
//   var state = [];

//   $('td').each(function(index,td){
//     state.push($(td)[0].innerText);
//   });
//   return state;
// }

// function checkWinner(){
//   var td1 = $('td[data-x="0"][data-y="0"]')[0];
//   var td2 = $('td[data-x="1"][data-y="0"]')[0];
//   var td3 = $('td[data-x="2"][data-y="0"]')[0];

//   var td4 = $('td[data-x="0"][data-y="1"]')[0];
//   var td5 = $('td[data-x="1"][data-y="1"]')[0];
//   var td6 = $('td[data-x="2"][data-y="1"]')[0];

//   var td7 = $('td[data-x="0"][data-y="2"]')[0];
//   var td8 = $('td[data-x="1"][data-y="2"]')[0];
//   var td9 = $('td[data-x="2"][data-y="2"]')[0];
//   const winningTds = [
//     [td1, td2, td3],[td4, td5, td6],[td7, td8, td9],
//     [td1, td4, td7],[td2, td5, td8],[td3, td6, td9],
//     [td1, td5, td9],[td3, td5, td7]
//   ]
//   var msg = "";
//   var won = false;
//   winningTds.forEach(function(td){
//     if (td[0].textContent === "X" && td[1].textContent === "X" && td[2].textContent === "X")  {
//       msg = "Player X Won!";
//       won = true;
//     } else if (td[0].textContent === "O" && td[1].textContent === "O" && td[2].textContent === "O") {
//       msg = "Player O Won!";
//       won = true;
//     } else {
//       if (turn == 8) {
//         msg = "Tie game";
//         won = true;
//       }
//     }
//   });
//   message(msg);
//   return won;
// }

// function updateState(event){
//   var td = event.target;
//   if (td.textContent !== "X" && td.textContent !== "O") {
//     $(td).text(player());
//   }
// }

// function player() {
//   if (turn % 2 == 0) {
//     return "X"
//   } else {
//     return "O"
//   }
// }

// function message(string){
//     $('#message').text(string);
// }

// function resetBoard(){
//   turn = 0;
//   $('td').each(function(){
//     $(this).html("");
//   });
// }