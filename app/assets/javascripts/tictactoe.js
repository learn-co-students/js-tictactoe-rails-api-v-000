// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

let turn = 0;

function player(){
  return turn % 2 ? "X" : "O";
}

function updateState(tile){
  tile.append(player())
}

function setMessage(token){
  $("#message").append(`Player ${token} Won!`)
}

function checkWinner(){
  currentState = []
  
  $( "td" ).each(function( index ) {
    currentState[index] = $( this ).text();
  });
  return !!WIN_COMBINATIONS.find(function(combo){
    return currentState[combo[0]] === currentState[combo[1]] &&
            currentState[combo[1]] === currentState[combo[2]] &&
            currentState[combo[0]+1] !== ""  
  });
}

function doTurn(tile){
  turn++;
  updateState(tile);
  if (checkWinner()){
    clearBoard();
    setMessage(player());
  }
}

function saveGame(){
  
}

function previousGame(){
  
}

function clearBoard(){
  $("td").each(function (){
    this.innerHTML = ""
  })
}

function attachListeners(){
  $("#board").click(function (e) {
    doTurn(e.target);
  });
  $("button#save").click(function(e){
      saveGame();
      e.preventDefault();
  });
  $("button#previous").click(function(e){
      previousGame();
      e.preventDefault();
  });
  $("button#clear").click(function(e){
      clearBoard();
      e.preventDefault();
  });
}

$(function() {
  attachListeners();
}); 