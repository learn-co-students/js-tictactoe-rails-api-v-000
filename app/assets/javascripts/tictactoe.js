// Code your JavaScript / jQuery solution here

$(function() {
  attachListeners()

})

var turn = 0

var winningCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let board = ["", "", "", "", "", "", "", "", "" ]
var currentGameId = ""

function player() {
    const token = turn % 2 === 0 ? "X" : "O"
    return token
}

function updateState(square) {
    const token = player()
    square.innerHTML = token
}

function setMessage(string) {
    document.getElementById('message').innerHTML = string
}

function checkWinner() {
  let winner = false
  board = boardState()
  winningCombo.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner
}

function boardState() {
  const currentBoard = setSquares().map( data => {
    return data.innerHTML
  })
  return currentBoard
}

function doTurn(e) {
  updateState(e)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}




function attachListeners() {
  $('td').click(function(e) {
    if (e.target.innerHTML==="" && !checkWinner()) {
      doTurn(e.target)
    }
  })
  $('#save').click(saveGame)
  $('#previous').click(reloadPreviousGames)
  $('#clear').click(reset)

}

function setSquares() {
  return Array.prototype.slice.call(document.getElementsByTagName('td'))
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", "" ]
  turn = 0
  currentGameId = ""
  clearScreenBoard()
}

function clearScreenBoard() {
  return setSquares().map(square => {
    return square.innerHTML = ""
  })
}



function saveGame() {
  board = boardState()
  let method;
  method = currentGameId !== "" ? "PATCH" : "POST"
  let url = currentGameId !== "" ? `/games/${currentGameId}` : '/games'
  posting = $.ajax({
    type: method,
    url: url,
    data: { state: board },
    success: function(data) {
      console.log(data)
      let gameData = data["data"]
      currentGameId = gameData["id"]
      }
    })
}

function loadGame() {
  currentGameId = $(this).attr('data-id')
  postting = $.getJSON('/games/'+ currentGameId, function(data) {
    let gameData = data["data"]
    let state = gameData["attributes"]["state"]
    setPreviousGameBoard(state)
    turn = state.join("").length
  })
}



function setPreviousGameBoard(array) {
  const tableDatasArray = Array.prototype.slice.call(document.getElementsByTagName('td'))
  for (let i = 0; i< array.length; i++) {
    game = tableDatasArray.map( data => {
      data.innerHTML = array[i]
      i++
  })
  }
  return game
}

function resetGameMessage() {
  document.getElementById('message').innerHTML = ""
}

function reset() {
  resetBoard()
  resetGameMessage()
}

function reloadPreviousGames() {
  posting = $.ajax({
    type: "GET",
    url: '/games',
    success: function(data) {
      let allGames = data["data"]
      refreshGameList()
      allGames.forEach( game => {
        $('#games').append(`<button class="saved-games" data-id="${game["id"]}">${game["id"]}</button>`)
      })
        $('.saved-games').click(loadGame)
    }
  })
}

function refreshGameList() {
  $("#games").empty()
}
