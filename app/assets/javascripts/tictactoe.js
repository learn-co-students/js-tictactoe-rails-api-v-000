// Code your JavaScript / jQuery solution here
var turn = 0;
function player(){
  return turn % 2 === 0 ? "X" : "O"
}
function updateState(element){
  $(element).text(player())
}
function setMessage(string){
  $("div#message").html(string)
}
function checkWinner(){

  if($("td:eq(0)").html() === $("td:eq(1)").html() && $("td:eq(1)").html() === $("td:eq(2)").html()){
    return true
  }else if ($("td:eq(3)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(5)").html()) {
    return true
  }else if ($("td:eq(6)").html() === $("td:eq(7)").html() && $("td:eq(7)").html() === $("td:eq(8)").html()) {
    return true
    // Diagonal Next
  }else if ($("td:eq(0)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(8)").html()) {
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(6)").html()) {
    return true
    // Vertical Next
  }else if ($("td:eq(0)").html() === $("td:eq(3)").html() && $("td:eq(3)").html() === $("td:eq(6)").html()) {
    return true
  }else if ($("td:eq(1)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(7)").html()) {
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(5)").html() && $("td:eq(5)").html() === $("td:eq(8)").html()) {
    return true
  }else {
    return false
  }

}
function doTurn(){

}
function attachListeners(){

}
