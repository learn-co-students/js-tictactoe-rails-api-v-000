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

    function winFunction(winArray) {
        var firstPosition = squares[winArray[0]].innerHTML; 
        var secondPosition = squares[winArray[1]].innerHTML; 
        var thirdPosition = squares[winArray[2]].innerHTML; 
        
        if (firstPosition === "X" || firstPosition === "O") {
            if (firstPosition === secondPosition && secondPosition === thirdPosition) {
                winningToken = firstPosition; 
                winner = true;
                setMessage(`Player ${winningToken} Won!`)
            }
        }
    }
    
    winCombinations.forEach(winFunction); 

    return winner; 
}


// addEventListener(){
    $( document ).ready(function() {
    $('td').click(function() {
     
    });
});
// }