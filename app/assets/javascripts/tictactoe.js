var turn = 0;
var square;



function player() {          
    return ((turn % 2) == 0) ? 'X' : 'O' 
}

function updateState(element) {
    const token = player();
    return element.innerHTML = token;
}

function setMessage(string) {
    document.getElementById("message").innerHTML = string;
}

function checkWinner() {
    const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];
    
    const board = document.querySelectorAll('td')

    const winningCombination = winCombinations.find((combo) => {
        return combo.every(i => board[i].innerHTML === 'X') || 
               combo.every(i => board[i].innerHTML === 'O') 
    });
    if(winningCombination) {
        const token = board[winningCombination[0]].innerHTML
        setMessage(`Player ${token} Won!`)
    }
    return winningCombination ? true : false 
}

function resetBoard() {
    document.querySelectorAll('td').forEach((square) => {
        square.innerHTML = "";
    });
}

function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
        resetBoard();
        turn = 0;
    } else if (turn === 9) {
        setMessage("Tie game.");
        resetBoard();
        turn = 0;
    }
}

function attachListeners() {
   const element = document.querySelectorAll("td")
   for (let i of element) {
    i.addEventListener("click", function() {
        if (i.innerHTML === "" && checkWinner() === false)  { 
            doTurn(this);
        }
       
    });
   }  
}


$(function() {
    attachListeners();
});
