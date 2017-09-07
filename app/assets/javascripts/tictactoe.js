// Code your JavaScript / jQuery solution
// Game only saved when... saved. Or ended.
// Otherwise, it takes place entirely on the front-end
const WIN_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;

function player(){
  if(turn % 2 === 0){return "X"}
  else{return "O"}
}

function updateState(square){
  $(square).text(player());
}

function doTurn(square){
  if($(square).text() === ""){
    updateState(square);
  }
  checkWinner();
  turn++;
}

function checkWinner() {
  board = {};
  $('td').text((index,square) => board[index] = square);
  
}

function message(string) {
  $('#message').text(string);
}

function attachListeners(){
  $("td").on('click', function(){
    doTurn(this);
  });
}

$(function(){
  attachListeners();
});
