var turn = 0;
var winningCombos = [
                      [[0,0],[1,0],[2,0]], 
                      [[0,1],[1,1],[2,1]], 
                      [[0,2],[1,2],[2,2]], 
                      [[0,0],[1,1],[2,2]], 
                      [[0,0],[0,1],[0,2]], 
                      [[2,0],[2,1],[2,2]], 
                      [[1,0],[1,1],[1,2]], 
                      [[2,0],[1,1],[0,2]]
                    ]
var currentGame;
$(document).ready(function(){
  attachListeners();
});

function attachListeners(){
  $('td').on("click",function(event){
    doTurn(event);
  });
}

function doTurn(event){
  updateState(event);
  turn++;
  checkWinner();
}

function checkWinner(){
  winningCombos.forEach(function(combo){
    cell_1 = $('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text();
    cell_2 = $('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text();
    cell_3 = $('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text();
    if(cell_1 === cell_2 && cell_1 === cell_3 && (cell_1 === 'X' || cell_1 === 'O')){
      message("Player " + cell_1 + " Won!");
      resetBoard();
    }
  });
  
  if (turn === 9){
    message("Tie game");
    resetBoard();
  }
  else{
    return false;
  }
}

function updateState(event){
  $(event["currentTarget"]).html(player());
}

function player(){
  if(turn % 2 === 0){
    return "X";
  }
  else{
    return "O";
  }
}

function message(string){
  $('#message').text(string);
}

function resetBoard(){
  turn = 0;
  $('td').each(function(cell){
    $(this).text("");
  });
}