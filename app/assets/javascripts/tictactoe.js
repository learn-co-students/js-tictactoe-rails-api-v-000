var turn = 0;

function attachListeners(){
  $('td').click(function(){
    var x = $(this).data("x");
    var y = $(this).data("y");

    doTurn(x, y);
  });
}

function doTurn(x, y){
  turn++;

  updateState(x, y);
  checkWinner();

  console.log('clicked ' + x + y);
  console.log('It is now turn ' + turn);
}

function updateState(x, y){
 $("td[data-x='" + x + "'][data-y='" + y + "']").text(player());
}

function checkWinner(){

}

function message(){

}

function player(){
  if(turn % 2 == 0){
    return 'O';
  } else {
    return 'X';
  }
}

$(document).ready(function(){
  attachListeners();
});
