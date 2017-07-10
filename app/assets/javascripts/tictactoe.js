// Code your JavaScript / jQuery solution here
$(function() {
  $(".js-more").on("click", function() {

  });

});

turn = 0;
function player() {
    return (turn % 2 === 0) ? "X" : "O"
}

function updateState(td){
    td.innerHTML = player() 
}

// function message(string) {
window.message = function(string) {
    $("#message").text(string)
}

function currentBoard() {
    return $("td").map((i, td) => td.innerHTML)
}

function checkWinner(){
    var board = currentBoard();

 const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]    ]

    return ['X', 'O'].some(function(p) {
        if (win.some(function(win_array) {
            return win_array.every(i => board[i] == p)
        })) {
                message(`Player ${p} Won!`);
                return true;
            }
        return false;
    })
}

function doTurn(td){
    updateState(td)
    turn += 1

    if (checkWinner() === false){ 
         
        if (turn === 9){
           
            message('Tie game.')
        }        
    }
    else {
      
        $("td").text("")
        turn = 0
    }

  
}