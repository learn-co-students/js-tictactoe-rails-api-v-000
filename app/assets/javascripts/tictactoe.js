// Code your JavaScript / jQuery solution here
var turn = 0;

function player(){
  //debugger;
  let remainder = turn % 2
  if (remainder === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(square){
  //lplayer();
  //debugger;
  square.innerHTML = player();
}
