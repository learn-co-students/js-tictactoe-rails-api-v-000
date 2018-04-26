// Code your JavaScript / jQuery solution here

WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]

var turn = 0;
let gameId = 0;
let currentState = ['', '', '', '', '', '', '', '', ''];

$(function(){
  attachListeners();
});

function player() {
  return turn % 2 ? 'O' : 'X';
}

function updateState(cell) {
  const token = player();
  $(cell).text(token);
}

function getIndex(x, y) {
  return x + y * 3;
}

function setCurrentState(board) {
  let state = new Array(9);
  for (let cell of board) {
    const cellData = $(cell).data();
    const arrIndex = getIndex(cellData.x, cellData.y);
    const token = $(cell).text();
    token ? state[arrIndex] = token : state[arrIndex] = '';
  }
  return state;
}

function setMessage(message) {
  $('#message').html(`<p>${message}</p>`);
}

function won() {
  const result = WIN_COMBINATIONS.find(function(win_combination) {
    const com1 = currentState[win_combination[0]];
    const com2 = currentState[win_combination[1]];
    const com3 = currentState[win_combination[2]];
    return com2 !== "" && com1 === com2 && com2 === com3;
  });
  return result;
}

function full() {
  const result = currentState.find(function(e) {
    return e === "";
  });
  return result === "" ? false : true;
}

function draw() {
  return (!won() && full()) ? true : false;
}

function over() {
  return (!!won() || draw()) ? true : false;
}

function checkWinner() {
  $board = $('td');
  currentState = setCurrentState($board);
  if (won()) {
    const winToken = currentState[won()[0]];
    setMessage(`Player ${winToken} Won!`)
    return true;
  } else {
    return false;
  }
}

function resetBoard() {
  turn = 0;
  gameId = 0;
  $('td').empty();
  // for (let cell of $cells) {
  //   $(cell).text("");
  // };
}

function doTurn (cell) {
  updateState(cell);
  turn++;
  if(checkWinner()) {
    save();
    resetBoard();
  } else if (draw()) {
    setMessage("Tie game.");
    save();
    resetBoard();
  }
}

function save() {
  const $board = $('td');
  const gameData = setCurrentState($board);
  if (gameId) {
    $.ajax({
      method: 'patch',
      url: `/games/${gameId}`,
      headers: {
        contentType: 'application/json',
        dataType: 'application/json'
      },
      data: {
        state: gameData
      }
    }).done((res) => {
      resetBoard();
    })
  } else {
    var posting = $.post( '/games', { state: gameData } );
    posting.done(function(res){
      const data = res.data;
      gameId = data.id
    })
  }
}

function getPreviousGames() {
  $('#games').empty();
  $.get('/games', (res) => {
    const games = res.data;
    for (game of games) {
      $('#games').append(`<button id=gameid-${game.id}>${game.id}</button>`)
      $(`#gameid-${game.id}`).on('click', (e) => { 
        reloadGame($(e.target).text());
      })
    }
  })
}

function attachListeners() {
  $('td').click(function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').click(function(){
    save();
  })

  $('#previous').click(function(){
    getPreviousGames();
  })

  $('#clear').click(function(){
    resetBoard();
  })

}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    gameId = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
