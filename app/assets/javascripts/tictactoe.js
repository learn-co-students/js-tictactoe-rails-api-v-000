// Code your JavaScript / jQuery solution here
$(function(){
  //when adding the ability to start a previous game, switch thisGame!!
  window.turn = 0//define a turn
  //saves or updates current game
  $("#save").on("click", function(e){
    e.preventDefault()
    let gameState = [] //set gameState array to pass as JSON to rails server
    $("td").each(function(){
      gameState.push(this.textContent)
    })
    //if this current game has been savegameS already there will be an ID stored in thisGame
    //if not a new game will be created and saved, and its id will be set as thisGame
    debugger;
    if (!!thisGame) {
      $.ajax({
        url: "/games/" + thisGame,
        type: "PATCH",
        data: {state: gameState},
        success: function(r){alert("Game " + r.data["id"] + " updated!")}
      })
    } else {
      $.post('/games', {state: gameState}, function(r){
        thisGame = parseInt(r.data["id"])
        alert("New game " + thisGame + " saved!")
      })
    }
  })
  //shows previous games
  $("#previous").on("click", function(e){
    e.preventDefault()
    $.get('/games', function(r){
      let gameList = ""
      r.data.forEach(function(game){
        gameList += `<button class="oldGame" data-id="${game["id"]}">` + game["id"] + "</button>"
      })
      $("#games").html(gameList)
    })
  })

  //reloads a previous games
  $("#games").on("click", function(e){
    e.preventDefault()
    const thisID = $(e.target).data("id") //gets id of clicked game via data-id attr
    $.get("/games/" + thisID, function(r){
      thisGame = r.data["id"]//gets id from Rails server and sets as thisGame on the front-end
      let tdArray = $("td") //creates array of td elements
      const gameState = r.data.attributes["state"] //grabs state of selected game from rails server
      window.turn = gameState.filter(function(el){return el != ""}).length //counts taken spots on the board and sets the turn
      for(let i = 0; i < gameState.length; i++){
        tdArray[i].textContent = gameState[i] //assigns gameState from server to corresponding tds on front-end
      }
      checkWinner(gameState)
    })
  })

  //clears board
  $("#clear").on("click", function(e){
    e.preventDefault()
    $("#message").empty()
    thisGame = null
    clearBoard()
  })
  //adds X or O to the board, changes the gameState, and invokes doTurn()
  $("td").on("click", function(e){
    if(e.target.textContent === "" && !checkWinner()){
      doTurn(e.target)
    }
  })


})

//global variables

const winningNumbers = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
let state = []

let thisGame //set a game ID to determine if this game has already been saved

//global functions

function player(){
  if (window.turn % 2 === 0){
    return "X"
  }else{
    return "O"
  }
}

function updateState(element){
    element.textContent = player()
}

function checkWinner(){
  state = [] //erase previous state
  $("td").each(function(){state.push(this.innerHTML)}) //updates with a new state
  let winner = false
  winningNumbers.forEach(function(nums){
    if (state[nums[0]] === state[nums[1]] && state[nums[1]] === state[nums[2]] && state[nums[0]] !== ""){
      setMessage("Player " + state[nums[1]] + " Won!")
      winner = true
    }
  })
  return winner
}

function setMessage(phrase){
  $("#message").html(phrase)
}

function doTurn(element){
  attachListeners()
  updateState(element)
  window.turn++
  if (window.turn === 9 && !checkWinner()){
    setMessage("Tie game.")
    saveData()
    clearBoard()
  }else if(!!checkWinner()){
    saveData()
    clearBoard()
  }
}

function clearBoard(){
  state = []
  window.turn = 0
  $("td").each(function(){
    this.textContent = "" //sets each td-tag's value to an empty string
  })
}

function saveData(){
  if (!!thisGame) {
    $.ajax({
      url: "/games/" + thisGame,
      type: "PATCH",
      data: {state},
      success: function(r){alert("Game " + thisGame + " updated!")}
    })
  } else {
    $.post('/games', {state}, function(r){
      alert("New game " + thisGame + " saved!")
    })
  }
}

function attachListeners(){

}
