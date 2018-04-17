// OO Classes

// function createGame(){
//   let allGames = []
//   return class Game{
//     constructor(id, state){
//       this.id = parseInt(id)
//       this.state = state
//       Game.AddGame(this)
//     }
//     static AddGame(game){
//       allGames.push(game)
//     }
//     static All(){
//       return allGames
//     }
//     static Finder(id){
//       return Game.All().find(function(element){
//         return element.id == id
//       })
//     }
//   }
// }

// const Game = createGame()

window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}

var turn = 0
var currentGame = 0
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
  if (currentGame){
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: {state: state},
      success: (data)=>console.log("Game Saved")
    });
  } else {
    $.ajax({
      url: '/games',
      method: 'POST',
      data: {state: state}
  }).done(function(data){
        currentGame = parseInt(data.data.id)
        gameButton(data.data);
    })
  } 
}

function previousGames(){
  $('#games').empty()
  $.ajax({
    url: "/games", 
    method: "GET"
  }).done(function(data){
    if (data.data.length){
      data.data.forEach(gameButton)
    }
  })
}

function gameButton(game){
  debugger
  $('#games').append(`<button class="load-game" id="game-${game.id}">Game ${game.id}</button><br>`)
  $(`#game-${game.id}`).on('click', () => loadGameState(game.id))
}

function loadGameState(gameId){  
// debugger 
  $('#message').empty()
  $.ajax({
    url: `/games/${gameId}`,
    method: 'GET'
  }).done(function(response){       
    response.data.attributes.state.forEach(function(value, index){
      $('td')[index].innerText = value;
    });
    setTurn()
    currentGame = parseInt(response.data.id);
  });
}

function setTurn(){
  let taken = Array.from($('td')).filter((element)=> element.innerText !== "")
  turn = taken.length

}

// GamePlay Function

function setMessage(messageString){
  $("div#message").append(messageString)
}

function doTurn(element){
  updateState(element);
  turn++ 
  if (checkWinner() ){
    saveGame();
    resetBoard();
  } else if ( turn === 9 ) {
    saveGame()
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
  currentGame = 0
  turn = 0
}

function updateState(element){
  const token = player()
  $(element).text(token)  
}

// function boardFull(){
//   if (Array.from($('td')).every((element)=> element.innerText !== "")){
//     setMessage("Tie game.");
//   }
// }
 
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
