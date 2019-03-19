// import { uptime } from "os";

var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0

var currentGame = 0

$(document).ready(function(){
  attachListeners();
})

var player = () => turn % 2 === 0 ? "X" : "O";  

function updateState(square){

    var token = player();

    $(square).text(token);

}

function setMessage (s) {
  $('#message').text(s);
}

function checkWinner () {

  var board = {};

  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo){
    
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
    return winner;
};

function doTurn (square) {
  updateState(square);
  
  //passing in the same variable to a function called by another function is no prob (and what I was going to code at first :) :) :) )
  turn++

  if (checkWinner()){
  //don't need to === true explicitly
  //this automatically calls checkWinner, no need to invoke it separately
    saveGame();
    clearBoard();

  } else if (turn === 9){
    setMessage("Tie game.");
      //don't have to declare a variable to pass tie game message through because setMessage does that
    saveGame();
    clearBoard();
  }
}
  
function attachListeners () {
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  })

  $('#previous').on('click', () => {showPreviousGames()})
  $('#save').on('click', () => {saveGame()})
  $('#clear').on('click', () => clearBoard())

}
//this is what is in the window when clicked

function saveGame () {
  //post current gameboard to database
    //post board to Game database with ajax
  var state = [];
  var gameData;
  //push current gameboard onto new array

  $('td').text((index, square) => {
    //didn't have to refer to index again here in saveGame ... it took what the first parameter would be for the element properties but it didn't necessarily need to be referred to again, not like a declared variable

    state.push(square);
  });

  gameData = { state: state };

  if (currentGame){
    $.ajax( {
      method: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      
    currentGame = game.data.id

    $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
    $("gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    
    });
  };
};

function showPreviousGames () {
  $("#games").empty();
  $.get("/games", (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(addButtonsForPreviousGames)
    }
  })
}

function addButtonsForPreviousGames(game){
  $("#games").append(`<button id="dataid-${game.id}">${game.id}</button><br>`);
  $(`#dataid-${game.id}`).on('click', () => reloadGame(game.id)); 
}

function clearBoard () {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function reloadGame(gameID) {

  document.getElementById('message').innerHTML = '';

  const XHRReq = new XMLHttpRequest()

  XHRReq.overrideMimeType('application/json');

  XHRReq.open("GET", `/games/${gameID}`, true)

  XHRReq.onload = () => {

    const data = JSON.parse(XHRReq.responseText).data;

    const id = data.id;

    const state = data.attributes.state;

    let index = 0;

    for(let y=0; y < 3; y++){
      //outer loop first in multi-dimensional loop
      for(let x=0; x < 3; x++){
        document.querySelector(`[data-x="${x}"]`, `[data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;

    currentGame = id;

    if (!checkWinner() && turn === 9){
      setMessage("Tie game.");
    }

  };

  XHRReq.send(null)

}
  // $("gameid" + game.data.id)
