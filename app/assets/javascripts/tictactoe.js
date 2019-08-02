function player(){
    var currentPlayer = "O"
    if (window.turn % 2 === 0 ) {
      currentPlayer = "X";   
    } 

    return currentPlayer;
}

function updateState(square){
    square.innerHTML = player(); 
}

function setMessage(message){
    var messageDiv = window.document.getElementById('message');

    messageDiv.innerHTML = message;
}

function checkWinner(){
    var winner = false; 
    var squares = window.document.querySelectorAll('td');
    var winningToken; 
    var winCombinations = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]
    ]

    winCombinations.forEach(function(winArray) {
        if (squares[winArray[0]] === "X" || squares[winArray[0]] === "O") {
            if (squares[winArray[0]] === squares[winArray[1]] && squares[winArray[1]] === squares[winArray[2]]) {
                winningToken = squares[winArray[0]]; 
                winner = true;
                setMessage("You're a winner!")
            }
        }
    });


    return winner; 
}


// addEventListener(){
    $( document ).ready(function() {
    $('td').click(function() {
     
    });
});
// }