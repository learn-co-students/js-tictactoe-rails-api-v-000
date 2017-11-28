var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
[1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;



var player = () => { return turn % 2 === 0 ? "X" : "O";}

var updateState = (square) => {
    var character = player();
    $(square).text(character);
}

var setMessage = (message) => {
    $("div#message").text(message);
}
function checkWinner() {
    var board = {};
    var winner = false;
  
    $('td').text((index, square) => board[index] = square);
  
    WINNING_COMBOS.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
    });
  
    return winner;
}
function boardNotFull(){
    var board = [];
    $('td').text((index, square) => board[index] = square);
    return board.some(function(character){
        if(character === ""){
            return true;
        }
    });

}
function doTurn(square){
    turn++;
    var win = checkWinner();
    updateState(square);
    if (!win && !boardNotFull()){
        setMessage(`Tie game.`);
    } else if(win){
        turn = 0;
        $('td').empty();
        
    }
}

