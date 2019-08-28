// Code your JavaScript / jQuery solution here

//NOTE: attachListeners() must be invoked inside either a $(document).ready() (jQuery) or a window.onload = () => {} (vanilla JavaScript). Otherwise, a number of the tests will fail (not to mention that your game probably won't function in the browser).
$(document).ready(function() {
    attachListeners()
}) 

var board = {}

var winning_combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0

function player() {  
    //Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
    return turn % 2 === 0 ? 'X' : 'O';
    //return turn % 2 ? 'X' : 'O';
}

function updateState(td) {
    //Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.

    //CHECK SQUARE 
    if ($(td).text[board.to_i-1] != "")

    $(td).text(player())
}

function setMessage(winner) {
    $("#message").text(winner);
}

function checkWinner() {
    //var board = {}

    //Returns true if the current board contains any winning combinations

    //checks each square in the game board for its value
    $("td").text(function(board_position, token) {

        // sets token to 
        board[board_position] = token
    })   
    
    var winner = false

    //iterates over winning_combinations for each board[element[index position]]
    winning_combinations.forEach ((element)=>{
        
        // checks board index position [0, 1, 2] for each square in the winning combination that is not empty ("") and has the same token ("X" or "O")
        if (board[element[0]] !== "" && board[element[0]] === board[element[1]] && board[element[0]] === board[element[2]]) {
            winner = true
                setMessage(`Player ${board[element[0]]} Won!`);
                resetBoard()
        }
    })

    //Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). 
    //double bang would make a truthy value into the Boolean 'true,' and the same for falsey to 'false
    return !!winner
} 

function resetBoard() {
    $('td').empty();
    turn = -1
}

//Gameplay Users cannot place a token in a square that is already taken:
function squareTaken() {
    var taken = $(document.querySelectorAll('td')).text()
    console.log(taken)
    // document.querySelectorAll('td')
    // board_position = board[0][1][2][3][4][5][6][7][8]
    // $("td").text(function(board_position, token) {

        // sets token to 
        //if board[0]
        //if ($(td).text[board.to_i-1] != "")
        //if (board[board_position] = token)
        return "Users cannot place a token in a square that is already taken"
    //})   
}
// function squareTaken(i) {
//     debugger
//     //if ($(td).text(player()))
//     if (board[board_position[i]].innerHTML === "X" || "O") {
//         return "Users cannot place a token in a square that is already taken"
//         }
// }

function doTurn(td) {
    //Invokes the updateState() function, passing it the element that was clicked
    updateState(td)

    //Invokes checkWinner() to determine whether the move results in a winning play.
    var winner = checkWinner()

    //doTurn() invokes the setMessage() function with the argument "Tie game." when the game is tied:
    if (turn == 8 && !winner) {
        setMessage('Tie game.');
    }

    //Increments the turn variable by 1.
    turn++;
}

function attachListeners() {
    //Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
    $("td").on("click", function(event) {
        console.log(this) 

    //When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
        doTurn(this)
    })

    //When you name your save and previous functions, make sure to call them something like saveGame() and previousGames(). If you call them save() and previous() you may run into problems with the test suite.
}
