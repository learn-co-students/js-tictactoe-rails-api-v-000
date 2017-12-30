// Code your JavaScript / jQuery solution here
const WINNERS = new Set().add([0,1,2]).add([3,4,5]).add([6,7,8]).add([0,3,6]).add([1,4,7]).add([2,5,8]).add([0,4,8]).add([2,4,6])
var turn = 0
var currGameId = false

function player(){
  if (turn % 2 === 0){
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square){
  $(square).text(player())
}

function setMessage(msg){
  $('#message').text(msg)
}

function getBoard(){
  let currBoard = []
  for (let i = 0; i < 9; i++) {
    currBoard.push($('td')[i].innerHTML)
  }
  return currBoard
}

function checkWinner(){
  let won = false

  let currBoard = getBoard()

  WINNERS.forEach((combo) => {
      if(currBoard[combo[0]]==='X' && currBoard[combo[1]]==='X' && currBoard[combo[2]] === 'X'){
        setMessage('Player X Won!')
        won = true
      }

      if(currBoard[combo[0]]==='O' && currBoard[combo[1]]==='O' && currBoard[combo[2]] === 'O'){
        setMessage('Player O Won!')
        won = true
      }
    })
  return won
}

function resetBoard(){
  for (let i = 0; i < 9; i++) {
    $('td')[i].innerHTML = ""
  }
}

function doTurn(square){
  turnsUp = turn > 9
  if (!turnsUp){
    updateState(square)
    turn++
    won = checkWinner()
    if (won) {
      resetBoard()
      turn = 0
    }
  }
  setMessage('Tie game.')
}

function saveGame(){
  let state = getBoard()

  if (!currGameId){
  return fetch('/games', {
    method: 'POST',
    body: JSON.stringify({state: state}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    })
    .then(res => {
     window.alert("Saved")
     return res.json()
    })
  }

  else {
    return fetch('/games', {
    method: 'PATCH',
    body: JSON.stringify({state: state}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    })
    .then(res => {
     window.alert("Updated")
     return res.json()
    })
  }
}


function showPreviousGames(){
  getGames()
}

function listGames(games){
  $('#games').append("<ul>")
  games.map(game => {
    $('#games ul').append('<li><button data-gameId="${game.id}">${game.id}</button><br></li>' )
    $('ul[data-gameId="${game.id}"]').on('click', () => loadGame(game.id))
  })
}

function clear(){
  resetBoard()
  currGameId = false
  turn = 0
}

function fetchGame(gameId){
  loadGame(getGame(gameId), gameId)
}

function getGames() {
  return fetch('/games', {accept: 'application/json'})
  .then(res => {
    listGames(res.json())
  })
}

function getGame(gameId) {
  
  let reqUri = '/games/'+gameId
  return fetch(reqUri, {accept: 'application/json'})
    .then(res => {
      return res.json()
    })
}

function loadGame(state, gameId){  
  currGame = gameId
  for (let i = 0; i < 9; i++) {
    $('td')[i].innerHTML = state[i]
  }
}

function attachListeners() {
  $('td').on('click', function(){
    doTurn(this)
  })
  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
}

$(document).ready(function() {
  attachListeners()
})