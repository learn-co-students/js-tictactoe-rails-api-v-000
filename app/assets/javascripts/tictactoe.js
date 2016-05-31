var turn = 0;

var attachListeners = function() {
  $("tbody").click(function(e) {
    doTurn(e);
  });
  
  $("#previous").click(function(e){
    showGames();
  });
  var action = 0
  
  $("#save").click(function(e) {
    if ( action == 0 ) {
        saveGame()
        action++
    } else {
      updateGame();
    }
  });

  $("#games").click(function(e){
    var arr = $(e.target).text().split(",")
    $("td").each(function(index) {
    $(this).text(arr[index]);
    })
  })
}

function doTurn(e) {
  updateState(e);
  turn++
  checkWinner();
  checkTie();
}

function saveGame() {
  $.ajax({
    url: '/games',
    method: 'POST',
    dataType: 'json',
    data: {
      game: {
        state: currentState()
      }
    },
    success: function(msg) {
      currentGame = msg.game.id;
    }
  })
}

function checkWinner() {
  var diagonalFirst = [$("[data-x=0][data-y=0]").text(),
                       $("[data-x=1][data-y=1]").text(),
                       $("[data-x=2][data-y=2]").text()].join("")

  var diagonalSecond = [$("[data-x=2][data-y=0]").text(),
                        $("[data-x=1][data-y=1]").text(),
                        $("[data-x=0][data-y=2]").text()].join("")

  var combos = [$("[data-x=0]").text(),
                $("[data-x=1]").text(),
                $("[data-x=2]").text(),
                $("[data-y=0]").text(),
                $("[data-y=1]").text(),
                $("[data-y=2]").text()]

    combos.push(diagonalFirst, diagonalSecond);
    var outcome;
    
    combos.forEach(function(str) {
      if (str === "XXX") {
        message("Player X Won!");
        saveGame();
        resetBoard();
      } else if (str === "OOO") {
        message("Player O Won!");
        saveGame();
        resetBoard();
      } else {
        outcome = false;
      }
    })

  return outcome;
} 

function updateState(e) {
  $(e.target).text(player());
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(str) {
  $('#message').text(str);
}

function currentState() {
  var state = [];
  $('td').each(function(cell) {
    state.push($(this).text());
  })
  return state;
}

function resetBoard() {
  turn = 0;
  $("[data-x=0]").text("");
  $("[data-x=1]").text("");
  $("[data-x=2]").text("");
}

function checkTie() {
  if (turn === 9) {
    message("Tie game");
    saveGame();
    resetBoard();
  }
}

function currentGame() {

}

function updateGame() {
  $.ajax({
    url: "/games/" + currentGame,
    method: "PATCH",
    dataType: 'json',
    data: {
      game: {
        state: currentState()
      }
    },
    success: function(msg) {
      currentGame = msg.game.id;
    }
  })
}

var showGames = function(){''
  $('#games').text("")
  $.ajax({
    url: "/games",
    method: "GET",
    dataType: 'json',
    success: function(msg) {
      msg.games.forEach(function(game){
        $('#games').append("<li " + "data-gameid=" + game.id +">" + game.state + "</li>");
      })
    }
  })
}

