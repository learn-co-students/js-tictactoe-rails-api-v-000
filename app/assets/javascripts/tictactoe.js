// Code your JavaScript / jQuery solution here
window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}
var turn = 0

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

function checkWinner(){
  const winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  for (let combo of winCombinations){
    if ( testToken()(combo) ){ 
      setMessage(`Player ${ player() } Won!`)
    } 
  }
} 

function testToken(){
  return function(combo){
    return combo.every((index)=> board()[index] === player())
  } 
} 

function doTurn(element){
  // debugger
  updateState(element)
  checkWinner()
  turn += 1;
}

function board(){
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



// function testToken(token){
//   return function(combo){
//     return combo.every((index)=> board()[index] === token)
//   } 
// }

// class Game {
//   constructor(id, state){
//     this.id = id;
//     this.state = state;
//   }
// }
