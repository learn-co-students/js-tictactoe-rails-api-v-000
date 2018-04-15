// OO Classes

function createGame(){
  let allGames = []
  return class Game{
    constructor(id, state){
      this.id = parseInt(id)
      this.state = state
      Game.AddGame(this)
    }
    static AddGame(game){
      allGames.push(game)
    }
    static All(){
      return allGames
    }
    static Finder(id){
      return Game.All().find(function(element){
        return element.id == id
      })
    }
  }
}

const Game = createGame()

window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}

let turn = 0
let gameId = 0
function player(){
  return turn % 2 ? 'O' : 'X';
}

// EventListeners

function attachListeners(){
  $("td").on("click", function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })
  $("#save").on("click", ()=> saveGame())
  $("#previous").on("click", ()=> previousGames())
  $("#clear").on("click", ()=> resetBoard())     
}

// Button Functions

function saveGame(){
  // console.log("SAVE") 
  let state = boardState()
  if (gameId !== 0){
    $.ajax({
      url: `/games/${gameId}`,
      method: 'PATCH',
      data: {state: state},
      success: (data)=>console.log("Game Saved")
    })
  } else {
    $.ajax({
      url: '/games',
      method: 'POST',
      data: {state: state}, 
      success: (data)=> gameId = data.data.id
    })
  } 
}

function previousGames(){
  $.ajax({
    url: "/games", 
    method: "GET",
    success: showGames
  })
}

function loadGameRequest(){
  $('button.load-game').on('click', function(){
    alert("button pressed")  
    $.ajax({
    method: 'GET',
    url: `/games/${____}`
    }).success(loadGameState)
  })
}
// OO Solutions

// function showGames(data){
//   data.data.forEach(function(game){
//     let newGame = new Game(game.id, game.attributes.state);
//     let gameString = `<button class="load-game" data-id="${newGame.id}">Game ${newGame.id}</button><br>`
//     $('#games').append(gameString)
//     $('button.load-game').on('click', loadGameState)
//   })
// }
// function loadGameState(data){
//   // debugger
//   let game = Game.Finder(this.dataset.id)
//   game.state.forEach(function(value, index){
//     $('td')[index].innerText = value
//   })
// }



// GamePlay Function

function setMessage(messageString){
  $("div#message").append(messageString)
}

function doTurn(element){
  updateState(element);
  turn++ 
  if (checkWinner() ){
    resetBoard();
  } else if ( turn === 9 ) {
    setMessage("Tie game.");
    resetBoard();
  } 
}

function checkWinner(){
  let board = boardState();
  const WINCOMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]  
  let result = false;
  WINCOMBINATIONS.some(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      result = true
    }
  });
  return result;
} 

function boardState(){
  let board = [];
  $('td').text((index, text) => board[index] = text);
  return board;
}

function resetBoard(){
  $('td').empty()
  turn = 0
  gameId = 0
}

function updateState(element){
  const token = player()
  $(element).text(token)  
}


 