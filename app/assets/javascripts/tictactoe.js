window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}

let turn = 0

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
  $("#clear").on("click", ()=> clearGame())     
}

// Button Functions

function saveGame(){
  console.log("SAVE")
  let gameStatus = 
  $.post("/games", {
    method: 'PATCH',
    body: boardStatus()
  })
}

function previousGames(){
  console.log("PREVIOUS")
  $.get("/games", function(data){
    debugger
  })
}

function clearGame(){
  // start new game
  console.log("CLEAR")
  $.post("/games", { state: ["","","","","","","","",""] })
    .done(function(data){
      console.log(data);
  })
}


// GamePlay Function

function checkWinner(){
  let board = boardStatus();
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

function updateState(element){
  const token = player()
  $(element).text(token)  
}

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
  
function resetBoard(){
  $('td').empty()
  turn = 0;
}

function boardStatus(){
  let board = {};
  $('td').text((index, text) => board[index] = text);
  return board;
}


function createGame(){
  let allGames = []
  let id = 0
  return class Game{
    constructor(state){
      this.id = ++id
      this.state = state
      debugger
      Game.addGame(this)
    }
    static addGame(game){
      allGames.push(game)
    }
    static All(){
      debugger
      return allGames
    }
  }
}

const Game = createGame()

 