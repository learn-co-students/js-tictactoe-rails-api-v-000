// Code your JavaScript / jQuery solution here
window.onload = function(){
  console.log("The window has loaded")
  buttonEvents()
  squareEvents()
  checkWinner()
}
  
function gameControl(){
  document.getElementsByTagName("button")
}

function buttonEvents(){
  $("body").on("click", "button", function(){
    window[`${this.id}`]()
  })
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
  fetch('/game/', {
    method: 'PUT',
    body: boardStatus()
  })
}

function previous(){
  console.log("PREVIOUS")
  // get All games and display on DOM
  $.get("/games", function(data){
    debugger
  })
}

function clear(){
  // start new game
  console.log("CLEAR")
 $.post("/games", function(data){
  debugger
 }
  )
}

function squareEvents(){
  $("tbody").on("click", "td", function(){
    console.log(this)
  });
}

function player(){}

function updateState(){
  player()
}

function setMessage(string){

}

function checkWinner(){
let state = []
let boardArray = Array.from($("tbody").children("tr").children("td"))
boardArray.forEach(function(square){
  state.push(square.innerText) 
});
}

function doTurn(){
  let turn = turn || 0;
  return turn += 1;
}

function attachListeners(){

}
