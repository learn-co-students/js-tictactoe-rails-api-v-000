// Code your JavaScript / jQuery solution here
let gameId;
let winningCombinationIndices;

let gameSquares;

function checkWinner(){
    let currentCombinations = ["", "", "", "", "", "", "", ""];
    let winner = "";

    for (let i = 0; i < winningCombinationIndices.length; i++){
        for (index of winningCombinationIndices[i]){
            currentCombinations[i] += gameSquares[index].innerHTML;
        }
    }

    for (currentCombo of currentCombinations){
        if ("XXX" === currentCombo){
            winner = "X";
            break;
        }
        else if ("OOO" === currentCombo){
            winner = "O";
            break;
        }
    }

    if ("" !== winner){
        setMessage("Player " + winner + " Won!");
        return true;
    }
    else if (8 === window.turn){
        setMessage("Tie game.");
        return true;
    }
    else {
        return false;
    }
}

function doTurn(clickedSquare){
    if (updateState(clickedSquare)){
        if (checkWinner()){
            resetBoard();
        }
        else {
            window.turn += 1;
        }
    }
}

function player(){
    return ((0 === (window.turn % 2)) ? 'X' : 'O');
}

function resetBoard(){
    for (square of gameSquares){
        square.innerHTML = "";
    }

    window.turn = 0;
}

function setMessage(message){
    $('#message').text(message);
}

function updateState(clickedSquare){
    const clickedSquareIndex = parseInt(clickedSquare.dataset["y"]) * 3 + parseInt(clickedSquare.dataset["x"]);

    // Square is taken! Invalid move
    if ("X" === clickedSquare.text || "O" === clickedSquare.text){
        return false;
    }

    $(clickedSquare).text(player());

    return true;
}

// CALLBACKS
function displayLoadedGame(json){
    gameId = json["data"]["id"];

    const state = json["data"]["attributes"]["state"];
    console.log(state);
    for (let i = 0; i < 9; i++){
        gameSquares[i].innerHTML = state[i];
    }
}

function displayPreviousGames(json){
    for(previousGame of json["data"]){
        const prevGameP = '<p data-game-id="' + previousGame["id"] + '">Game #' + previousGame["id"] + '</p>';
        $('#games').append(prevGameP);
    }
}

function handleBoardSquareClick(event){
    event.preventDefault();

    console.log("handleBoardSquareClick called!");
    console.log("x: " + this.dataset["x"] + ", y: " + this.dataset["y"]);

    doTurn(this);
}

function loadPreviousGame(event){
    event.preventDefault();

    $.get('/games/' + this.dataset["gameId"], displayLoadedGame);
}

function loadPreviousGames(event){
    event.preventDefault();

    $.get('/games/', displayPreviousGames);

    console.log("loadPreviousGames called!");
}

function saveGame(event){
    event.preventDefault();

    var path = "/games";
    var method = "POST";
    if (null !== gameId){
        path = "/games/" + gameId;
        method = "PATCH";
    }

    const gameState = [];
    for (square of gameSquares){
        gameState.push(square.innerHTML);
    }

    $.ajax({
        url: path,
        method: method,
        data: {
            state: gameState,
            id: gameId
        }
    }).
    done(function(response){
        gameId = response["data"]["id"];
    });

    console.log("saveGame called!");
}

function startNewGame(event){
    event.preventDefault();

    resetBoard();

    gameId = null;

    console.log("startNewGame called!");
}
// /CALLBACKS

function attachListeners(){
    console.log("START attaching listeners");

    $('#save').on('click', saveGame);
    console.log('   saveGame attached to Save button click event');

    $('#previous').on('click', loadPreviousGames);
    console.log('   loadPreviousGames attached to Show Previous Games button click event');

    $('#clear').on('click', startNewGame);
    console.log('   startNewGame attached to Clear Current Game button click event');

    $('td').on('click', handleBoardSquareClick);
    console.log('   handleBoardSquareClick attached to each td board cell element in the game board table element');

    $('#games').on('click', 'p', loadPreviousGame);
    console.log('   loadPreviousGame attached to any p elements in #games div');

    console.log("DONE attaching listeners");
}

window.onload = () => { 
    attachListeners(); 

    window.turn = 0;

    gameId = null;

    gameSquares = window.document.querySelectorAll('td');

    winningCombinationIndices = [
        [0, 1, 2], // across top
        [3, 4, 5], // across middle
        [6, 7, 8], // across bottom
        [0, 3, 6], // down left
        [1, 4, 7], // down middle
        [2, 5, 8], // down right
        [0, 4, 8], // top left to bottom right diagonal
        [6, 4, 2]  // bottom left to top right diagonal
    ];
}