function attachListeners() {  
    var cells = $("td");
    cells.on('click', function(e) {   
        doTurn(e.target) 
    })
    
    var clear = $("#clear") 
    clear.on('click', function() { 
        reset(board) 
    })
    
    var save = $("#save") 
    save.on('click', function(){ 
       $.post("/games", cells) 
    })
     
     
    var previous = $("#previous");
    previous.on('click', function() {  
         $.get("/games", function(response) { 
             var games = response["data"]
             for(i=0; i<games.length; i++) { 
                $("#games").append('<button>' + games[i]["id"] + '</button>' + '<br>')
             }
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
        if (winCombinations[i][0].innerHTML === winCombinations[i][1].innerHTML &&
        winCombinations[i][1].innerHTML === winCombinations[i][2].innerHTML &&
        winCombinations[i][2].innerHTML !== "") { 
            setMessage("Player " + winCombinations[i][0].innerHTML + " Won!");
            return true;
        }
    } 
    return false; 
} 


function reset(board) { 
    for (let i=0; i<board.length; i++) { 
        board[i].innerHTML = "" 
        turn = 0;
    }
}
    

function doTurn(el) {  
    if (!checkWinner() && el.innerHTML === ""){
        updateState(el) 
        turn ++ 
    } else if (checkWinner()) { 
        reset(board);
    } else if (turn === 8) {
        reset(board);
        setMessage("Tie game.");
    }
}