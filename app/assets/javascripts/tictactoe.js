function attachListeners() {  
    var cells = $("td")
    cells.on('click', function(e) { 
        debugger;
        doTurn(e.target) 
    })
    // var clear = document.getElementById("clear") 
    // clear.onclick = reset(board) 
    // var save = document.getElementById("save") 
    // // add logic to save a game 
    var previous = $("#previous");
    previous.on('click', function() {  
         $.get("/games", function(data) {  
            console.log(data) 
         })
    })  
    
}

$(document).ready(function(){  
    attachListeners() 
})

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

// function isTaken(element, index, array) { 
//   return element.innerHTML !== "" 
// }

function reset(board) { 
    for (let i=0; i<board.length; i++) { 
        board[i].innerHTML = ""
    }
}
    

function doTurn(el) {  
    if (!checkWinner() && el.innerHTML === ""){
        updateState(el) 
        turn ++ 
    } else if (checkWinner()) { 
        turn = 0;
        reset(board);
    } else if (turn === 8) {
        turn = 0;
        reset(board);
        setMessage("Tie game.");
    }
}