// Code your JavaScript / jQuery solution here
// $("td[data-x='1'][data-y='0'")
// $( "td:contains('x')" )
let turnCount = 0

function isEven(n) {
   return n % 2 == 0;
}

function player(){
  return isEven(turnCount) ? 'X' : 'O'
}

function updateState(element){
  $(element).html(player())
  turnCount += 1
}
