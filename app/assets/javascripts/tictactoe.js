var turn = 0;

$(function() {
  attachListeners();
});

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
};

function updateState(box) {
  box.innerText = player();
};

function setMessage(msg) {
  $("#message").text(msg);
};

function checkWinner() {
  let el = [];
  return checkRows(el) || checkColumns(el) || checkDiag(el) ? true : false;
};

function checkRows(el) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      el[j] = assignEl(j,i);
    };
    if ( winCheck(el) ) { return true }
  };
};

function checkColumns(el) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      el[j] = assignEl(i,j);
    };
    if ( winCheck(el) ) { return true }
  };
};

function checkDiag(el) {
  for (let i = 0; i < 3; i++) {
    el[i] = assignEl(i, i);
  };
  if ( winCheck(el) ) { return true }

  for (let i = 0; i < 3; i++) {
    el[i] = assignEl(i, 2-i);
  };
  if ( winCheck(el) ) { return true }
};

function winCheck(el) {
  if ( matching(el) ) {
    setMessage("Player " + el[0] + " Won!");
    return true;
  };
};

function tieCheck() {
  if ( turn > 8 ) {
    setMessage("Tie game.");
    return true;
  };
};

function assignEl(x,y) {
  return $("td[data-x=" + x + "][data-y=" + y + "]")[0].innerText;
};

function matching(el) {
  return el[0] == el[1] && el[0] == el[2] && (el[0] == "X" || el[0] == "O" );
};

function doTurn(box) {
  updateState(box);
  turn++
  if ( checkWinner() || tieCheck() ) {
    saveGame();
    resetBoard();
  };
};

function resetBoard() {
  turn = 0;
  let $td = $('td');
  for (let i in $td) {
    $td[i].innerText = "";
  };
};

function attachListeners() {
  boardListener();
  previousButtonListener();
  saveButtonListener();
  clearButtonListener();
  savedGameButtonListener();
};

function boardListener(){
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      $("td[data-x=" + i + "][data-y=" + j + "]").on('click', function() {
        if ( this.innerText == "" && !checkWinner() ) {
          doTurn(this);
        };
      });
    };
  };
};

function previousButtonListener() {
  $("#previous").on('click', function() {
    $.get('/games', function(games) {
      $('#games').html( gamesHTML(games) );
    });
  });
};

function gamesHTML(games) {
  let html = "";
  games.data.forEach( function(game) {
    html += `<button>${game.id}</button><br>`;
  });
  return html;
};

function saveButtonListener() {
  $("#save").on('click', function() {
    saveGame();
  });
};

function saveGame() {
  const state = boardState();
  const posting = postMethod(state);
  posting.done( function(game) {
    setGameId(game)
  });
}

function boardState() {
  const $td = $('td');
  let board = [];
  for (let i = 0; i < $td.length; i++) {
    board[i] = $td[i].innerText;
  };
  return board
};

function postMethod(state) {
  const gameId = getGameId();
  if ( gameId == undefined ) {
    return $.post('/games', state);
  } else {
    return $.ajax({
      url: `/games/${gameId}`,
      type: 'PATCH',
      data: state
    });
  };
};

function setGameId(game) {
  $("#save").attr("data-id", game.data.id);
};

function getGameId() {
  return $("#save").attr("data-id");
};

function clearGameId() {
  $("#save").removeAttr("data-id");
}

function clearButtonListener() {
  $("#clear").on('click', function() {
    resetBoard();
    clearGameId();
  });
};


function savedGameButtonListener() {
  $(`#games`).on('click', 'button' , function() {
    $.get(`/games/${this.innerText}`, function(game) {
      setBoard(game)
      setGameId(game);
    });
  });
};

function setBoard(game) {
  const state = game.data.attributes.state;
  const $td = $('td');
  turn = state.filter(el => el != "").length;
  for (let i in state) {
    $td[i].innerText = state[i];
  };
};
