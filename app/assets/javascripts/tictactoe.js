let stateArr = ["", "", "", "", "", "", "", "", ""];
const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let turn = setTurn();
let gameId = 'none';
let gameWon = false;



function setTurn() {
  let counter = 0;
  for (const space of stateArr) {
    if (space !== "") {
      counter ++;
    }
  }
  return counter;
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function findPos(x_pos, y_pos) {
  let x = parseInt(x_pos);
  let y = parseInt(y_pos);
  let arrPos = 0;
  if (y === 1) {
    arrPos = 3;
  } else if (y === 2) {
    arrPos = 6;
  }
  return arrPos += x;
}

function updateState(square) {
  let selected_square = findPos(square.data('x'), square.data('y'));
  stateArr[selected_square] = player();

  $('td').each(function(index, td) {
    $(td).text(stateArr[index]);
  });

  turn = setTurn();
  if (checkWinner()) {
    clearBoard();
  }
}

function checkWinner() {
  for (const combo of winningCombos) {
    if (((stateArr[combo[0]] === stateArr[combo[1]]) && stateArr[combo[0]] !== "") && stateArr[combo[1]] == stateArr[combo[2]]) {
      setMessage('Player ' + stateArr[combo[0]] + ' Won!');
      saveGame();
      console.log(gameId);
      gameWon = true;
      return true;
    }
  }
  console.log(gameId);
  gameWon = false;
  setMessage('');
  return false;
}

function setMessage(message) {
  $('#message').text(message);
}

function doTurn(square) {
  if (!gameWon) {
    updateState(square);
  } else {
    clearBoard();
  }
}

function clearBoard() {
  stateArr = ["", "", "", "", "", "", "", "", ""];
  turn = setTurn();
  gameWon = false;
  $('td').each(function(index, td) {
    $(td).text("");
  });
  gameId = 'none';
}

function saveGame() {
  if (gameId === 'none') {
    let posting = $.post('/games', {"state": stateArr });
    posting.done(function(response) {
      gameId = response["data"]["id"];
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + gameId,
      data: JSON.stringify({ "state": stateArr }),
      contentType : 'application/json',
      dataType: 'json',
      success: function(response) {
        console.log(response);
      }
    });
  }

}

function getGames() {
  $.get('/games', function(response) {
    let html = '<ul>';
    for (const savedGame of response['data']) {
      html += '<li data-id="' + savedGame.id + '">' + savedGame.id + '</li>';
    }
    html += '</ul>'
    $('#games').html(html);
    $('li').on('click', function() {
      getGame($(this));
    });
  });
}

function getGame(el) {
  $.get('/games/' + el.data('id'), function(response) {
    stateArr = response['data']['attributes']['state'];
    turn = setTurn();
    $('td').each(function(index, td) {
      $(td).text(stateArr[index]);
    });
    setMessage('');
    gameWon = checkWinner();
  });
}

function attachListeners() {
  $('td').on('click', function() {
    doTurn($(this));
  });

  $('#clear').on('click', function() {
    clearBoard();
  });

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    getGames();
  });
}

$(document).ready(function() {
  attachListeners();
});
