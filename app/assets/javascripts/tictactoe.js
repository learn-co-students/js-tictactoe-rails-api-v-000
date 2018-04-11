// Code your JavaScript / jQuery solution here
window.onload = function(){
  console.log("The window has loaded")
  attachListeners() 
}
let turn = 0

function buttonEvents(){
  $("body").on("click", "button", function(){
    // THIS IS A VULNERABILITY
    window[`${this.id}`]()
  })
}

function squareEvents(){
  $("tbody").on("click", "td", doTurn)
}
  // const buttons = document.querySelectorAll("button")
  // buttons.forEach((button)=> {
  //   button.addEventListener('click', function(e){
  //     window[`${this.id}`]()      
  //   });
  // });




function save(){
  console.log("SAVE")
  let gameStatus = 
  $.post("/games/", {
    method: 'PUT',
    body: boardStatus()
  })
}

function previous(){
  console.log("PREVIOUS")
  // get All games and display on DOM
  $.get("/games", function(data){
  })
}

function clear(){
  // start new game
  console.log("CLEAR")
  $.post("/games", { state: ["","","","","","","","",""] })
    .done(function(data){
      console.log(data);
  })
}



function player(){
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(square){
  let token = player(turn)
  debugger
}

function setMessage(string){

}

function checkWinner(){
  console.log("ne winners yet")
}

function boardStatus(){
let state = []
let boardArray = Array.from($("tbody").children("tr").children("td"))
boardArray.forEach(function(square){
  state.push(square.innerText) 
});
return state
}

function doTurn(){
  // this = td
  updateState(this)
  return turn += 1;
}

function attachListeners(){
  buttonEvents()
  squareEvents()
}

class Game {
  constructor(id, state){
    this.id = id;
    this.state = state;
  }
}
