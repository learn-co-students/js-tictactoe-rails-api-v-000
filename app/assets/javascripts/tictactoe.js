// Code your JavaScript / jQuery solution here
let turn = 0;

let gameState = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

const winningCombinationIndices = [
    [0, 1, 2], // across top
    [3, 4, 5], // across middle
    [6, 7, 8], // across bottom
    [0, 3, 6], // down left
    [1, 4, 7], // down middle
    [2, 5, 8], // down right
    [0, 4, 8], // top left to bottom right diagonal
    [6, 4, 2]  // bottom left to top right diagonal
];

function checkWinner(){
//    if (turn < 6){
  //      return false;
    //}

    let currentCombinations = ["", "", "", "", "", "", "", ""];
    let winner = "";

    for (let i = 0; i < winningCombinationIndices.length; i++){
        for (index of winningCombinationIndices[i]){
            currentCombinations[i] += gameState[index];
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
        setMessage(`Player ${winner} won!`);
    }
}

function doTurn(clickedSquare){
    turn += 1;

    updateState(clickedSquare);

    checkWinner();
}

function setMessage(message){
    console.log(message);
}

function updateState(clickedSquare){

}

// LISTENERS
function handleBoardSquareClick(event){
    event.preventDefault();

    console.log("handleBoardSquareClick called!");
    console.log("x: " + this.dataset["x"] + ", y: " + this.dataset["y"]);

    doTurn(this);
}

function loadPreviousGames(event){
    event.preventDefault();

    console.log("loadPreviousGames called!");
}

function saveNewGame(event){
    event.preventDefault();

    console.log("saveNewGame called!");
}

function startNewGame(event){
    event.preventDefault();

    console.log("startNewGame called!");
}
// /LISTENERS

function attachListeners(){
    console.log("START attaching listeners");

    $('#save').on('click', saveNewGame);
    console.log('   saveNewGame attached to Save button click event');

    $('#previous').on('click', loadPreviousGames);
    console.log('   loadPreviousGames attached to Show Previous Games button click event');

    $('#clear').on('click', startNewGame);
    console.log('   startNewGame attached to Clear Current Game button click event');

    $('td').on('click', handleBoardSquareClick);
    console.log('   handleBoardSquareClick attached to each td board cell element in the game board table element');

    console.log("DONE attaching listeners");
}

$(document).ready(function(){
    attachListeners();
});