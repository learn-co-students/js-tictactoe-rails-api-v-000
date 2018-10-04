// Code your JavaScript / jQuery solution here
let turn = 0;

const winningCombinations = [
    [[0, 0], [1, 0], [2, 0]], // across top
    [[0, 1], [1, 1], [2, 1]], // across middle
    [[0, 2], [1, 2], [2, 2]], // across bottom
    [[0, 0], [0, 1], [0, 2]], // down left
    [[1, 0], [1, 1], [1, 2]], // down middle
    [[2, 0], [2, 1], [2, 2]], // down right
    [[0, 0], [1, 1], [2, 2]], // top left to bottom right diagonal
    [[0, 2], [1, 1], [2, 0]]  // bottom left to top right diagonal
];

function checkWinner(){

}

function doTurn(clickedSquare){
    turn += 1;

    updateState(clickedSquare);

    checkWinner();
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