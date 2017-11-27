var turn = 0;

$(function(){
    
    
    
});

var player = () => { return turn % 2 === 0 ? "X" : "O";}

var updateState = (square) => {
    var character = player();
    $(square).text(character);
}

var setMessage = (character) => {
    $("div#message").text(`Player ${character} Won!`);
}

var checkWinner = () => {

    // Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
    // If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
}

