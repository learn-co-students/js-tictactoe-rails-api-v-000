// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
function isEven(n) {
   return n % 2 == 0;
}

function player(){
  if (isEven(turn) ) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(position){
  $(position).text(player())
}

function setMessage(message){
  $("#message").text(message)
}

function checkWinner(){
  var board = $("td")
  if (board[0].innerHTML === board[1].innerHTML && board[1].innerHTML === board[2].innerHTML && board[2].innerHTML !== ""){
    setMessage(`Player ${board[0].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[3].innerHTML === board[4].innerHTML && board[4].innerHTML === board[5].innerHTML && board[5].innerHTML !== "") {
    setMessage(`Player ${board[4].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[6].innerHTML === board[7].innerHTML && board[7].innerHTML === board[8].innerHTML && board[8].innerHTML !== "") {
    setMessage(`Player ${board[6].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[0].innerHTML === board[3].innerHTML && board[3].innerHTML === board[6].innerHTML && board[6].innerHTML !== "") {
    setMessage(`Player ${board[0].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[1].innerHTML === board[4].innerHTML && board[4].innerHTML === board[7].innerHTML && board[7].innerHTML !== "") {
    setMessage(`Player ${board[1].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[2].innerHTML === board[5].innerHTML && board[5].innerHTML === board[8].innerHTML && board[8].innerHTML !== "") {
    setMessage(`Player ${board[2].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[0].innerHTML === board[4].innerHTML && board[4].innerHTML === board[8].innerHTML && board[8].innerHTML !== "") {
    setMessage(`Player ${board[0].innerHTML} Won!`)
    $.post("/games")
    return true
  } else if (board[2].innerHTML === board[4].innerHTML && board[4].innerHTML === board[6].innerHTML && board[6].innerHTML !== "") {
    setMessage(`Player ${board[2].innerHTML} Won!`)
    $.post("/games")
    return true
  } else {
    return false
  }
}

function tieGame() {
  var board = $("td")
  if (board[0].innerHTML !== "" && board[1].innerHTML !== "" && board[2].innerHTML !== "" && board[3].innerHTML !== "" && board[4].innerHTML !== "" && board[5].innerHTML !== "" && board[6].innerHTML !== "" && board[8].innerHTML !== "" ){
    setMessage("Tie game.")
    $.post("/games")
    return true
  }
}

function doTurn(position) {
  updateState(position)
  turn += 1
  if (checkWinner()) {
    turn = 0
    currentGame = 0
    //var nodes = document.querySelectorAll('td')
    $("td").empty()
    //nodes.forEach(function(node) {
      //  node.innerHTML.empty
    //})
  } else if (tieGame() === true) {
    turn = 0
    currentGame = 0
    var nodes = document.querySelectorAll('td')
    nodes.forEach(function(node) {
        node.innerHTML = ""
    })
  }
}


var previous = function() {
  $("#previous").on("click", function(){
    $.get("/games", function(data) {
      var games = data
      gameList = document.querySelector("#games")
      gameButton = ""
      games["data"].forEach(function(game){
        gameButton += '<button id=' + game["id"] + ' onclick="getGame(' + game["id"] + ')">' + game + '</button>'
        $("#games").html(gameButton)
      })
    })
  })
}

function getGame(id){
  $.get(`/games/${id}`, function(data){
    currentGame = id
    var newBoard = data["data"]["attributes"]["state"]
    var board = $("td")
    $("td").each(function(index, square){
      square.innerHTML = newBoard[index]
      if (newBoard[index] !== ""){
        turn += 1
      }
    })
  })
}


function attachListeners(){
  $("td").click(function(){
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this)
    }
  })
  previous()
  $("#save").on("click", function(){save()})
  clear()
}

var save = function(){
  var state = [];
  var gameData;
  $("td").each(function(index, square){
    state.push(square.innerHTML)
  })
  gameData = {state: state}

    if (currentGame === 0) {
      $.post("/games",gameData, function(data){
        currentGame = data["data"]["id"]
      })
    } else {
      $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
    }
  }


var clear = function(){
  $("#clear").on("click", function(){
    turn = 0
    currentGame = 0
    var nodes = document.querySelectorAll('td')
    nodes.forEach(function(node) {
        node.innerHTML = ""
    })
  })
}



$(document).ready(function(){
  attachListeners()

})
