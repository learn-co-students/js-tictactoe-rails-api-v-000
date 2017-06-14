var turn = 0
var currentGame;

var winningCombos = [
	[[0,0],[1,0],[2,0]], 
	[[0,1],[1,1],[2,1]], 
	[[0,2],[1,2],[2,2]], 
	[[0,0],[1,1],[2,2]], 
	[[0,0],[0,1],[0,2]], 
	[[2,0],[2,1],[2,2]], 
	[[1,0],[1,1],[1,2]], 
	[[2,0],[1,1],[0,2]]
]

var checkCells = function(ary) {
  for(var i = 0; i < ary.length; i++) {
    var winningCombo = ary[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if( noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

var checkWinner = function() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var tie = function() {
	if (turn == 8 && !checkWinner()) {
		message("Tie game");
		return true;
	} else {
		return false;
	}
}

var noCellMatch = function(element) {
  return (element.html() != player());
}

var attachListeners = function() {
	$('tbody').click(function(event) {
		// console.log(event)
		doTurn(event);
	})

	$('#previous').click(function() {
		getAllGames()
	})

	$("#games").click(function(event) {
   	var state = parseState(event)
    swapGame(state, getGameId(event))
  })

	$("#save").click(function() {
    save();
  })
}

var doTurn = function(event) {
	updateState(event)

	if (checkWinner() || tie()) {
		save(true)
		resetGame();
	} else {
		turn += 1;
	}
}

var updateState = function(event) {
	$(event.target).html(player());
}

var player = function() {
	if (turn % 2 == 0) {
		return 'X'
	} else {
		return 'O'
	}
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0
}

var message = function(message) {
	$('#message').html(message)
}

var getAllGames = function() {
	
  $.getJSON("/games").done(function(response) {
    showGames(response.games)
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  })
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var parseState = function(event) {
  return $(event.target).data("state").split(",")
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

var getGameId = function(event) {
  return $(event.target).data("gameid")
}

var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

var save = function(resetCurrentGame) {
  var url; 
  var method;
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
        state: getMarks()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

$(function() {
	attachListeners()
})

// var reset = function() {
// 	$('td').html("");
// 	turn = 0;
// }


// var attachListeners = function() {
// 	var data = $(this).data()
// 	doTurn(data)
// }

// var player = function () {
// 	if (turn % 2 == 0) {
// 		return 'X'
// 	} else {
// 		return 'O'
// 	}
// }

// var isEmpty =function(x, y) {
// 	if ($('[data-y="' + y + '"][data-x="' + x + '"]').html() === '') {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// var updateState = function(x, y, player) {
// 	// adds X or O to board
// 	if (isEmpty(x, y)) {
// 		$('[data-y="' + y + '"][data-x="' + x + '"]').html(`${player}`)		
// 	}
// }

// var message = function(msg) {
// 	// sends message to div
// 	$("#message").html(msg)
// }

// var doTurn = function(data) {
// 	if (isEmpty(data.x, data.y)) {
// 		updateState(data.x, data.y, player())
		
// 		if (checkWinner()) {
// 			console.log("We have a winner")
// 			reset()
// 		} else {
// 			turn += 1
// 			message(`Player ${player()}'s turn.`)
// 		}
// 	} else {
// 		message("Spot is taken.")
// 	}
// }
	
// $(function() {
//   //$("table tbody tr td").on("click", attachListeners)	
// })
	
// 	//$("table tbody tr td").on("click", attachListeners)	

