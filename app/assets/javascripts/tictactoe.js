// import { uptime } from "os";

var turn = 0

var player = () => turn % 2 === 0 ? "X" : "O"  

    // if (turn % 2 === 0 ){
    //     return "X"
    // } else {
    //     return "O"
       

function updateState(square){

    var token = player();

    $(square).text(token);
    
    // function that always returns token for current player
  
    // var squareChosen = document.querySelector("td");

    // $("#td").attr("data-x", "data-y");

    // squareChosen.addEventListener('click', function(){
        
        // turn++;
}

function setMessage () {


}

function checkWinner () {


}


function doTurn () {



}

function attachListeners () {



}

function saveGame () {




}


function previousGames () {




}


function updateState(square) {
    var token = player();
    $(square).text(token);
  }
  
  // updateState()
// Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
// setMessage()
// Accepts a string and adds it to the div#message element in the DOM.
// checkWinner()
// Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
// If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
// doTurn()
// Increments the turn variable by 1.
// Invokes the updateState() function, passing it the element that was clicked.
// Invokes checkWinner() to determine whether the move results in a winning play.
// attachListeners()
// Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
// When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
// NOTE: attachListeners() must be invoked inside either a $(document).ready() (jQuery) or a window.onload = () => {} (vanilla JavaScript). Otherwise, a number of the tests will fail (not to mention that your game probably won't function in the browser).
// When you name your save and previous functions, make sure to call them something like saveGame() and previousGames(). If you call them save() and previous() you may run into problems with the test suite.