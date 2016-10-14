var winningCombos = [
[[0, 0],[1, 0],[2, 0]],
[[0, 0],[1, 1],[2, 2]],
[[0, 0],[0, 1],[0, 2]],
[[2, 0],[2, 1],[2, 2]],
[[2, 0],[1, 1],[0, 2]],
[[0, 2],[1, 2],[2, 2]],
[[1, 0],[1, 1],[1, 2]],
[[0, 1],[1, 1],[2, 1]]
];
var turn = 0
var currentGame = 0

var message = function(string) {
  $("#message").html(string)
};

var player = function() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

var doTurn = function(event) {
  updateState(event)
  if (checkWinner() || checkTie()) {
    save(true)
    reset()
  } else {
    turn += 1
  }
}

var updateState = function(event) {
  $(event.target).html(player())
}

var checkMatches = function(array) {
  var matchStatus = true
  $.each(array, function(idx, combo) {
    var x = combo[0]
    var y = combo[1]
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (noCellMatch(selector)) {
      matchStatus = false
    }
  })
  return matchStatus
}

var noCellMatch = function(selector) {
  if (selector.html() != player()) {
    return true
  } else {
    return false
  }
}

var checkWinner = function() {
  var winStatus = false
  $.each(winningCombos, function(idx, winningCombo) {
    if (checkMatches(winningCombo) == true) {
      message("Player " + player() + " Won!")
      winStatus = true
    }
  })
  return winStatus
}

var checkTie = function() {
  var tieStatus = true
  $("td").each(function() {
    if ($(this).html() == "") {
      tieStatus = false
    }
  })
  if (tieStatus) {
    message("Tie game")
  }
  return tieStatus
}

var reset = function() {
  turn = 0
  $("td").html("")
  currentGame = 0
}

var attachListeners = function() {
  $("td").click(function(event) {
    doTurn(event)
  })

  $("#games").click(function(event) {
    var state = parseState(event)
    var id = getGameId(event)
    switchGame(state, id)
  })

  $("#save").click(function(event) {
    save()
  })

  $("#previous").click(function(event) {
    getAllGames()
  })
}

var parseState = function(event) {
  var state = $(event.target).data("state")
  return state.split(",")
}

var getGameId = function(event) {
  return $(event.target).data("gameid")
}

var whoTurnIsDis = function(state) {
  var turn = 0
  state.forEach(function(item) {
    if (item != "") {
      turn +=1
    }
  })
  return turn
}

var resumeGameboard = function(state) {
  $("td").each(function(idx, cell) {
    $(this).text(state[idx])
  })
}

var switchGame = function(state, id) {
  resumeGameboard(state)
  currentGame = id
  turn = whoTurnIsDis(state)
}

var saveGameboard = function() {
  var board = []
  $("td").each(function(idx, cell) {
    board.push($(this).html()) 
  })
  return board
}

var getAllGames = function() {
  $.getJSON("/games").done(function(data) {
    listGames(data.games)
  })
}

var listGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(displayGame(game));
  })
  $("#games").html(dom);
  //var list = "<ul>"
  //games.forEach(function(game) {
  //  list += displayGame(game)
  //})
  //list += "</ul>"
  //$("games").html(list)
}

var displayGame = function(game) {
  return $("<li>", {
    'data-state': game.state, 
    'data-gameid': game.id, 
    text: game.id
  })
}

var save = function(resetCurrentGame) {
  var url, method
  if (currentGame) {
    url ="/games/" + currentGame
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
      state: saveGameboard()
    },
    success: function(data) {
      if (resetCurrentGame) {
        currentGame = 0
      } else {
        currentGame = data.game.id
      }
    }
  })
}

$(function() {
  attachListeners()
})