var turn = 0;
var win_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

var board = [];

function attachListeners(){
    $("td").click(function(event){
        doTurn(event);
    });
    
    $("#save").click(function(){
        getBoard();
    });
}

function doTurn(event){
    turn++;
    updateState(event);
    checkWinner();
}

function player(){
    if (turn % 2 === 0){
        return 'X';
    } else {
        return 'O';
    }
}

function updateState(event){
    $(event.target).text(player());
}

function getBoard(){
    board = [];
    $.each($("td"), function(index, cell){
        board.push(cell); //NOT RETURNING CORRECT VALUE
    });
    alert(board);
}

function checkWinner(){
    for(var i = 0; i > win_combos.length; i++){
        //if indexes on board for each value in combo == X || Y, 
    }
}


$(document).ready(function(){
    attachListeners();
});