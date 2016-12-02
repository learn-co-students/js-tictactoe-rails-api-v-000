var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];
var currentGame = 0;

var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function message(string) {
  $("#message").html(string);
}


function attachListeners() {
  $('td').on('click', function(){
    var selector = this;
    doTurn(selector);
  });

  $('#save').on('click', function(){
    saveGame();
  });
  $('#previous').on("click", function() {
    previousGames();
  });
}

function saveGame() {

  var values = {
    game: {
      state: state
    }
  };

  if (currentGame === 0) {
    url = "/games";
    method = "POST";
  } else {
    url = `/games/${currentGame}`;
    method = "PATCH";
  }

  $.ajax({
    url: url,
    method: method,
    data: values,
    dataType: "json",
    success: function(data) {
      currentGame = data["id"];
    }
  });
}

function previousGames() {
  $.ajax({
    url: "/games",
    method: "GET",
    dataType: "json",
    success: function(data) {
      var list = document.getElementById("games");
      while (list.hasChildNodes()) {
          list.removeChild(list.lastChild);
      }
      var prevGames = data["games"];
      var prevText ="";
      for (i=0; i < prevGames.length; i++) {
        prevText += "<p>" + prevGames[i]["id"] + "</p>";
      }
      console.log(prevText);
      $("#games").append(prevText);
    }

  });
}

function doTurn(selector) {
  var triggerReset = false;
  updateState(selector);
  if (checkWinner() || checkTied()) {
    triggerReset = true;
  };
  turn++;
  if (triggerReset === true) {
    resetBoard();
  }
}

function resetBoard() {
  currentGame = 0;
  turn = 0;
  state = ["", "", "", "", "", "", "", "", ""];
  $('td').html("");
}


function checkTied() {
  if (turn == 8) {
    message("Tie game");
    return true;
  } else {
    return false;
  }
}

function checkWinner() {

  for (i = 0; i < winningCombos.length; i++) {
    if(isThisWinningCombo(winningCombos[i]) === true) {
      message('Player '+ player() +' Won!');
      return true;
    }
  }
  return false;
}

function addX(selector) {
  if (selector.dataset.x == "1") {
    return 1;
  } else if (selector.dataset.x == "2") {
    return 2;
  } else {
    return 0;
  }
}

function updateState(selector) {
  var id = 0; //finding index for state array from td data-x and data-y
  if (selector.dataset.y == "1") {
    id += 3;
    id += addX(selector);
  } else if (selector.dataset.y == "2") {
    id += 6;
    id += addX(selector);
  } else {
    id += addX(selector);
  }
  state[id] = player();
  // console.log(state);
  $(selector).html(player());
}

function player() {
  if (turn%2 == 0) {
    return "X";
  }  else {
    return "O";
  }
}



function isThisWinningCombo(combo) {
  return state[combo[0]] === state[combo[1]] && state[combo[1]] === state[combo[2]] && state[combo[0]] != "";
}

$(document).ready(function(){
  attachListeners();
});
