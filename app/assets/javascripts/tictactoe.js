var turn = 1;

function attachListeners(){
  $('td').click(function(){
    var x = $(this).data("x");
    var y = $(this).data("y");

    doTurn(x, y);







  });
}

function doTurn(x, y){
  turn++;

  updateState();
  checkWinner();

  console.log('clicked ' + x + y);
  console.log('It is now turn 'turn);
}

function updateState(){

}

function checkWinner(){

}

function message(){

}

$(document).ready(function(){
  attachListeners();
});
