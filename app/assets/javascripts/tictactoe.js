// Code your JavaScript / jQuery solution here
var gameId = null
var turn = 0;


$(function() {
  attachListeners();
})



function updateState(element) {
  var token = player();
  $(element).text(token);
}



function setMessage(message) {
  $("#message").append("<p>" + message + "</p>");
}

var player = () => (turn % 2 === 0) ? 'X' : 'O'

function checkWinner() {
  var token;
  player() === "X" ? token = "X" : token = "O"

  var xWin =

  ((($('[data-x=0][data-y=2]').text() === ("X")) && ($('[data-x=1][data-y=1]').text() === ("X")) && ($('[data-x=2][data-y=0]').text() === ("X"))) ||
  (($('[data-x=2][data-y=2]').text() === ("X")) && ($('[data-x=1][data-y=1]').text() === ("X")) && ($('[data-x=0][data-y=0]').text() === ("X"))) ||

  (($('[data-x=0][data-y=0]').text() === ("X")) && ($('[data-x=1][data-y=0]').text() === ("X")) && ($('[data-x=2][data-y=0]').text() === ("X"))) ||
  (($('[data-x=0][data-y=1]').text() === ("X")) && ($('[data-x=1][data-y=1]').text() === ("X")) && ($('[data-x=2][data-y=1]').text() === ("X"))) ||
  (($('[data-x=0][data-y=2]').text() === ("X")) && ($('[data-x=1][data-y=2]').text() === ("X")) && ($('[data-x=2][data-y=2]').text() === ("X"))) ||

  (($('[data-x=0][data-y=0]').text() === ("X")) && ($('[data-x=0][data-y=1]').text() === ("X")) && ($('[data-x=0][data-y=2]').text() === ("X"))) ||
  (($('[data-x=1][data-y=0]').text() === ("X")) && ($('[data-x=1][data-y=1]').text() === ("X")) && ($('[data-x=1][data-y=2]').text() === ("X"))) ||
  (($('[data-x=2][data-y=0]').text() === ("X")) && ($('[data-x=2][data-y=1]').text() === ("X")) && ($('[data-x=2][data-y=2]').text() === ("X"))));


  var oWin =

  ((($('[data-x=0][data-y=2]').text() === ("O")) && ($('[data-x=1][data-y=1]').text() === ("O")) && ($('[data-x=2][data-y=0]').text() === ("O"))) ||
  (($('[data-x=2][data-y=2]').text() === ("O")) && ($('[data-x=1][data-y=1]').text() === ("O")) && ($('[data-x=0][data-y=0]').text() === ("O"))) ||

  (($('[data-x=0][data-y=0]').text() === ("O")) && ($('[data-x=1][data-y=0]').text() === ("O")) && ($('[data-x=2][data-y=0]').text() === ("O"))) ||
  (($('[data-x=0][data-y=1]').text() === ("O")) && ($('[data-x=1][data-y=1]').text() === ("O")) && ($('[data-x=2][data-y=1]').text() === ("O"))) ||
  (($('[data-x=0][data-y=2]').text() === ("O")) && ($('[data-x=1][data-y=2]').text() === ("O")) && ($('[data-x=2][data-y=2]').text() === ("O"))) ||

  (($('[data-x=0][data-y=0]').text() === ("O")) && ($('[data-x=0][data-y=1]').text() === ("O")) && ($('[data-x=0][data-y=2]').text() === ("O"))) ||
  (($('[data-x=1][data-y=0]').text() === ("O")) && ($('[data-x=1][data-y=1]').text() === ("O")) && ($('[data-x=1][data-y=2]').text() === ("O"))) ||
  (($('[data-x=2][data-y=0]').text() === ("O")) && ($('[data-x=2][data-y=1]').text() === ("O")) && ($('[data-x=2][data-y=2]').text() === ("O"))));

  if (turn === 9 && !(oWin || xWin)) {
    setMessage("Tie game.")
  } else if (oWin) {
    setMessage("Player " + "O" + " Won!");
  } else if (xWin) {
    setMessage("Player " + "X" + " Won!");
  }
  return (oWin || xWin);
}

function doTurn(element) {
    var won = checkWinner()
    if (won || (turn === 9)) {
      setMessage("Game is over. You can't keep playing.")
      saveGame();
    } else if ($(element).text() === ""){
    updateState(element);
    turn++;

    if (checkWinner()) {
      saveGame();
    }
  } else {
    setMessage("That spot is taken.")
  }
}

function resetBoard() {
  turn = 0;
  gameId = null;
  (($('[data-x=0][data-y=0]').text("")), ($('[data-x=1][data-y=0]').text("")) , ($('[data-x=2][data-y=0]').text(""))),
  (($('[data-x=0][data-y=1]').text("")) , ($('[data-x=1][data-y=1]').text("")) , ($('[data-x=2][data-y=1]').text(""))),
  (($('[data-x=0][data-y=2]').text("")) , ($('[data-x=1][data-y=2]').text("")) , ($('[data-x=2][data-y=2]').text("")))
}

function attachListeners() {
  for (var x = 0, lx = 2; x <= lx; x++) {
    for (var y = 0, ly =2; y <= ly; y++) {
      var dataAttr = `[data-x=${x}][data-y=${y}]`
      $(dataAttr).click(function(data) {
        doTurn(this);
      })
    }
  }
  $("#save").click(function() {
    saveGame()
  })
  $("#previous").click(function() {
    previousGame()
  })
  $("#clear").click(function() {
    resetBoard()
  })


}

function saveGame() {
  var gameArray = []
  for (var y = 0, ly =2; y <= ly; y++) {
    for (var x = 0, lx = 2; x <= lx; x++) {
      var dataAttr = `[data-x=${x}][data-y=${y}]`
      gameArray.push($(dataAttr).text())
    }
  }

  if (gameId === null) {
    var save = $.post({
      url: '/games',
      data: {
        state: gameArray,
        turnCount: turn
      },
      dataType: 'json'
    }).done(function(game) {
      gameId = game.data.id;

    })
  } else {
    var save = $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: {
        state: gameArray,
        turnCount: turns
      },
      dataType: 'json'
    })
  }
}


function previousGame() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game) {
        $("#games").append(`<button id="game-${game.id}">${game.id}</button>`)
        $(`#game-${game.id}`).on('click', () => reloadGame(game.id));
      })
    }
  });
}

function reloadGame(gameId) {
  resetBoard();
  game = $.get(`/games/${gameId}`, function(gameData) {
    var boxNo = 0;
    turn = gameData.data.attributes.turnCount;
    for (var y = 0, ly =2; y <= ly; y++) {
      for (var x = 0, lx = 2; x <= lx; x++) {

        var boxElement = $(`[data-x=${x}][data-y=${y}]`)
        boxElement.text(gameData.data.attributes.state[boxNo])
        boxNo += 1;
      }
    }
  })
  //


}
