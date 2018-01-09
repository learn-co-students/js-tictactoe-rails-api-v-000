var turn = 0;
var currentGame = 0;

//TO DO: make PATCH - make id variable which is 0 by default (every time different game is loaded, set it equal to <li> html. when game is won or tied, reset to 0. this will determine if game needs POST or PATCH). this will be $.ajax()

function attachListeners() {
  $('td').click(function(e) {
    clearMessage();
    var ended = doTurn(e);
    if (ended !== false) {
      e.preventDefault();
    }
  });
  //save games in progress
  $('#save').click(function(e) {
    save();
  });
  //display all saved games
  $('#previous').click(function(e) {
    //includes(1) because if there is no game with ID 1, @games is empty
    if($('#games').html().includes(1) === false) {
      gamesList();
    } else {
      $('#games ul').empty();
    }
  });
  //retrieve and resume previous game
  $('#games').on('click', 'li', function(e) {
    getGame(parseInt(this.innerHTML));
  });
}

function gamesList() {
  $.get('/games', function(games) {
    games["data"].forEach(function(game) {
      if($('#games').html().includes(game["id"]) === false) {
        $('#games ul').append("<li>" + game["id"] + "</li>");
      }
    });
  });
}

function save() {
  var board = currentBoard();

  var values = {
    game: {
      state: board
    }
  };
  // first move
  if (currentGame === 0) {
    $.post('/games', values);
  //all other moves
  } else {
    $.ajax({
      url: '/games/' + currentGame,
      method: 'PATCH',
      data: values
    });
  }
  gamesList();
}

function getGame(id) {
  turn = 0;
  currentGame = id;
  $.get('/games/' + id, function(game) {
    var td = $('td')
    for (let i = 0; i < td.length; i++) {
      td[i].innerHTML = game["data"]["attributes"]["state"][i];
      setTurn(game["data"]["attributes"]["state"][i]);
    }
  });
}

function resetGame() {
  save();
  currentGame = 0;
  $('td').each(function(td) {
    this.innerHTML = "";
  });
}

function clearMessage() {
  $('#message').text("");
}

function doTurn(e) {
  let result = updateState(e);
  if (result !== false) {
    turn++;
    var endOfGame = checkWinner();
    if(endOfGame !== false) {
      resetGame();
    }
    return endOfGame;
  }
}

//create Object to contain win combos? iterate over td selector collection? better way in general possible?
function checkWinner() {
  //positions
  var one = $('td[data-x="0"][data-y="0"]').text();
  var two = $('td[data-x="1"][data-y="0"]').text();
  var three = $('td[data-x="2"][data-y="0"]').text();
  var four = $('td[data-x="0"][data-y="1"]').text();
  var five = $('td[data-x="1"][data-y="1"]').text();
  var six = $('td[data-x="2"][data-y="1"]').text();
  var seven = $('td[data-x="0"][data-y="2"]').text();
  var eight = $('td[data-x="1"][data-y="2"]').text();
  var nine = $('td[data-x="2"][data-y="2"]').text();
  var board = [one, two, three, four, five, six, seven, eight, nine];
  //horizontal win combos
  if(one !== "" && one === two && two === three) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (four !== "" && four === five && five === six) {
    turn = 0;
    return message(`Player ${four} Won!`);
  } else if (seven !== "" && seven === eight && eight === nine) {
    turn = 0;
    return message(`Player ${seven} Won!`);
  //vertical win combos
  } else if (one !== "" && one === four && four === seven) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (two !== "" && two === five && five === eight) {
    turn = 0;
    return message(`Player ${two} Won!`);
  } else if (three !== "" && three === six && six === nine) {
    turn = 0;
    return message(`Player ${three} Won!`);
    //diagonal win combos
  } else if (one !== "" && one === five && five === nine) {
    turn = 0;
    return message(`Player ${one} Won!`);
  } else if (three !== "" && three === five && five === seven) {
    turn = 0;
    return message(`Player ${three} Won!`);
  } else if (!board.includes("")) {
    turn = 0;
    return message('Tie game');
  } else {
    return false
  }
}

function updateState(e) {
  var move = player();
  if (e.target.innerHTML === "") {
    e.target.append(move);
  } else {
    return false;
  }
}

function currentBoard() {
  var board = [];

  $('td').each(function() {
    board.push(this.innerHTML);
  });

  return board;
}

function player() {
  if(turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function setTurn(space) {
  if(space !== "") {
    turn++;
  }
}

function message(winner) {
  $('div#message').text(winner);
  //resetGame();
}

$(document).ready(attachListeners);
