var board = document.getElementsByTagName('td') 

var turn = 0;

var winCombinations = [ 
    [board[0], board[1], board[2]], 
    [board[3], board[4], board[5]],
    [board[6], board[7], board[8]],
    [board[0], board[3], board[6]],
    [board[1], board[4], board[7]],
    [board[2], board[5], board[8]],
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]]
]

function player(turn) { 
    if (turn % 2 === 0) { 
        return "X" 
    } else { 
        return "O" 
    } 
}

function updateState(el) {  
    el.append(player(turn)) 
} 

function setMessage(string) {  
    document.getElementById("message").append(string) 
} 


function checkWinner() { 
    for (let i= 0; i < winCombinations.length; i++) { 
        if (winCombinations[i][0].innerHTML === winCombinations[i][1].innerHTML && winCombinations[i][1].innerHTML === winCombinations[i][2].innerHTML && winCombinations[i][2].innerHTML !== "") { 
            // debugger;
            setMessage("Player " + winCombinations[i][0].innerHTML + " Won!");
            return true;
        }
    } 
    return false; 
} 

function isTaken(space) { 
    space.innerHTML !== "" 
}
    

function doTurn(el) { 
    if (!checkWinner() && el.innerHTML === ""){
        updateState(el) 
        turn ++ 
    } else if (checkWinner()) {
        turn = 0 
    } else if (board.every(isTaken())) {
        turn = 0 
        setMessage("Tie game.")
    }
}