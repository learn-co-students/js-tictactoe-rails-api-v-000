const squares = window.document.querySelectorAll('td');

let index = 0;
   for (let y = 0; y < 3; y++) {
     for (let x = 0; x < 3; x++) {
      let square = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
       index++;
     }
   }
const gameWinArray = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
          [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var currentGame = 0
var turn = 0
var message = ""

$(document).ready(function() {
  attachListeners();
});
var player = () => turn % 2 ? 'O' : 'X';


function doTurn(square) {
		updateState(square);
		if (checkWinner()) {
			saveGame();
			clearBoard();
	} else	if (turn === 8 && !checkWinner()) {
     message = 'Tie game.';
   setMessage(message);
		saveGame();
		clearBoard()
} else if (turn < 8) {
  turn += 1
}
}

function checkWinner() {
	var win = {}
	var winner = false;
 $('td').text((index, square) => win[index] = square);

 gameWinArray.some(function(opt) {
if (win[opt[0]] != "" && win[opt[0]] === win[opt[1]] && win[opt[1]] === win[opt[2]]) {
 message = (`Player ${win[opt[0]]} Won!`)
setMessage(message);
return winner = true;
}
});
return winner;
}



function attachListeners() {
$("td").on('click', function() {
  if (!$.text(this) && checkWinner() === false)
  doTurn(this)
  });
$("#save").click(function() {
  saveGame();
});
$("#previous").click(function() {
  showPreviousGames();
});
$("#clear").click(function() {
  clearBoard();
});
}

function setMessage(message) {
	$('#message').text(message);

}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function clearBoard () {
	$('td').empty();
  turn = 0
  currentGame = 0
}

function saveGame() {
  var state = [];
  var gameData;
  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => getPreviousGames(game.data.id));
    });
  }
debugger
}
function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(gameButtons);
    }

  });
}
function gameButtons(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => getPreviousGames(game.id));
}
//
function getPreviousGames(gameId) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET',`/games/${gameId}`, true);
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
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      message = 'Tie game.'
      setMessage(message);
    }
  };

  xhr.send(null);
}
