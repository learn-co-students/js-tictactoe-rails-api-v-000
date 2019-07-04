// Code your JavaScript / jQuery solution here
var turn = 0;
var WinCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]]
var currentGame = 0

function resetBoard(){
  $('td').empty()
  turn = 0
  currentGame = 0
}

function player(){
  if (turn % 2){
    return "O"
  }else {
    return "X"
  }
}

function updateState(square){
  var token = player()
  square.innerHTML = token
}

function setMessage(string){
  document.querySelector('#message').innerHTML = string
}

function checkWinner(){
  var tds = document.querySelectorAll("td")
  var board = []
  var winner = false
    tds.forEach(function(td){
      board.push(td.innerHTML)
    })
  WinCombos.forEach(function(winCombo){
    if (board[winCombo[0]] !== "" && board[winCombo[0]] === board[winCombo[1]] && board[winCombo[1]] === board[winCombo[2]]){
      setMessage(`Player ${board[winCombo[0]]} Won!`)
      return winner = true
    }})          
  return winner
}

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()){
    saveGame()
    resetBoard()
  } else if (turn === 9){
    setMessage('Tie game.')
    saveGame()
    resetBoard()
  }  
}

$(document).ready(function() {
  attachListeners();
  previous();
});
function attachListeners(){
  $('td').on('click', function(){
    if (this.innerHTML === "" && !checkWinner()){
      doTurn(this)
    }
  })
  $("#save").on('click', saveGame())
}

function previousGame() {
  $("#previous").on('click', function(){
    $.get("/games", function(data){
      data["data"].forEach(function(game){
        // const button = document.createElement("button")
        // const id = game.id
        // button.appendChild(id)
        // document.getElementById("games").appendChild(button)
      })
    })
  })
}

function saveGame(){
  var board = []
  $('td').text((index, square) => {
    board.push(square)
  })
  var data = {state: board}
   if (currentGame !== 0){
    $.ajax({
      url: `/games/${currentGame}`,
      data: data,
      type: 'patch'
    }) 
   } else {
    $.post(`/games`, data, function(game){
      currentGame = game.data.id
      })
    }
}

function clear(){
  $("#clear").on('click', function(){
    resetBoard()
  })
}