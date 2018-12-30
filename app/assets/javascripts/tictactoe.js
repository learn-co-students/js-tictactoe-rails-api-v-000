// Code your JavaScript / jQuery solution here

var turn = 0
let board
let saveButton
let clearButton
let previousButton
let currID
let gameBox

function player() {
// based on turn variable, set the player Icon X or O
  if (turn % 2 == 0 ){
    return "X"
  } else {
    return "O"
  }
}

function boardFillCount() {
  let totalSpace = 9
  for (let i= 0; i<9; i++) {
    if(board[i].innerHTML == "") {
      totalSpace --
    }
  }
  return totalSpace
}

function clearBoard() {
  for (let i = 0; i <9 ; i++) {
    board[i].innerHTML = ""
  }
  turn = 0
  currID = 0
}

function fillBoard(state){

  for (let i = 0; i<9; i ++){
    board[i].innerHTML = state[i]
  }
  turn = boardFillCount()
}

function setMessage(message) {
  $("div#message").text(message)
}

function updateState(square) {
  square.innerHTML = player()
}

function checkWinner() {
  if (checkHalf("X")) {
    setMessage("Player X Won!")
    return true
  } else if (checkHalf("O")) {
    setMessage("Player O Won!")
    return true
  } else {
    return false
  }
}

function checkHalf(token) {
  let vertical = ($('*[data-x="0"]').toArray().every((val, i, arr) => val.innerHTML === token)||
  $('*[data-x="1"]').toArray().every((val, i, arr) => val.innerHTML === token)||
  $('*[data-x="2"]').toArray().every((val, i, arr) => val.innerHTML === token))

  let horizontal = ($('*[data-y="0"]').toArray().every((val, i, arr) => val.innerHTML === token)||
  $('*[data-y="1"]').toArray().every((val, i, arr) => val.innerHTML === token)||
  $('*[data-y="2"]').toArray().every((val, i, arr) => val.innerHTML === token))

  let diagonal = ([board[0], board[4], board[8]].every((val, i, arr) => val.innerHTML === token)||
  [board[2], board[4], board[6]].every((val, i, arr) => val.innerHTML === token))

  return (vertical || horizontal ||diagonal)
}

function doTurn(element) {
  if (element.innerHTML == "") {
    //If a turn can be taken in this spot
    updateState(element)
    turn ++

    if(checkWinner()) {
      saveGame()
      clearBoard()
    }

    if (boardFillCount() == 9) {
      setMessage("Tie game.")
      saveGame()
      clearBoard()
    }
  }
}

function saveGame() {
  var state = {}
  state["state"] = board.toArray().map(element => element.innerHTML)
  if (currID > 0) {
    state["id"] = currID
    var posting = $.ajax('/games/'+currID, {
      type: 'PATCH',
      data: state
    })
  } else {
    var posting = $.post('/games', state)
  }

  posting.done(function(data){
    var game = data
    currID = game["data"]["id"]
  })
}

function previousGame() {
  var getting = $.get('/games', function(data) {
    result = data["data"]
    newGameList = ''

    result.forEach(function(element) {
      var id = element["id"]
      newGameList += '<button data-id="' + id + '">'+ id + '</button>'
    })

    gameBox.html(newGameList)
    //data["data"][i]["attributes"]["state"]
    var allGames = $('[data-id]').toArray()

    allGames.forEach(function(element) {
      $(element).on("click", function() {
        loadGame(this)
      })
    })
  })
}

function loadGame(element) {
  //set currID as this ID

  let id = $(element).data("id")
  $.get('/games/'+id , function(data) {
    savedBoard = data["data"]["attributes"]["state"]
    fillBoard(savedBoard)

  })
  currID = id
}

function attachListeners() {
  board.each(function(index, element) {
    $(element).on("click", function() {
      if (!checkWinner()&&boardFillCount() <9){
        doTurn(this)
      }
    })
  })

  clearButton.on("click", function(){
    clearBoard()
  })

  saveButton.on("click", function() {
    saveGame()
  })

  previousButton.on("click", function() {
    previousGame()
  })

}

$(document).ready(function initialize(){
  board = $("td")
  saveButton = $("button#save")
  previousButton = $("button#previous")
  clearButton = $("button#clear")
  gameBox = $("div#games")
  attachListeners()
})
