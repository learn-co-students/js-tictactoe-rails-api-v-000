// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {

	// let squares = window.document.querySelectorAll('td');
    
	// let turns = 0

	// for (let i = 0; i < 9; i++) {
 //    if (squares[i].innerHTML != '') {
 //    	turns = turns + 1;
 //    }
 //  }
	
	if (turn % 2 === 0) {
       return "X"
	} else {
		return "O"
	}
}

function updateState(square) {
	square.innerHTML = player();
}

function setMessage(message) {
   window.document.getElementById('message').innerHTML = message;
}

function checkWinner() {

	let combos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

let board = window.document.querySelectorAll('td');
let winner = false

// for (let i = 0; i < combos.length; i++) {
combos.forEach(function(combo) {


	let winIndex1 = combo[0]
    let winIndex2 = combo[1]
    let winIndex3 = combo[2]

    let position1 = board[winIndex1].innerHTML
    let position2 = board[winIndex2].innerHTML
    let position3 = board[winIndex3].innerHTML 


    if (position1 == "X" && position2 == "X" && position3 == "X") {
    	winner =  true;
    	setMessage('Player X Won!');
    	
    } else if (position1 == "O" && position2 == "O" && position3 == "O") {
        winner =  true;
        setMessage('Player O Won!');
        
    } 
  })

return winner;
}

function doTurn(square) {
    // let spaces = [];
	// let board = window.document.querySelectorAll('td');
	// board.forEach(function(element) {
 //       spaces.push(element.innerHTML);
   // });
    updateState(square);
	turn += 1;
	
	if (checkWinner()) {
     saveGame();
     resetBoard();
    } else if (turn === 9) {
     setMessage("Tie game.");
     resetBoard();
     saveGame();
    
  }
}



function attachListeners() {
     $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
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
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
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
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}

