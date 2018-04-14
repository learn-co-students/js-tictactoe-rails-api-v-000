// Code your JavaScript / jQuery solution here
window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}
var turn = 0
const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]  
// EventListeners

function attachListeners(){
  $("td").on("click", function(){
    // debugger
    doTurn(this)
  })
  $("body").on("click", "button", function(){
  
  // THIS IS A VULNERABILITY
    window[`${this.id}`]()
  })
}


// Button Functions

function saveGame(){
  console.log("SAVE")
  let gameStatus = 
  $.post("/games/", {
    method: 'PUT',
    body: boardStatus()
  })
}

function previousGames(){
  console.log("PREVIOUS")
  // get All games and display on DOM
  $.get("/games", function(data){
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

function player(){
  return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(thisSquare){
  return thisSquare.innerHTML = player()
}

function setMessage(winnerString){
  $("div#message").append(winnerString)
}

// function checkWinner(){
//   const board = boardStatus()
//   const WINCOMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]  
//   let result = false;
//   WINCOMBINATIONS.some(function(combo){
//     if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
//       setMessage(`Player ${board[combo[0]]} Won!`);
//       return result = true
//     }
//   });
//   return result;
// }    
  
// function returnWinner(){
// const WINCOMBINATIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]  
// return WINCOMBINATIONS.some(function(combo){
//   return board()[combo[0]] !== "" && board()[combo[0]] === board()[combo[1]] && board()[combo[1]] === board()[combo[2]]
//        // if (board()[element] === token){
//       // return board()[element] === board()[element+1] && board()[index+1] === board()[element+2]
//   });
// }

// function testToken(combo){
//   return combo.every((element)=> board()[element] === player())
// }
function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(element){
  updateState(element)
  checkWinner()
  turn += 1;
  
}

function boardStatus(){
  let state = []
  $("td").toArray().forEach(function(square){
    state.push(square.innerText) 
  });
  return state
}

function boardFull(){
 return board().every(function(element){
    return element !== ""
  })
}

// class Game {
//   constructor(id, state){
//     this.id = id;
//     this.state = state;
//   }
// }
 