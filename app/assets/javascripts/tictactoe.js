// Code your JavaScript / jQuery solution here

////////////////////////////////////////////////////////
// Global Variables
////////////////////////////////////////////////////////

var turn = 0;
var currentGameId = 0;
var winningCombo = [
  [0,1,2], // TOP ROW
  [3,4,5], // MIDDLE ROW
  [6,7,8], // BOTTOM ROW
  [0,3,6], // FIRST COLUMN
  [1,4,7], // MIDDLE COLUMN
  [2,5,8], // LAST COLUMN
  [0,4,8], // DIAGONAL TOP LEFT, BOTTOM RIGHT
  [2,4,6]  // DIAGONAL TOP RIGHT, BOTTOM LEFT
];

////////////////////////////////////////////////////////
// DOM Elements
////////////////////////////////////////////////////////

var squares = document.getElementsByTagName('td');


////////////////////////////////////////////////////////
// Global General Functions
////////////////////////////////////////////////////////

function toArr(collection){
	let arr = Array.prototype.slice.call(collection);
	return arr.map(function(a) { return a.textContent; })
}

function isEven(num) {
  return num % 2 === 0;
}



////////////////////////////////////////////////////////
// Global Game Functions
////////////////////////////////////////////////////////

function resetBoard(){
  for(var sq of squares) {
	   $(sq).text('');
     turn = 0;
     currentGameId = 0;
  };
}

function doTurn(move) {
  if (updateState(move)) {
      turn += 1;
  }
  if (checkWinner()) {
    autoSave();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    autoSave();
  }
}

function player() {
  return isEven(turn) ? "X" : "O";
}

var updateState = (square) => {
  if ( $(square).is(':empty') ) {
    $(square).text(player());
    return true;
  }
};

function setBoard(arr) {
  for (let i = 0; i < arr.length; i++) {
    squares[i].textContent = arr[i];
  }
}

var setMessage = (msg) => {
  $('#message').html(msg);
}

function checkWinner(){
  let token = player();
  let table = toArr(squares);
  for(let combo of winningCombo) {
    if (table[combo[0]] !== '' && table[combo[0]] === table[combo[1]] && table[combo[1]] === table[combo[2]]) {
        setMessage(`Player ${table[combo[0]]} Won!`);
        return true;
      }
    }
  return false;
}

function buildBtn(id) {
  return `<button id="${id}">Game ${id}</button>`;
}

function appendGamesBtn(btn) {
  $('#games').append(btn);
}

function autoSave() {
  postSave();
}

////////////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////////////

function tableListener() {
  $('table').on('click', 'td', function(e) {
    if (!checkWinner()) {
      doTurn(e.target);
    }
  });
}

function clearBtnListener() {
  $('#clear').on('click', resetBoard);
}

function saveBtnListener() {
  $('#save').on('click', postSave);
}

function previousButton() {
  $('#previous').on('click', getGames);
}

function gameButtons() {
  $('#games').on('click', 'button', function(e) {
    // autoSave current game if not saved.
    let id = $(e.target).attr('id');
    getGame(id);
  });
}

function attachListeners() {
  tableListener();
  clearBtnListener();
  saveBtnListener();
  previousButton();
  gameButtons();
}

////////////////////////////////////////////////////////
// AJAX Requests
////////////////////////////////////////////////////////

// 'POST', '/games' action: create
function postSave(){
  let data = toArr(squares);
  if (currentGameId) {

    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGameId,
      dataType: 'json',
      data: {state: data}
    }).done(function(game) {
      let gameData = game.data;
      currentGameId = gameData.id;
    });

  } else {

    $.post('/games', {state: data}, function(game) {
        // store in CurrentGameId variable.
        let id = game.data.id;
        currentGameId = id;
        appendGamesBtn(buildBtn(id));
    });
  }
}

function getGames() {
  $.get('/games')
    .done(function(data) {
      let gameData = data.data;
      let gameBtns = toArr( $('#games').children('button') );
      for (let game of gameData) {
        if (gameBtns.indexOf(`Game ${game.id}`) === -1) {
          appendGamesBtn(buildBtn(game.id));
        }
      }

    });
}

function getGame(id) {
  $.get('/games/' + id)
    .done(function(data) {
      let gameData = data.data;
      let gameState = gameData.attributes.state;
      currentGameId = gameData.id;
      setBoard(gameState);
    });
}



////////////////////////////////////////////////////////
// DOM Ready()
////////////////////////////////////////////////////////

$(function() {
  attachListeners();

}); // End of  .ready() function
