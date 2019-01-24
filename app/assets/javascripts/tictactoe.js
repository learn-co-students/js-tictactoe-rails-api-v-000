// Code your JavaScript / jQuery solution here
var gameId = null
var turn = 0
var rows = document.getElementsByTagName("td")

function player(){
  if (turn % 2 === 0){
    return "X"
  } else {
  return "O"
  }
}

function updateState(element){
  var token = player()
  element.innerHTML = token
  //uses player() to add either an x or o to current state
}

function message(string){
  document.getElementById("message").innerHTML = string
  //accepts a string and adds to the div#message element
}


function checkWinner(){
  var winner = false
  const winCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
  ]

  winCombinations.forEach(function(combo){
    let win_index_1 = combo[0]
    let win_index_2 = combo[1]
    let win_index_3 = combo[2]

    if (rows[win_index_1].innerHTML === "X" && rows[win_index_2].innerHTML === "X" && rows[win_index_3].innerHTML === "X"  ){
      message("Player X Won!")
      winner = true
    } else if (rows[win_index_1].innerHTML === "O" && rows[win_index_2].innerHTML === "O" && rows[win_index_3].innerHTML === "O"){
      message("Player O Won!")
      winner = true
    }

  })
  return winner
  //returns true if any winning combos on board
  //otherwise returns false
  //if winner, it should call message() with the appropriate string 'Player X Won!'
}

function doTurn(element){
  if (element.innerHTML === ""){
    updateState(element)
    turn +=1
  }
  if (checkWinner() === true){
      save()
      clear()
  } else if (turn >= 9) {
    message("Tie game.")
    save()
    clear()
  }
  //increments turn variable by 1
  //calls on updateState() and passes in clicked element
  //calls on checkWinner()
}

function attachListeners(){
  //adds event listeners to save, previous, clear, and all squares on the board
  //this will invoke doTurn when a square is clicked
  turn = 0
  $("#save").on("click", save)
  $("#previous").on("click", previous)
  $("#clear").on("click", clear)
  $("td").click(function(){
    if (checkWinner() === false){
    doTurn(this)
    }
  })

}

function clear(){
  turn = 0
  gameId = null
  for (var i = 0; i < 9; i++) {
    rows[i].innerHTML = ""
  }
}


function previous(){
  let displayedGames = document.getElementsByTagName("button")
  let usedIds = []
  for (var i = 0; i < displayedGames.length; i++) {
    usedIds.push(displayedGames[i].id)
  }

  $.get("/games",function(data){
    let games = data["data"]
    games.forEach(function(game){
      if (usedIds.includes(game["id"])){
      } else {
        $("#games").append(`<button id="${game["id"]}" onclick="showGame.call(this)">${game["id"]}</button>`)
      }
    })
  })
}

function save(){
  var board = []
  for (var i = 0; i < 9; i++) {
    board.push(rows[i].innerHTML)
  }

  if (gameId === null){
    var saving = $.ajax({
      type: 'POST',
      url: '/games',
      data: {
        state: board
      },
      dataType: 'json'
    })

    saving.done(function(data){
      gameId = data["data"]["id"]
    })
  } else {
    var saving = $.ajax({
      type: 'PATCH',
      url: '/games/' + gameId,
      data: {
        state: board
      },
      dataType: 'json'
    })
  }
}

function showGame(){
  gameId = parseInt(this.innerHTML)
  $.get(`/games/${gameId}`, function(data){
    let board = data["data"]["attributes"]["state"]
    for (var i = 0; i < 9; i++) {
    rows[i].innerHTML = board[i]
    }
    turn = board.reduce(function(sum,value){
      if (value === "X" || value === "O"){
        return sum + 1
      } else {
        return sum
      }
    }, 0)
  })
}

$(document).ready(attachListeners)
