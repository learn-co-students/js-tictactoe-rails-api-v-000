var turn = 0;
var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var dictionary = { 0: [0,0], 1:[1,0], 2:[2,0], 3:[0,1], 4:[1,1], 5:[2,1], 6:[0,2], 7:[1,2], 8:[2,2]}
var game = { state: ["", "", "", "", "", "", "", "", ""], id: undefined };
var savedGames;
var currentGame = 0;
var saved = false;

$( document ).ready(function() {
    attachListeners();
});


function attachListeners() {
  $("[data-x]").click(function(event){
    var current = $(event.target)
    if (current.text() === "") {
      doTurn(event);
    }
  });
  $("#previous").click(getAllGames);
  $("#save").click(function() {
    if (game.id) {
      updateGame();
    } else {
      saveGame();
    }
  });
};


function doTurn(event) {
  updateState(event);
  turn++;
  string = checkWinner();
  if (string) {
    message(string);
    console.log("turn reset");
    resetBoard()
    $('td').text("");
    turn = 0;
  }
  console.log(game);
};

function player() {
  if (turn === 0 || turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
};

function updateState(event) {
  var playerToken = player();
  var x = event.target.dataset.x;
  var y = event.target.dataset.y;
  var myVal = [parseInt(x), parseInt(y)];
  var space = getSpot(myVal);
  game.state[space] = playerToken;
  $(event.target).text(playerToken);
};

function saveGame(over){
  $.ajax({
      method: "post",
      url: "/games",
      data: game
    }).done(function(response){
      console.log("setting id");
      if (over) {
        resetBoard();
      } else {
        game.id = response.game["id"];
      }
    });
}

function updateGame(over) {
  $.ajax({
    method: 'patch',
    url: '/games/' + game.id,
    data: game
  }).done(function(){
    if (over) {
      resetBoard();
    }
  });
}

function checkWinner() {
  var over = false;
  loop1:
  for (var combination in winningCombos) {
    if ((game.state[winningCombos[combination][0]] === game.state[winningCombos[combination][1]]) && (game.state[winningCombos[combination][0]] === game.state[winningCombos[combination][2]]) && (game.state[winningCombos[combination][0]] !== "")) {
      over = 'Player ' + String(game.state[winningCombos[combination][0]]) + ' Won!'
      break loop1;
    } else if (turn == 9) {
      over = "Tie game"
      break loop1;
    }
  }
  if (over && saved ) {
    updateGame(over);
    return over;
  } else if ( over && !saved) {
    saveGame(over);
    return over;
  } else {
    return over;
  }
};

function getAllGames() {
  $.ajax({
      method: "get",
      url: "/games"
    }).success(function(response){
      savedGames = response.games;
      if (response.games.length > 0) {
        $("#games").html("");
        response.games.forEach(function(game){
          $("#games").append("<li data-gameid=" + game.id + ">" + game.id + "</li>")
        });
        $("#games li").click(fetchAndDisplay);
      }
    });
}

function fetchAndDisplay(event) {
      game.id = parseInt(event.target.dataset.gameid)
      var tempGame = savedGames.filter(function( obj ) {
        return obj.id == game.id;
      });
      game.state = tempGame[0].state;
      turn = 0;
      saved = true;
      for (var space in game.state) {
        $('[data-x=' + dictionary[space][0] + '][data-y=' + dictionary[space][1] +']').text(game.state[space]);
        if (game.state[space] != "") {
          turn++;
        }
      }
    };



function message(string) {
  $("div#message").text(string);
};

function getSpot(value) {
  for (var key in dictionary) {
    if ((dictionary[key][0] == value[0]) && (dictionary[key][1] == value[1])) return key;
  }
  return false;
};

function resetBoard() {
  console.log("resetting");
  game.state = ["", "", "", "", "", "", "", "", ""];
  game.id = 0;
  $('td').text("");
  turn = 0;
  saved = false;
};
