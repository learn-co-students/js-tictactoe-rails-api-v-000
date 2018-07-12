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

    // Horizontal Next
  if($("td:eq(0)").html() === $("td:eq(1)").html() && $("td:eq(1)").html() === $("td:eq(2)").html() && $("td:eq(2)").html() != ""){
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(3)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(5)").html() && $("td:eq(5)").html() != "") {
    setMessage("Player " + $("td:eq(3)").html() + " Won!")
    return true
  }else if ($("td:eq(6)").html() === $("td:eq(7)").html() && $("td:eq(7)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(6)").html() + " Won!")
    return true
    // Diagonal Next
  }else if ($("td:eq(0)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(6)").html() && $("td:eq(6)").html() != "") {
    setMessage("Player " + $("td:eq(2)").html() + " Won!")
    return true
    // Vertical Next
  }else if ($("td:eq(0)").html() === $("td:eq(3)").html() && $("td:eq(3)").html() === $("td:eq(6)").html() && $("td:eq(6)").html() != "") {
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(1)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(7)").html() && $("td:eq(7)").html() != "") {
    setMessage("Player " + $("td:eq(1)").html() + " Won!")
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(5)").html() && $("td:eq(5)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(2)").html() + " Won!")
    return true
  }else {
    return false
  }
}
function doTurn(){
  turn++
  updateState()
  if(turn === 9){
    $("td").empty()
    setMessage("Tie game.")
    turn = 0
  }else if(checkWinner()){
    $("td").empty()
    turn = 0
  }
}
function attachListeners(){

}
