var turn = 0
var currentGame = null

$(function() {
  attachListeners()
})

function attachListeners() {
  ///////////// SAVE GAME ////////////////
  $("#save").click(function(e) {
    e.preventDefault();
    saveGame()
  });
  ///////////// SHOW PREVIOUS GAMES ////////////////
  $("#previous").click(function(e) {
    e.preventDefault();
    previousGames()
  });
  ////////////// CLEAR CURRENT GAME ////////////////
  $("#clear").click(function(e) {
    e.preventDefault();
    clearGame()
  });
  $("td").click(function() {
    doTurn(this)
  });
  // $(".savedGame").click(function(e){
  //   e.preventDefault();
  //   console.log('hi')
  // })
}

function saveGame() {
  console.log(getBoard());
  if (currentGame === null) {
    $.post('/games', {
      state: getBoard()
    })
      .done(function(resp){
        console.log(resp);
        currentGame = resp['data']['id']
      })
  } else {
    $.ajax({
      url: '/games/' + currentGame,
      method: 'PATCH',
      data: {state: getBoard()},
    }).done(function(resp){
      console.log(resp)
    })
  }
}

function previousGames() {
  $.get('/games').done(function(resp){
    console.log(resp);
    resp.data.forEach(function(game){
      $("#games").append("<button onclick='loadGame(" + game['id'] + ")' data-id='" + game['id'] + "' class='savedGame'>Game #" + game['id'] + "</button>")
    })
  })
}

function loadGame(gameId){
  $.get('/games/' + gameId).done(function(resp){
    console.log(resp.data['attributes']['state']);
    var state = resp.data['attributes']['state'];
    $('td[data-x=0][data-y=0]').html(state[0]);
    $('td[data-x=1][data-y=0]').html(state[1]);
    $('td[data-x=2][data-y=0]').html(state[2]);
    $('td[data-x=0][data-y=1]').html(state[3]);
    $('td[data-x=1][data-y=1]').html(state[4]);
    $('td[data-x=2][data-y=1]').html(state[5]);
    $('td[data-x=0][data-y=2]').html(state[6]);
    $('td[data-x=1][data-y=2]').html(state[7]);
    $('td[data-x=2][data-y=2]').html(state[8]);
    currentGame = gameId;
    turn = getTurn()
  })
}

function clearGame() {
  $('td').each(function(){
    $(this).html("")
  });
  turn = 0;
  currentGame = null
}



// ///////////////// GAMEPLAY /////////////////


function getTurn(){
  return getBoard().filter(Boolean).length
}

function getBoard() {
  var board = [
    $('td[data-x=0][data-y=0]').html(), $('td[data-x=1][data-y=0]').html(), $('td[data-x=2][data-y=0]').html(),
    $('td[data-x=0][data-y=1]').html(), $('td[data-x=1][data-y=1]').html(), $('td[data-x=2][data-y=1]').html(),
    $('td[data-x=0][data-y=2]').html(), $('td[data-x=1][data-y=2]').html(), $('td[data-x=2][data-y=2]').html()
  ];
  return board
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(element) {
  if (checkValidity(element)){
    updateState(element);
    if (gameOver()) {
      saveGame();
      clearGame();
    } else {
      turn++
    };
  }
}




function checkValidity(element){
  if ($(element).text() === '') {
    return true
  }
}

function updateState(element) {
  $(element).text(player())
}

function checkWinner() {
  var board = getBoard()
  if (
    (board[0] === 'X' && board[1] === 'X' && board[2] === 'X') ||
    (board[3] === 'X' && board[4] === 'X' && board[5] === 'X') ||
    (board[6] === 'X' && board[7] === 'X' && board[8] === 'X') ||
    (board[0] === 'X' && board[3] === 'X' && board[6] === 'X') ||
    (board[1] === 'X' && board[4] === 'X' && board[7] === 'X') ||
    (board[2] === 'X' && board[5] === 'X' && board[8] === 'X') ||
    (board[0] === 'X' && board[4] === 'X' && board[8] === 'X') ||
    (board[6] === 'X' && board[4] === 'X' && board[2] === 'X')
  ) {
    setMessage("Player X Won!");
    return true;
  } else if (
    (board[0] === 'O' && board[1] === 'O' && board[2] === 'O') ||
    (board[3] === 'O' && board[4] === 'O' && board[5] === 'O') ||
    (board[6] === 'O' && board[7] === 'O' && board[8] === 'O') ||
    (board[0] === 'O' && board[3] === 'O' && board[6] === 'O') ||
    (board[1] === 'O' && board[4] === 'O' && board[7] === 'O') ||
    (board[2] === 'O' && board[5] === 'O' && board[8] === 'O') ||
    (board[0] === 'O' && board[4] === 'O' && board[8] === 'O') ||
    (board[6] === 'O' && board[4] === 'O' && board[2] === 'O')
  ) {
    setMessage("Player O Won!");
    return true;
  } else {
    return false
  }
}

function checkTie(){
  if (getBoard().filter(Boolean).length === 9 && checkWinner() === false){
    setMessage('Tie game.');
    return true
  }
}

function gameOver() {
  if (checkWinner() || checkTie()) {
    // alert('game over')
    return true;
  }
}

function setMessage(string) {
  $("#message").html(string)
}
