$( document ).ready(function() {
  attachListeners();
});

console.log( "HI I'm REAADY!" );
var turn = 0;
var currentGame = 0;

var winningCombos = [
                     [0,1,2], [3,4,5],
                     [6,7,8], [0,3,6],
                     [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]
                     ];

// var el = document.getElementById("outside");
// el.addEventListener("click", modifyText, false);

function attachListeners() {

  $('td').click(function() {
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    };
  })

  var saveButton = document.getElementById("save")
  var previousButton = document.getElementById("previous")
  var clearButton = document.getElementById("clear")
  saveButton.addEventListener("click", saveGame);
  previousButton.addEventListener("click", previousGames);
  clearButton.addEventListener("click", clearGame);

};

function doTurn(td) {
  updateState(td);
  turn += 1
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  };
};

function updateState(td) {
  var token = player();
  td.innerHTML = token

};

function player() {
  // board.turn_count.even? ? @player_1 : @player_2
  if (turn % 2 == 0) token = "X" ;
  else token = "O" ;
  return token

};

function setMessage(string) {
  $('div#message').append(string)
};

function checkWinner(player) {
  var string = ""
  var won = false
  var board = {};

  // if (turn === 9 && !checkWinner()) {
  //   setMessage("Tie game.")
  // };

    $('td').text((i, square) => board[i] = square);

  winningCombos.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return won = true;
      };
    });
    return won;
};


function saveGame() {
  var state = [];
  var gameData;

   $('td').text((i, square) => {
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
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game));
    });
  }
};

function reloadGame(game) {

  $.get(`/games/${game.id}`, (games) => {

    let state = games.data.attributes.state

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        
        index++;
        console.log(state)
      }
    }

    turn = state.join('').length;
    currentGame = game.id
  })
}

function previousGames() {
  $('#games').empty();

 $.get("/games", (savedGames) => {
   if (savedGames.data.length) {
     savedGames.data.forEach(game => {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button>`);
      $(`#gameid-${game.id}`).on('click', () => reloadGame(game));
      });
    };
  });
};

function clearGame() {
  $('td').empty();
  currentGame = 0;
  turn = 0;
};
