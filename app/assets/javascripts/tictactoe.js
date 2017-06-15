var turn = 0
var currentGame = 0
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[2,0],[1,1],[0,2]]
]

function attachListeners() {
  $('td').click(function(event){
    doTurn(event);
  });

  $('#previous').click(function(event){
    getAllGames(event);
  });

  $('#save').click(function(){
    saveGame();
  });

  $('#games').click(function(response){
    changeGame(response);
  });
}

function doTurn(event) {
  updateState(event);
  if (checkWinner()) {
    saveGame(checkWinner());
    reset();
  } else {
    turn += 1;
  }
}

function checkWinner() {
  var returnValue = false;
  winningCombos.forEach(function(combo) {
    var xValue1 = combo[0][0];
    var yValue1 = combo[0][1];
    var xValue2 = combo[1][0];
    var yValue2 = combo[1][1];
    var xValue3 = combo[2][0];
    var yValue3 = combo[2][1];

    var comboOne = $('[data-x="' + xValue1 + '"][data-y="' + yValue1 + '"]').html();
    var comboTwo = $('[data-x="' + xValue2 + '"][data-y="' + yValue2 + '"]').html();
    var comboThree = $('[data-x="' + xValue3 + '"][data-y="' + yValue3 + '"]').html();

    if(comboOne === comboTwo && comboTwo === comboThree && comboThree === "X") {
      message("Player X Won!");
      returnValue = true;
    } else if(comboOne === comboTwo && comboTwo === comboThree && comboThree === "O") {
      message("Player O Won!");
      returnValue = true;
    } else if(turn === 8) {
      message("Tie game");
      returnValue = true;
    }
  });
  return returnValue;
}

function updateState(event) {
  $(event.target).html(player());
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  }else {
    return "O";
  }
}

function changeGame(response) {
  var state = $(response.target).data("state").split(",");
  var id = $(response.target).data("gameid")
  currentGame = id;

  for (i = 0; i < state.length; i++) {
    var cell = state[i];
    var query = 'td:eq(' + i + ')'
    $(query).html(cell)
  }
}

function message(string) {
  $('#message').html(string)
}

function saveGame(resetCurrentGame) {
    var url;
    var method;
    var stateArr = [];

    if (currentGame === 0) {
      url = "/games";
      method = "POST";
    } else {
      url = "/games/" + currentGame;
      method = "PATCH";
    }

    $('td').each(function(index) {
      stateArr.push($(this).text())
    })

    $.ajax({
      url: url,
      method: method,
      dataType: "json",
      data: {game: {state: stateArray}},
      success: function(data) {
        if(resetCurrentGame) {
          currentGame = 0;
        } else {
          currentGame = data.game.id;
        }
      }
    });
}

function getAllGames() {
  $.getJSON("/games").done(function(response){
    if (response.games.length != 0) {
      showGames(response.games)
    }
  });
}

function showGames(games) {
  var page = $()
  games.forEach(function(game) {
   page = page.add($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}));
  });
  $("#games").html(page);
}

function reset() {
  $('td').html("");
  turn = 0;
  currentGame = 0;
}
