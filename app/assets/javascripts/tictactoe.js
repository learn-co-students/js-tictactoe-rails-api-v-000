// Code your JavaScript / jQuery solution here
function handleBoardSquareClick(event){
    event.preventDefault();

    console.log("handleBoardSquareClick called!");
    console.log("x: " + this.dataset["x"] + ", y: " + this.dataset["y"]);
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