function attachListeners() {  
    $("td").on('click', function(e) {    
        doTurn(e.target) 
    })
    
    var clear = $("#clear") 
    clear.on('click', function() { 
        reset(board) 
    })
    
    var save = $("#save") 
    save.on('click', function(){ 
       let state = []
        for (let i = 0; i < $("td").length; i++) { 
            debugger; 
            state.push($("td")[i].innerHTML)
        }
        debugger; 
      $.post("/games", {state: state}) 
    })
     
     
    var previous = $("#previous");
    previous.on('click', function() {  
         $.get("/games", function(response) { 
             var games = response["data"];
             for(i=0; i<games.length; i++) { 
                $("#games").append('<button class="saved">' + games[i]["id"] + '</button>' + '<br>');
             }
         })
    })  
    
    $("#games").on('click', $(".saved"), function(e) { 
        $.get("/games/" + e.target.innerHTML, function(response) { 
          var currentState =  response["data"]["attributes"]["state"]
            for (let i = 0; i < board.length; i++) { 
                debugger;
                board[i].innerHTML = currentState[i]
            }
        }) 
            
    })
     
}

$(document).ready(function(){  
    attachListeners() 
})

var board = document.getElementsByTagName('td'); 

let turn = 0;

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
        
        if (board[winCombinations[i][0]].innerHTML === board[winCombinations[i][1]].innerHTML &&
        board[winCombinations[i][1]].innerHTML === board[winCombinations[i][2]].innerHTML &&
        board[winCombinations[i][2]].innerHTML !== "") { 
            setMessage("Player " + board[winCombinations[i][0]].innerHTML + " Won!");
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