var turn = 0
var currentGame = 0
var winCombinations = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
  ]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("table").click(function(event) {
    doTurn(event);
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
  $("#games").click(function(event) {
    var state = $(event.target).data("state").split(",")
    var id = $(event.target).data("id")
    changeGame(state, id)
  })
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || tie()) {
    save()
    resetGame()
  } else {
    turn += 1;
  }
}

function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  $(event.target).text(player());
}

function checkWinner() {
  for(var i = 0; i < winCombinations.length; i++) {
    if(board(winCombinations[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function board(winCombinations) {
  for(var i = 0; i < winCombinations.length; i++) {
    var winCombination = winCombinations[i];
    var x = winCombination[0];
    var y = winCombination[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (doesntMatch(selector)) {
      return false;
    }
  }
  return true;
}

function doesntMatch(selector) {
  return (selector.text() != player())
}

function tie() {
  if(!checkWinner() && fullBoard()) {
    message("Tie game");
    return true;
  }
}

function fullBoard () {
  var full = true
  $("td").each(function() {
    if($(this).html() == "") {
      full = false
  }})
  return full
}

function message(message) {
  $('#message').text(message);
}

function resetGame() {
  $('td').text("");
  turn = 0
  currentGame = 0
}

// Persistence Functionality

function save() {
  var values = {game: {state: collectState()}}
  if(currentGame == 0) {
    var post = $.post('/games', values)
    post.done(function(data) {
      currentGame = data["game"]["id"]
    })
  } else {
    var patchUrl = "/games/" + currentGame
    $.ajax({
      type: "PATCH",
      url: patchUrl,
      data: values,
      dataType: "JSON",
      success: function(){}
      // success: getAllGames()
    })
  }
}

function collectState() {
  var state = []
  $('td').each(function() {
    state.push($(this).text())
  })
  return state;
}

function getAllGames() {
  $.getJSON("/games").done(function(data) {
    printGames(data["games"]);
  })
}

function printGames(games) {
  $('#games').html("")
  games.forEach(function(game) {
    $('#games').append('<li data-state="' + game["state"] + '" data-id="' + game["id"] + '">' + game["id"] + '</li>')
  })
}

function changeGame(state, id) {
  implementState(state);
  currentGame = id;
  turn = findTurn(state);
}

function findTurn(state) {
  state.forEach(function(box) {
    if(box != "") {
      turn += 1;
    }
  })
  return turn;
}

function implementState(state) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  })
}
