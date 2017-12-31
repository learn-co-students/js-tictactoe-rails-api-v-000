// Code your JavaScript / jQuery solution here
const WINNERS = new Set().add([0,1,2]).add([3,4,5]).add([6,7,8]).add([0,3,6]).add([1,4,7]).add([2,5,8]).add([0,4,8]).add([2,4,6])
var turn = 0
var currGameId = null

function player(){
  if (turn % 2 === 0){
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square){
  if (square.innerHTML === ""){
    $(square).text(player())
    turn++
  }
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

function boardFull(){
  let result = getBoard().reduce(
    (accumulator, currentValue) => {
      if (currentValue !== ""){
      return accumulator++
      }
      else{
        return accumulator
      }
    },0)
  if (result === 9){
    return true
  }
  else {
    return false
  }
}

function checkWinner(){
  let won = false
  let currBoard = getBoard()

  WINNERS.forEach((combo) => {
      if(currBoard[combo[0]]==='X' && currBoard[combo[1]]==='X' && currBoard[combo[2]] === 'X'){
        setMessage('Player X Won!')
        won = true
        clear()
      }

      if(currBoard[combo[0]]==='O' && currBoard[combo[1]]==='O' && currBoard[combo[2]] === 'O'){
        setMessage('Player O Won!')
        won = true
        clear()
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
  if (!checkWinner() & !boardFull()){
    if (turn < 9){
      updateState(square)
    }
    if (turn > 8){
      if (!checkWinner()){
        setMessage('Tie game.')
      }
    }
    if (checkWinner()){
      clear()
    }
  }
}

// function saveGame(){
//   let state = getBoard()

//   if (!currGameId){
//   fetch('/games',{method: 'POST',body: JSON.stringify({state: state}),headers: {'Accept': 'application/json','Content-Type': 'application/json'}})
//     .then(res => {
//      return res.json()
//     })
//     .then(responseJson => {
//       console.log(responseJson)
//     })
//   }

//   else {
//     fetch('/games',{method: 'PATCH',body: JSON.stringify({state: state}),headers: {'Accept': 'application/json','Content-Type': 'application/json'}})
//     .then(res => {
//      return res.json()
//     })
//     .then(responseJson => {
//       console.log(responseJson)
//     })
//   }
// }


function saveGame(){
  let state = getBoard()

  if (currGameId === null){
    $.ajax({
      dataType: "json",
      method: 'POST',
      data: {state:state},
      url: '/games',
      success: (res) => setMessage('Successully created: ', res)
    })
  }

  else if (currGameId != null){
    $.ajax({
      dataType: "json",
      method: 'PATCH',
      data: {state: state},
      url: '/games/'+currGameId,
      success: (res) => setMessage('Successully updated existing game:'+currGameId)
    })
  }
}
function showPreviousGames(){
  getGames()
}

function listGames(games){
  $('#games').empty()

  $('#games').append("<ul>")
  games.data.map(game => {
    
    $('#games ul').append(`<li><button data-gameId="${game.id}"  onclick="getGame(${game.id})">${game.id}</button><br></li>` )
  })
}

function clear(){
  resetBoard()
  currGameId = null
  turn = 0
}

//**WHY DOESN'T THE TEST WORK W FETCH????**/
// function getGames() {
//   fetch('/games', {accept: 'application/json'})
//     .then(res => {
//       return res.json()
//     }).then(responseJson => {
//       listGames(responseJson)
//     })
// }

function getGames(){
  $.ajax({
    dataType: "json",
    url: '/games',
    success: (res) => listGames(res)
  })
}

//**WHY DOESN'T THE TEST WORK W FETCH????**/
// function getGame(gameId) {
//   let reqUri = '/games/'+gameId
//   fetch(reqUri, {accept: 'application/json'})
//     .then(res => {
//         return res.json()
//       }).then(responseJson => {
//         loadBoard(responseJson.data.attributes.state, gameId)
//     })
// }

function getGame(gameId){
  setMessage('')
  clear()
  $.ajax({
    dataType: "json",
    url: '/games/'+gameId,
    success: (res) => loadBoard(res, gameId)
  })
}

function loadBoard(state, gameId){  
  currGameId = gameId
  for (let i = 0; i < 9; i++) {
    $('td')[i].innerHTML = state.data.attributes.state[i]
    if (state.data.attributes.state[i] !== ""){
      turn++
    }
  }
  // attachListeners()
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