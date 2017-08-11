var turn = 0;
var winner = "";
var currentGame = 0;

var WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];


// var player = function(){
//   if (turn % 2 === 0) {
//     return 'X';
//   } else {
//     return 'O';
//   }
// }

player = () => turn % 2 === 0 ? 'X' : 'O';

function updateState(e) {
  e.innerHTML = player();
  if (turn === 0) {message("")}
  // e.innerHTML = player();
}

var message = function(string) {
  $('#message').text(string)
}


var checkWinner = function() {
  var t = document.getElementsByTagName('td');
  // var t = $('td');
  var winner = false;
  WINNING_COMBOS.some(combo => {
    if (t[combo[0]].innerHTML !== "" && t[combo[0]].innerHTML === t[combo[1]].innerHTML && t[combo[0]].innerHTML === t[combo[2]].innerHTML) {
      console.log("Player " + t[combo[0]].innerHTML + " Won!");
      message("Player " + t[combo[0]].innerHTML + " Won!");
      return winner = true;
    }
  })
  return winner;
}

var doTurn = function(e) {
  updateState(e);
  turn++;
  var won = checkWinner();
  if (won) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    saveGame();
    resetBoard();
    message("Tie game.");
  }
}

var resetBoard = function() {
  $('td').text((index, el) => el[index] = "");
  turn = 0;
  currentGame = 0;
}

var saveGame = function() {
  // save the game
  var gameState = [];
  var gameData;

  $('td').text((index, el) => {
    gameState.push(el)
  });

  gameData = { state: gameState }

  if (currentGame !== 0) {
    // update the existing game
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', {
      // type: 'POST',
      // url: '/games',
      data: gameData
    })
    .done(function(game) {
       currentGame = game.data.id;
       // add a button link to newly saved game
       $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
       // add click listenter to new button
       $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
     });

    // $.post('/games', gameData)
    //    .done(function(game) {
    //    currentGame = game.data.id;
    //    // add a button link to newly saved game
    //    $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
    //    // add click listenter to new button
    //    $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    //  });
  }
}

var reloadGame = function(id) {
  document.getElementById('message').innerHTML = '';

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${id}`, true);
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
      message('Tie game.');
    }
  };

  xhr.send(null);

}

var showPreviousGames = function() {
  // show previous games
  $('#games').empty();
  $.get('/games', function(savedGames) {
    if (savedGames.data.length >= 1) {
      savedGames.data.forEach(function(game) {
        // add a button link to newly saved game
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        // add click listenter to new button
        $("#gameid-" + game.id).on('click', () => reloadGame(game.id));
      })
    }
  })
}

var attachListeners = function() {
  $('#clear').on('click', () => resetBoard());
  $('#previous').on('click', () => showPreviousGames());
  $('#save').on('click', () => saveGame());
  $('td').on('click', function() {
    console.log("cleeck!" + this.innerHTML)
    if (this.innerHTML === "" && !checkWinner() && turn < 9){
      doTurn(this);
    }
  })
}

$(function(){
  attachListeners();
})
