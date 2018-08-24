// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0
var gameNumber = 0;

$(document).ready(function() {
  attachListeners()
});

function attachListeners(){
  $('td').on( "click", function (){
    if (this.innerText === "" && !checkWinner()) {
      doTurn(this);
    }
  })

  $('#previous').on('click', () => showPreviousGames())
  $('#save').on('click', () => saveGame())
  $('#clear').on('click', () => resetGame())
  // $('#games > button').on('click', () => loadGame())
}

function player(){
  if (turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element){
  element.innerText = player()
}

function setMessage(message){
  $('#message').text(e => message)
}

function compareArrays(a, b) {
  return !a.some(function (e, i) {
      return e != b[i];
  });
}

function checkWinner(){
  var xArray = []
  var oArray = []
  var winner = false

  $("td").each(function( index ) {
    if (this.innerText === 'X'){
      xArray.push(index)
    }
    if (this.innerText === 'O'){
      oArray.push(index)
    }
  });

  WINNING_COMBOS.forEach(function (currentValue){
    var xWin = compareArrays(currentValue, xArray)
    var oWin = compareArrays(currentValue, oArray)
    if (xWin === true) {
      winner = true
      setMessage("Player X Won!")
    }
    if (oWin === true) {
      winner = true
      setMessage("Player O Won!")
    }
  });

  return winner
}

function resetGame(){
  for (let i = 0; i < 9; i++) {
    $('td')[i].innerHTML = '';
  }
  turn = 0
  gameNumber = 0
}

function doTurn(element){
  updateState(element)
  turn++
  if (turn === 9 && !checkWinner()){
    saveGame()
    resetGame()
    setMessage("Tie game.")
  }

  if (checkWinner()){
    saveGame()
    resetGame()
  }
}

function showPreviousGames(){
  if ($('#games').empty()) {
    $.get( "/games", function( data ) {
      data['data'].forEach( game => {
          $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
      })
    });
  }
}

function getState(){
  var result = []
  $('td').text( (index, state) => {
    result.push(state)} )
  return result
}

function saveGame(){
  var data = { state: getState()}

  if (gameNumber === 0){
    $.post("/games", data).done( (resp) => { gameNumber = resp['data'].id })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameNumber}`,
      data: data
    });
  }
}

function loadGame(){
  debugger
}
