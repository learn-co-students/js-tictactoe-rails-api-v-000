var turn = 0
var winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var gameId = 0

$(document).ready(function() {
  attachListeners()
})

function attachListeners() {
  $("td").on('click', function(e) {
    if (checkWinner() === false) {
      doTurn(this)
    }
  })

  $("#previous").on("click", function() {
    $.get("/games", function(data) {
      var games = data["data"];
      var gamesList = "";
      games.forEach(function(game) {
        gamesList += '<button class="js-game" data-id="' + game["id"] + '">' + game["id"] + '</button>';
      });
      $("#games").html(gamesList);
      attachPreviousGameListeners();
    });
  });

  function attachPreviousGameListeners() {
    $(".js-game").on("click", function() {
      gameId = parseInt($(this).attr("data-id"));
      $.get("/games/" + gameId, function(response) {
        moves = document.querySelectorAll("td")
        tableElements = response.data.attributes.state
        let square = 0
        turn = 0
        moves.forEach(function(element) {
          element.innerHTML = tableElements[square]
          if (element.innerHTML != "") {
            turn +=1
          }
          square += 1
        });
        setMessage(" ")
      });
    });
  }

  $("#clear").on("click", function() {
    clearBoard()
  });

  $('#save').click(function() {
    saveGame()
  })
}

function player () {
  if(turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(move) {
  if (move.innerHTML === "") {
    move.innerHTML = player()
  } else {
    turn -= 1
  }
}

function setMessage(string) {
  document.querySelector('div#message').innerHTML = string
}

function checkWinner() {
  var values = document.querySelectorAll('td')
  var state = Array.prototype.map.call(values, function (x) {return x.innerHTML;})
  var winning = false
  var winningCombination = []
  winningCombinations.forEach(function(combination) {
    if (winning === false && (combination.every(function(y) {return state[y] === "X"}) || combination.every(function(y) {return state[y] === "O"}))) {
      setMessage(`Player ${state[combination[1]]} Won!`)
      winning = true
    }
  })
  return winning
}

function doTurn(move) {
    updateState(move)
    if (checkWinner()) {
      saveGame()
      clearBoard()
    } else if (turn === 8) {
      setMessage("Tie game.")
      saveGame()
      clearBoard()
    } else {
      if (turn === 0) {
        setMessage(" ")
      }
      turn+=1
    }
}

function saveGame() {
  var values = document.querySelectorAll('td')
  state = Array.prototype.map.call(values, function (x) {return x.innerHTML;})
  if (!gameId) {
    var posting = $.post('/games', {"state": state});
    posting.done(function(response) {
      gameId = response.data.id
    })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      dataType: 'json',
      data: {"state": state}
    });
  }
}

function clearBoard() {
    turn = 0
    moves = document.querySelectorAll("td")
    moves.forEach(function(element) {
      element.innerHTML = ""
    });
    gameId = 0
}
