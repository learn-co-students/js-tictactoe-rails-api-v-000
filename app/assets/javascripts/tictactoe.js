$(document).ready(function() {
  attachListeners();
});

var turn = 0
var currentGame = 0
var b = []
var winningSets = []
function getBoard(){
    var array = []
    var tableItems = $("tr td")
    tableItems.each(function(inx, td) {
		array.push($(td).html())
    })
	return array
}
function getWinningSets(){
  var array = [
  [b[0],b[1],b[2]],
  [b[3],b[4],b[5]],
  [b[6],b[7],b[8]],
  [b[0],b[3],b[6]],
  [b[1],b[4],b[7]],
  [b[2],b[5],b[8]],
  [b[0],b[4],b[8]],
  [b[2],b[4],b[6]]
]
return array
}

function player () {
  if (turn%2) {
    return "O"
  }
  else {
    return "X"
  }
}

function updateState(element){
    if ($(element).text() === "") {
      $(element).text(player())
      turn++
    }
}

function setMessage(string){
    $("#message").html("<p>" + string + "<p>")
}

function checkWinner(){
  var winner = false
  b = getBoard()
  winningSets = getWinningSets()
  win = winningSets.filter(array => (array[0] === array[1] && array[1] === array[2] && array[2] !== ""))
  if (win.length !== 0){
    setMessage(`Player ${win[0][0]} Won!`);
    return winner = true }
  return winner
}

function doTurn(element) {
  if (!checkWinner()){
    updateState(element)
    if (checkWinner()){
      saveGame();
      resetBoard()
    }
    else if (turn===9) {
      setMessage("Tie game.")
      saveGame();
      resetBoard();
    }
  }
}

function attachListeners() {
  $("td").click(function(){
    var element = this
    doTurn(element)
  })
  $("#save").click(function(){
    saveGame()
  })
  $("#previous").click(function(){
    showPreviousGames()
  })
  $("#clear").click(function(){
    resetBoard()
  })
}

function saveGame() {
  gameData = { state: b };

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
  currentGame = 0
}

function resetBoard() {
  $('td').empty();
  turn = 0
  currentGame = 0
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
    var tableItems = $("tr td")
   	tableItems.each(function(inx, td) {
        $(td).html(state[inx])
    })
    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.')
    }
    }
    xhr.send(null)
  }
