var turn = 0;
var currentGame = false

$(document).ready(function(){
  attachListeners()
});

function attachListeners(){
  $('td').on("click", function(){
    if($.text(this) === ""){
        doTurn(this)
    }
})
  $('#save').on("click", saveGame())
  $('#previous').on('click', function(){
    showPreviousGames()
  })
  $('#clear').on('click', () => resetBoard())
}

var winningCombo = 
  [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
  [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square){
  updateState(square)
  turn++
  if(checkWinner()){
    saveGame()
    resetBoard()  
  } else if(turn === 9){
    setMessage('Tie game.')
    saveGame()
    resetBoard()
  }
}

function fullBoard(){
  if(turn === 9){
    return true;
  } 
  return false
}

function updateState(square){
  let turn = player()
  $(square).text(turn)
}

function setMessage(message){
  $('#message').text(message)
}

function checkWinner(){
 var board = {}
 var winner = false;

  $('td').text((index, value) => board[index] = value)

  winningCombo.some(function(combo){
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[1]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function resetBoard(){
  $('td').empty()
  turn = 0;
  currentGame = 0;
}

function saveGame(){
  var state = []
  var gameData

  $('td').text(function(index, value){
    return state[index] = value;
  }) // array of gamestate
  
  gameData = { state: state }; // object of past games

  if(currentGame){  // update the gmae object using AJAX
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`, // how do I check im getting the right data back
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game){ // create the game object
      currentGame = game.data.id
      $('#games').append(`<button id="game-id-${currentGame}">${currentGame}</button><br>`)
      $('#game-id-' + currentGame).on("click", () => reloadGame(currentGame))
    })
  }
}

function reloadGame(gameId){
  $('#message').text("")

  var req = new XMLHttpRequest()
  req.open("GET", `/games/${gameId}`)

  req.onload = () => {
    const data = JSON.parse(req.responseText).data;
    const id = data.id
    const state = data.attributes.state
    var index = 0;
    for(var y = 0; y < 3; y++){
      for(var x = 0; x < 3; x++){
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
      }
      index++
    }

  turn = state.join('').length
  currentGame = id;

  if(!checkWinner && turn === 9){
    setMessage("Tie Game.")
  }

  }
  req.send(null)

}

function showPreviousGames(){
  $.get("/games", function(savedGames){
    if(savedGames){
      savedGames.data.forEach(buttonizePreviousGame)
    }
  })
}
function buttonizePreviousGame(game){
  $('#games').append(`<button id="gameid=${game.id}">${game.id}</button><br>`)
  $(`#gameid-${game.id}`).on("click", () => reloadGame(game.id))
}



