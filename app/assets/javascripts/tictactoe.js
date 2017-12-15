// Code your JavaScript / jQuery solution here
var turn = 0
var currentGameId

WIN_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]

function player(){
  if(turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(cell) {
  var token = player()
  cell.innerHTML = token
}

function setMessage(message) {
  document.getElementById("message").innerHTML = message
}

function getBoardState() {
    var state = []
    const squares = window.document.querySelectorAll('td');
    for (let i = 0; i < 9; i++) {
      state.push(squares[i].innerHTML)
    }
    return state
}

function checkWinner(){
  let current = getBoardState()
  var winner = ""
  for (const combo of WIN_COMBINATIONS) {
    if (current[combo[0]] == current[combo[1]] && current[combo[1]] == current[combo[2]] && current[combo[0]] !== "") {
      setMessage(`Player ${current[combo[0]]} Won!`)
      return true
  }}
  return false
}

function doTurn(arg) {
  if (arg.innerHTML === "") {
    updateState(arg)
    const winner = checkWinner()
    turn = ++turn
    if (turn === 9 ) {
      setMessage("Tie game.")
      saveGame()
      clearBoard()
    }
    else if (winner) {
      saveGame()
      clearBoard()
    }
  }
}

function clearBoard() {
  let squares = window.document.querySelectorAll('td')
  for (const square of squares ) {
    square.innerHTML = ""
  }
  turn = 0
}

function attachListeners() {
  let squares = window.document.querySelectorAll('td')
  for (const square of squares ) {
    square.onclick = function(event) {
      doTurn(square)
    }
  }
}

function saveGame() {
  $("#save").click(function(){
    let state = (getBoardState())
    let stateParams = {
      "state": state
    }
    if (currentGameId === undefined) {
      $.post("/games", stateParams, function(data){
        currentGameId = data["data"]["id"]
        })
      }
    else {
      var xhr = new XMLHttpRequest()
      xhr.open("PATCH", `/games/${currentGameId}`)
      xhr.setRequestHeader("Content-type", "application/json")
      xhr.send(JSON.stringify(stateParams))
    }
  })
}

function getPrevious() {
    $('#previous').click(function(){
      if($('#games')[0].childNodes.length === 0) {
      $.get("/games", function(resp){
        for (const game in resp.data){
          var location = resp.data[game]["id"]
          var button = document.createElement("button", {id:`${location}`})
          button.innerHTML = location
        $("#games").append(button)//.append('<br>')
      }
      })
    }})
}

function loadGame(){

}

$(function(){
  attachListeners()
  getPrevious()
  saveGame()
})
