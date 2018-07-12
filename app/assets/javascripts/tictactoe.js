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

  $("td").each(function(){
    console.log($(this).html())
  });

  // if (top-horizontal && middle-horizontal && bottom-horizontal){
  //   return true
  // }else {
  //   return false
  // }
  // $("td:eq(4)").html()
  // $("table tr td").eq(0).html()
  // $("table tr td").eq(1).html()
  // $("table tr td").eq(2).html()
}
function doTurn(){

}
function attachListeners(){

}
