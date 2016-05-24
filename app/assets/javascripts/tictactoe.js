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
        //save 
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
        board.push($(this).text()); //adds value of cell to board array
    });
}

function checkWinner(){
    for(var i = 0; i < win_combos.length; i++){
        //if all three indexes of win_combo are X, return win message
        //else if all three indexes of win combo are O, return win message
        //else if board is full, return tie message
        
        getBoard();
        if (board[win_combos[i][0]] == 'X' && board[win_combos[i][1]] == 'X' && board[win_combos[i][2]] == 'X'){
            alert('Player X won!'); //updated to message()
        } else if (board[win_combos[i][0]] == 'O' && board[win_combos[i][1]] == 'O' && board[win_combos[i][2]] == 'O'){
            alert'Player O won!'); //update to message()
        } 
    }
}


$(document).ready(function(){
    attachListeners();
});