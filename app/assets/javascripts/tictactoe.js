var turn = 0;
var game = 0;

function player() {
  return (parseInt(turn) % 2) === 0 ? "X" : "O";
}

function updateState(pos) {
  $(pos).text(player());
}

function setMessage(msg) {
  $('div#message').text(msg);
}

function checkWinner() {
  const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  let squares = $('td')
  let xWins = winCombinations.some(function(comb) {
    return (squares[comb[0]].innerHTML === 'X' && squares[comb[1]].innerHTML === 'X' && squares[comb[2]].innerHTML === 'X')
  });
  let oWins = winCombinations.some(function(comb){
    return (squares[comb[0]].innerHTML === 'O' && squares[comb[1]].innerHTML === 'O' && squares[comb[2]].innerHTML === 'O')
  });

  if (xWins === true || oWins === true) {
    let winner = xWins ? "X" : "O";
    setMessage(`Player ${winner} Won!`);
    return true;
  }
  else {
    return false;
  }
}

function doTurn(pos) {
  updateState(pos);
  turn++;
  if (checkWinner()) {
    autoSave();
    resetBoard();
  } else if (turn === 9) {
    autoSave();
    setMessage('Tie game.');
    resetBoard();
  }
}

function resetBoard() {
  turn = 0;
  game = 0;
  const squares = $('td')
  for (let i = 0; i < 9; i++) {
    squares[i].innerHTML = '';
  }
}

function boardStatus() {
  let board = $('td');
  turn = 0
  for (let i = 0; i < 9; i++) {
    if (board[i].innerHTML === 'X' || board[i].innerHTML === 'O') {
      turn++;
    }
  }
}

function attachListeners() {
  $('td').each(function () {
    $(this).on('click', function () {
       if ($(this).text() === "" && !checkWinner()) {
        doTurn(this);
      };
    });
  });
  saveGame();
  clearGame();
  showPrevious();
}

function clearGame(){
  $('button#clear').on('click', function (){
    resetBoard();
    turn = 0;
    setMessage("");
  });
}

function showPrevious() {
  $('button#previous').on('click', function() {
    $.get('/games', function(response){
      let buttons = []
      for (let i = 0; i < response.data.length; i++) {
        buttons.push(("<button data-id='" + response.data[i].id + "'>" + response.data[i].id + "</button>"))
      }
      $('div#games').html(buttons.join(""));
      loadGame();
    });
  });
}

function loadGame() {
  $('div#games button').on('click', function(){
    const id = $(this).attr('data-id')
    $.get('/games/' + $(this).attr('data-id'), function (data){
      let board = data["data"]["attributes"]["state"]
      let space = $('td')
      for (let i = 0; i < 9; i++) {
        space[i].innerHTML = board[i]
      }
      boardStatus();
      game = id;
    });
  });
}

function saveGame() {
  $('button#save').on('click', function() {
    const squares = $('td')
    let gameState = [];
    for (let i = 0; i < 9; i++) {
      gameState.push(squares[i].innerHTML);
    }
    if (game) {
      $.ajax({
        url: '/games/' + game,
        data: {state:gameState},
        type: 'PATCH'
      })
    } else {
      $.post('/games', {state: gameState}, function(response){
        game = response.data.id;
      })
    }
  });
}

function autoSave() {
  const squares = $('td')
  let gameState = [];
  for (let i = 0; i < 9; i++) {
    gameState.push(squares[i].innerHTML);
  }
  $.post('/games', {state: gameState})
}

$(function () {
  attachListeners();
});
