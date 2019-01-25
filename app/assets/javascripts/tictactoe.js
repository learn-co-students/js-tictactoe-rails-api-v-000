$ (function () {
attachListeners()
})

var turn = 0
var winCombinations = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[6,4,2]
]
var gameId = 0

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(square) {
  let token = player()
  let position = $(square)
  return position.text(token)
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {
  const squares = window.document.querySelectorAll('td')
  var status = false
  let win = winCombinations.forEach(function(winCombination) {

  var winIndex1 = winCombination[0]
  var winIndex2 = winCombination[1]
  var winIndex3 = winCombination[2]

  var position1 = squares[winIndex1].innerHTML
  var position2 = squares[winIndex2].innerHTML
  var position3 = squares[winIndex3].innerHTML

  if (position1 == "X" && position2 == "X" && position3 == "X" || position1 == "O" && position2 == "O" && position3 == "O") {
  setMessage(`Player ${position1} Won!`)
  status = true
  } 
  })
  return status
}


function draw() {
//debugger
  const squares = window.document.querySelectorAll('td')
  let win = winCombinations.forEach(function(winCombination) {

  var winIndex1 = winCombination[0]
  var winIndex2 = winCombination[1]
  var winIndex3 = winCombination[2]

  var position1 = squares[winIndex1].innerHTML
  var position2 = squares[winIndex2].innerHTML
  var position3 = squares[winIndex3].innerHTML

  if (position1 !==  position2 || position2 !== position3 || position3 !==  position1 ){
  setMessage(`Tie game.`)} 
  reset()
  })

}  


function doTurn(square) {
  let state = updateState(square)
  turn += 1
  let winner = checkWinner()

  if (winner === true) {
  saveGame()
  previousGames()
  reset()
  } else if (turn === 9) { 
   saveGame()
   previousGames()
    draw();
  }


}



function reset(){
  let squares = window.document.querySelectorAll('td')
  squares = Array.prototype.map.call(squares, function(obj) {
  obj.innerHTML = "";
  turn = 0
  gameId = 0
  })
}



function attachListeners() {
  let winner = checkWinner()

  var squares = window.document.querySelectorAll('td')
  for (var i = 0; i < squares.length; i++) {
  squares[i].addEventListener('click', function(e) {
  if (!checkWinner() && !this.innerHTML) {
  doTurn(this)
  }
  e.preventDefault()
  })
  }

  $("#save").click(saveGame)
  $("#previous").click(previousGames)
  $("#clear").click(reset)
}

function board() {
  let squares = window.document.querySelectorAll('td')
//debugger
  var newSquares = Array.prototype.map.call(squares, function(obj) {
  return obj.innerHTML 
  })
//debugger
  return newSquares
}

function saveGame() {
//debugger
  let game = {"state": board()}
//debugger
  if (gameId === 0) {
    $.post("/games", game,  function(resp) {
    gameId = parseInt(resp.data.id)
  })
  }else { 
    $.ajax({
    url: `/games/${gameId}`,
    method: "PATCH",
    data: game
    })
  }  
}  
function previousGames() {
  $("#games").empty();
  $.get("/games", function(resp) {
    resp.data.forEach(function(game) {
      $("#games").append(`<button data-id="${game.id}" onclick="savedGame(${game.id})">${game.id}</button>`).val()
      })
    })
}
function savedGame(Id) {
  gameId = Id
  let game =  $.get(`/games/${Id}`, function(resp) {
    $('td').toArray().forEach((el, index) => {el.innerHTML = 
    resp.data.attributes.state[index]
    if (el.innerHTML != "") {turn++}})
  })
}