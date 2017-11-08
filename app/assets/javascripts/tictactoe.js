// Code your JavaScript / jQuery solution here

window.turn = 0;
let gameId = 0;
const win_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
[1,4,7], [2,5,8], [0,4,8], [2,4,6]];


function player(){
  if(turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(square){  
 square.innerHTML = player()
}

function setMessage(string){
  $('#message').text(string)
}

function currentBoardArray(){
  current_board = []
  for(let i = 0; i < 9; i++){
    v = $("td")[i].innerHTML
    current_board.push(v)
  }
  return current_board
}

function checkWinner(){
  // FIRST, make an array of the current board state.
  board = currentBoardArray()
  
  // Then check if anyone won.
  let won = false
  win_combos.forEach(function(combo){
    if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && spaceTaken(board[combo[0]])){
      won = true
      setMessage(`Player ${board[combo[0]]} Won!`)
    }
  })
  return won
}

function boardFull(){
  board = currentBoardArray()
  let full = true
  board.forEach(function(item){
    if(item === ""){
      full = false
    }
  })
  return full
}

function checkWinnerTwo(){
  return checkWinner()
}

function doTurn(clickedElement){
  updateState(clickedElement)
  turn ++

  winner = checkWinner()

  if(winner === true){
    saveOrCreate()
    resetBoard()
  }

  if(boardFull() === true && winner === false){
    setMessage("Tie game.")
    saveOrCreate()
    resetBoard()
  }

}

function spaceTaken(space){
  if(space === "X" || space === "O"){
    return true
  } else {
    return false
  }
}

function saveGame(){
  $.ajax({
    url: `/games/${gameId}`,
    type: 'PATCH',
    data: {
      state: currentBoardArray()
    }
  })
}

function newGame(){
  let newGame = $.post('/games', { state: currentBoardArray() } )
  newGame.done(function(data){        
    gameId = data["data"]["id"]
  })
}

function saveOrCreate(){
    if(gameId === 0){
      newGame()
    } else {
      saveGame()
    }
}

function populateBoard(arr) {
  for (let i = 0; i < 9; i++) {
    $("td")[i].innerHTML = arr[i];
  }
}

function getGame(id){
  $.get("/games/" + id, function(response){
    populateBoard(response["data"]["attributes"]["state"])
    gameId = response["data"]["id"]
    turn = getGameTurn()
  })
}


function getGameTurn(){
  count = 0
  currentBoardArray().forEach(function(item){
    if(spaceTaken(item) === true){
      count++
    }
  })
  return count
}

function attachListeners(){
  // squares of game board
  $('td').on('click', function(){
    if(this.innerHTML === ""){
      doTurn(this)
    }
  })
  // when clicked, invoke doTurn and pass element that was clicked

  // button#save
  $('#save').on('click', function(){
    saveOrCreate()
  })

  // button#previous
  $('#previous').on('click', function(){
    $.get("/games", function(response){
      $("#games").text("")
      response["data"].forEach(function(item){
        $("#games").append(`<button id="game-${item["id"]}" onclick="getGame(${item["id"]})">Game # ${item["id"]}</button>`)
      })
    })
  })

  // button#clear
  $('#clear').on('click', function(){
    resetBoard()
  })

}


function resetBoard(){
  $('td').text("")
  turn = 0
  gameId = 0  
}


$(document).ready(function(){
  attachListeners()
})