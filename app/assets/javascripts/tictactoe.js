var num = 1;
// var gameCount = 0;
var currentGame;

$(document).ready(function(){
  updateBoard();
  attachListeners();
});


// function doTurn() {
//   updateBoard();
// }

// function player(num) {
//   if(num % 2 == 0) {
//     $(this).text('O');
//   } else {
//     $(this).text('X');
//   }
// }


function updateBoard() {
  $("td").on("click", function(){
    if($(this).html() == '' && (num % 2 == 0)) {
       $(this).text("X");
       num += 1;
    } else if ($(this).html() == '' && (num % 2 != 0)){
       $(this).text("O");
       num += 1;
    } else {
      alert("This position is taken.");
    }


    checkWinner();

    if (num == 10) {
      alert("Cats Game!");
      save();
      $("table td").empty();
      num = 1;
    }
  });
}

function checkWinner() {
  if($("#one").html() == "X" && $("#two").html() == "X" && $("#three").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#four").html() == "X" && $("#five").html() == "X" && $("#six").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#seven").html() == "X" && $("#eight").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#one").html() == "X" && $("#four").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#two").html() == "X" && $("#five").html() == "X" && $("#eight").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#three").html() == "X" && $("#six").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#one").html() == "X" && $("#five").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#three").html() == "X" && $("#five").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#one").html() == "O" && $("#two").html() == "O" && $("#three").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#four").html() == "O" && $("#five").html() == "O" && $("#six").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#seven").html() == "O" && $("#eight").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#one").html() == "O" && $("#four").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#two").html() == "O" && $("#five").html() == "O" && $("#eight").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#three").html() == "O" && $("#six").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#one").html() == "O" && $("#five").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;

  } else if($("#three").html() == "O" && $("#five").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    save();
    $("table td").empty();
    num = 1;
  } 
}


var message = function(message) {
  $("#message").html(message);
}

var findTurn = function(state) {
  var num = 1;
  state.forEach(function(item) {
    if(item != "") {
      num += 1;
    }
  })
  return num;
}

var attachListeners = function() {
  $("tbody").click(function(event) {
    doTurn(event)
  });
  $("#games").click(function(event) {
    var state = parseState(event)
    swapGame(state, getGameId(event))
  })
  $("#save").click(function() {
    save();
  })
  $("#previous").click(function() {
    getAllGames();
  })
}

var parseState = function(event) {
  return $(event.target).data("state").split(",")
}

var getGameId = function(event) {
  return $(event.target).data("gameid")
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

var swapGame = function(state, id) {
  placeToken(state);
  currentGame = id;
  num = findTurn(state);
}

var placeToken = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}
var getToken = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

var save = function(resetCurrentGame) {
  var url, method;
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
        state: getToken()
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



