$(function() {
  displayGames();
  attachListeners();
  savingGameButton();
  clearGame();
});

winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]
var turn = 0

function attachListeners() {
  $('td').each(function() {
    $(this).click(function(event) {
      doTurn(event.target);
    });
  });
}

function player() {
  var player = turn % 2 === 0 ? 'X' : 'O';
  return player;
}

function updateState(square) {
  var playerToken = player();
  $(square).text(playerToken);
}

function setMessage(message) {
  $('#message').text(message);
}

function doTurn(square) {
  if (squareAvailable(square) && !gameOver()) {
    updateState(square);
    if (checkWinner() || gameTie()) {
      saveGame()
      resetGame();
      turn = 0;
    } else {
      turn++;
      }
  }
}


function checkWinner() {
  if(gameWon()) {
    var state = getState();
    var winningCombination = winningCombinations.filter(function(combination) {
      return (state[combination[0]] === state[combination[1]] && state[combination[0]] !== "") && state[combination[1]] == state[combination[2]]
    });
    var winner = state[winningCombination[0][1]];
    setMessage(`Player ${winner} Won!`);
    return true
  } else {
      if (gameTie()) {
        setMessage(`Tie game.`);
      }
      return false
    }
}

function resetGame() {
  $('td').each(function(index, el) {
    $(el).text('');
  })
  turn = 0;
}

function getState() {
  var state = []
  var squares = $('td').each(function(index, el) {
    state[index] = $(el).text()
  });
  return state;
}

function gameWon() {
  var state = getState();
  return winningCombinations.some(function(combination) {
    return (state[combination[0]] === state[combination[1]] && state[combination[0]] !== "") && state[combination[1]] == state[combination[2]]
  });
}

function gameTie(){
  var state = getState();
  if (!gameWon()) {
    return state.every(function(square) {
      return square != ''
    });
  }
}

function squareAvailable(square) {
  return $(square).text() === ""
}

function gameOver() {
  return gameWon() || gameTie()
}


function savingGameButton (){
    $('#save').click(function() {
      saveGame();
    })
}

function saveGame() {
  var id = $('table').attr('data-gameid')
  if (id) {
    $.ajax({
      type: "PATCH",
      url: '/games/' + id,
      data: { "state": getState()},
      success : function(response, textStatus, jqXhr) {
        console.log("Venue Successfully Patched!");
      }
    });
  } else {
    var createGame = $.post('/games', { state: getState() });
    createGame.done(function(data) {
      $('table').attr('data-gameid', data['data']['id']);
    })
  }
}

function displayGames() {
  $('#previous').click(function() {
    $.get('/games', function(data) {
      if (data['data'].length > 0) {
        var gamesHTML = ''
        for (var i = 0; i < data['data'].length; i++) {
          var date = new Date(data['data'][i]['attributes']['updated-at']).toLocaleString();
          gamesHTML += '<button>' + data['data'][i]['id'] + ' - ' + date + '</button>'
          console.log(data)
        }
        $('#games').html(gamesHTML)
        $('#games button').click(function(event) {
          loadGame(event.target.textContent);
        })
      }
    });
  });
}

function loadGame(id) {
  var state = $.get('/games/' + id, function(data) {
    $('td').each(function (index, element) {
      $(element).text(data['data']['attributes']['state'][index])
    });
    $('table').attr('data-gameid', data['data']['id']);
    refreshTurn();
  });
}

function refreshTurn() {
  var state = getState();
  turn = state.filter(function(square) {
    return square != ''
  }).length;
}

function clearGame() {
  $('#clear').click(function() {
    resetGame();
    $('table').removeAttr('data-gameid')
  });
}
