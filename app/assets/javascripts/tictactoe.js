function player() {
  console.log("Returns the token of the player whose turn it is, X when the turn variable is even and O when it is odd.")
}

function updateState() {
    console.log("Invokes player() and adds the returned string (X or O) to the clicked square on the game board.")
}

function message() {
    console.log("Accepts a string and adds it to the div#message element in the DOM.")
}

function checkWinner() {
    console.log("Returns true if the current board contains any winning combinations three X or O tokens in a row, vertically, horizontally, or diagonally. Otherwise, returns false. If there is a winning combination on the board, checkWinner should invoke message, passing in the appropriate string based on who won: Player X Won! or Player O Won!")
}

function doTurn() {
  console.log("Increments the turn variable by 1. Invokes the updateState() function, passing it the element that was clicked. Invokes checkWinner() to determine whether the move results in a winning play.")

function attachListeners() {
  console.log("Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.  When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.")
