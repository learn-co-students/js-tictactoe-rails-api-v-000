// Code your JavaScript / jQuery solution here
var turn = 0
var currentGameId = false

var WIN_COMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]

function player(){
  if(turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function populateBoard(arr) {
  var squares = window.document.querySelectorAll('td')
  for (var i = 0; i < 9; i++) {
    squares[i].innerHTML = arr[i];
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
    var squares = window.document.querySelectorAll('td');
    for (var i = 0; i < 9; i++) {
      state.push(squares[i].innerHTML)
    }
    return state
}

function checkWinner(){
  var current = getBoardState()
  var winner = ""
  for (let combo of WIN_COMBINATIONS) {
    if (current[combo[0]] == current[combo[1]] && current[combo[1]] == current[combo[2]] && current[combo[0]] !== "") {
      setMessage(`Player ${current[combo[0]]} Won!`)
      return true
  }}
  return false
}

function doTurn(arg) {

  if (arg.innerHTML === "") {

    updateState(arg)
    turn = ++turn

    var winner = checkWinner()
    if (winner) {
      saveGame()
      clearBoard()
    }
    else if (turn === 9 ) {
      setMessage("Tie game.")
      saveGame()
      clearBoard()
    }
  }
}

function attachClearBoardListener() {
  $('#clear').click(function(){
    clearBoard()
  })
}
function clearBoard() {
  var squares = window.document.querySelectorAll('td')
  for (let square of squares ) {
    square.innerHTML = ""
  }
  turn = 0
  currentGameId = false
}

function attachListeners() {
  var squares = window.document.querySelectorAll('td')
  for (const square of squares ) {
    square.onclick = function(event) {
      doTurn(square)
    }
  }
}

function attachSaveGameListener() {
  $("#save").click(function(){
    saveGame()
  })
}

function saveGame() {
    var state = (getBoardState())
    var stateParams = {
      "state": state
    }
    if (currentGameId === false) {
      $.post("/games", stateParams, function(data){
        currentGameId = data["data"]["id"]
        })
      }
    else {
      stateParams.id = currentGameId
      $.ajax({
         url: `/games/${currentGameId}`,
         type: "PATCH",
         data: (stateParams),
         success: function(res) {
         }
 });


      // var xhr = new XMLHttpRequest()
      // xhr.open("PATCH", `/games/${currentGameId}`)
      // xhr.setRequestHeader("Content-type", "application/json")
      // xhr.send(JSON.stringify(stateParams))
    // }
    // return currentGameId
}
}

function getPrevious() {
    $('#previous').click(function(){
      $("#games").empty()
      $.get("/games", function(resp){
        for (var game in resp.data){
          var location = resp.data[game]["id"]
          var button = document.createElement("button")
          button.id = location
          button.className = "loadGame"
          button.innerHTML = location
        $("#games").append(button)//.append('<br>')
      }
      loadGame()
      })
    }
  )
}

function getTurn(){
  var empty = state.filter(cell => cell === "")
  return 9-empty.length
}

function loadGame(){
  $('.loadGame').click(function(){
    $.get(`/games/${this.id}`, function(resp){
      state = resp.data.attributes.state
      clearBoard()
      populateBoard(state)
      currentGameId = resp.data.id
      turn = getTurn()
    })

  })
}

$(function(){
  attachListeners()
  getPrevious()
  attachSaveGameListener()
  attachClearBoardListener()
})
