var turn = 0;
var square;
var gameID = 0;



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
        setMessage(`Player ${token} Won!`);
    }
    return winningCombination ? true : false 
}

function resetBoard() {
    document.querySelectorAll('td').forEach((square) => {
        square.innerHTML = '';
    });
    turn = 0;
    gameID = 0;
}

function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
        turn = 0;
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
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

function createGameButton(game) {
    let id = game.id
    let gameButton = document.getElementById(id);
    if (gameButton == null) {
        $("#games").append(`<BUTTON id="${game.id}" game-data="${game.id}">${game.id}</BUTTON><br>`);
    }       
}

function getBoard() {
    let gameArray = [];
    const board = document.querySelectorAll('td')
    for (const square of board) {
        gameArray.push(square.innerHTML)
    }
   return gameArray;
}

function saveGame() {
    let board = getBoard();
    if (gameID === 0) {
        $.post("/games", { state: board}, function(response) {
            gameID = response.data.id;
        })
    } else {
        $.ajax({
            type: 'PATCH',
            url: `/games/${gameID}`, 
            data: { state: board}
        });
    }   
}

function loadGame(gameID) {
    $.get("/games/" + gameID, function(response) {
        let gameArray = response.data.attributes.state
    } ) 
}



$(function() {
    attachListeners();
    
    document.getElementById("save").addEventListener("click", function() {
          saveGame();
    })
    
    
    document.getElementById("previous").addEventListener("click", function() {
        $.get("/games", function(response) {
            if (response.data.length !== 0) {
                const games = response.data
                for (let game of games) {
                    createGameButton(game)
                }
            
            } 
        })
    })

    document.getElementById("clear").addEventListener("click", function() {
        resetBoard();
    })
    
})


