var turn = 0
const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
var gameId = 0

function getBoard(){
  return $("td").toArray().map((e) => {return e.innerHTML})
}

function resetBoard(){
  turn = 0;
  gameId = 0;
  return $("td").empty();
}

function player(){
  if(turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element){
  element.innerHTML += player();
}

function setMessage(string){
  $('div#message')[0].innerHTML += string
}

function checkWinner(){
  let board = getBoard()

  for(c of win_combos){
    if (board[c[0]] === "X" && board[c[1]] === "X" && board[c[2]] === "X" ) {
    setMessage('Player X Won!')
    saveGame()
    return true
  } else if (board[c[0]] === "O" && board[c[1]] === "O" && board[c[2]] === "O" ){
    setMessage('Player O Won!')
    saveGame()
    return true
  }
} return false
}

function doTurn(){
  var board = getBoard()
  updateState(player())
  turn += 1
  if(checkWinner()){
    resetBoard()
  } else if(turn === 9) {
    setMessage("Tie game.")
    resetBoard()
  } saveGame()
}

function attachListeners(){
  $("td").on("click", function(){
    if(!$.text(this) && !checkWinner()){ //if the text of the td element clicked doesn't exist and checkWinner is false
      doTurn(this) //do turn. this is passed in because updateState requires an argument
    }
  })

  $("#clear").on("click", function(){
    resetBoard()
  })

  $("#previous").on("click", function(){
    previousGames()
  })

  $("#save").on("click", function(){
    saveGame()
  })
}

$(document).ready(function(){
  attachListeners()
})

function previousGames(){
  $.get("/games", function(resp){
    $("#games").empty()
    resp.data.forEach(function(game){
      $("#games").append(`<button class data-id="${game.id}" onclick="loadGame(${game.id})"> Game ${game.id}</button><br>`)
    })
  })
}

function saveGame(){
  game = {state: getBoard()}
  //if the game Id is 0, then make a post request to create an id
  if (gameId === 0){
    //post request to /games as defined in rake routes, give in game element, and function defined from resp
    $.post(`/games`, game, function(resp){
      gameId = parseInt(resp.data.id)
    })
    //else update the game PATCH method
  } else {
    //make the ajax request with 3 pieces of data: url, method and data to patch in database
    $.ajax({
      url: `/games/${gameId}`,
      method: 'PATCH',
      data: game
    })
  }
}

function loadGame(id){
  gameId = id
  $.getJSON(`/games/${gameId}`, function(resp){
    //response is heavily nested JSON object, needs to get in the state section
    resp.data.attributes.state.forEach(function(state, index){
      //debugger
      if (state){
        $("td")[index] = state
        turn ++
      } else {
        $("td")[index] = ''
      }
    })
  })
}
