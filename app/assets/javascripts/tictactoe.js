let turn = 0
let currentGame = 0
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


$(document).ready(function() {
    attachListeners()
  })
// event listener functions
function saveGame(){
  var state = []
  var gamedata

  $('td').text((index, square) => state[index] = square)

  gamedata = {state: state}
  if (currentGame){
    $.ajax({type: 'PATCH', url:`/games/${currentGame}`, data: gamedata})
  }else{
    $.post(`/games`, gamedata, function(game){
      currentGame = game.data.id
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
      $(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id))
    })
  }
}

function showPreviousGames(){
  $("#games").empty()
  $.get('/games', (savedGames) => {
    console.log(savedGames)
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  })
}

function buttonizePreviousGame(game){
  $('#games').append(`<button id="button-${game.id}">${game.id}</button><br>`)
  $(`#button-${game.id}`).on('click', () => reloadGame(game.id))
}

function updateState(square){
  if ($(square).text() === ""){
    $(square).text(player())
  }
}

// game funcitonality
function reloadGame(gameId){
  $.ajax({type: "GET", url: `/games/${gameId}`, success: function(data){
    let id = data.id
    let state = data.data.attributes.state
    currentGame = gameId

    let index = 0
    for(let i = 0; i< 9; i++){
      $(`#box-${i}`).text(state[index])
      index++
    }
    turn = state.length
    }
  })

  }

function player() {
  return turn % 2 ? "O" : "X"
}


function setMessage(message){
  $('#message').text(message)
}

function checkWinner(){
  let board = {}
  let winner = false

  $('td').text((index, square) => board[index] = square)

  WINNING_COMBOS.some(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square){
  updateState(square)
  turn++
    if (checkWinner()){
      saveGame()
      resetBoard()
    }else if (turn === 9) {
      setMessage("Tie game.")
      saveGame()
      resetBoard()
    }

}

function resetBoard(){
  $('td').empty()
  turn = 0
  currentGame = 0
}

function attachListeners(){
  $('#save').on('click', function(){saveGame()})
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
  $('td').on('click', function() {
    if (!$(this).text()){
      doTurn(this)
    }
  })
}
