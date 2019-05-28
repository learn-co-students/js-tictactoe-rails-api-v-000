// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
// var games = [[], [], [], [], [], [], [], [], [], [], []]

var WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

$(document).ready(function() {
  attachListeners()
});

function player(){
  if (turn%2 === 0){
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element){
  element.innerHTML = player()
}

function setMessage(string){
  $('#message').text(string)
}

function checkWinner(){
  var winner = false
  var board = {}
  $('td').text((index, square) => (board[index] = square)) //an arrow function

  WIN_COMBINATIONS.forEach(function(position){
    if(board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] != "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner
}

function doTurn(square){
  updateState(square)
  turn++;
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners(){
  $("td").click(function(e){
    if (this.textContent === "" && !checkWinner()){
      doTurn(this)
    }
  });
  $('#clear').on('click', () => resetBoard());
  $("#save").click(function(e){
    saveGame()
    })
  $('#previous').click(function(e){
    showPreviousGames()
    })
}

function saveGame(){
  squares = document.getElementsByTagName("td")
  var state = []
  var gameData

  for (const square of squares) {
    state.push(square.innerText)
  }

  gameData = { state: state };

if (currentGame) { // sends patch request if current game isn't 0
  $.ajax({
    type: 'PATCH',
    url: `/games/${currentGame}`,
    data: gameData // sends current game data to server
  });
} else {
  $.post('/games', gameData, function(game) { // if current game is 0 (it hasn't been saved yet)
    currentGame = game.data.id; // sets currentGame to the game id sent back from the server
    $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`); // makes a button for the game
    $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id)); // sets a listener on the button upon creating it
    });
  }
}


function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => { // savedGames is the response
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame); // makes a button for each game
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}


function reloadGame(gameID) {
  // sets every square to blank
  document.getElementById('message').innerHTML = '';

  // sends request to server
  const xhr = new XMLHttpRequest;
  // sets the response type to json
  xhr.overrideMimeType('application/json');
  // initializes the request passing in the http verb and the route/DOMString, and sets async to true
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => { // callback begins upon load
    const data = JSON.parse(xhr.responseText).data; // converts the responseTxt data to javascript object and saves it as variable
    const id = data.id; // sets id in constant
    const state = data.attributes.state; // gets state array from the object

    let index = 0; // iterate over each sqaure in the DOM and set the innerHTML as the value in the array in the object
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length; // sets the game turn as the length of the array (so a game that is only 1 turn is has turn === 1)
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null); // explicitly saying that nothing is being sent to the server after the request headers
}
