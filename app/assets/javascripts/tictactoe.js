// Code your JavaScript / jQuery solution here

//NOTE: attachListeners() must be invoked inside either a $(document).ready() (jQuery) or a window.onload = () => {} (vanilla JavaScript). Otherwise, a number of the tests will fail (not to mention that your game probably won't function in the browser).
$(document).ready(function() {
    attachListeners()
}) 

var winning_combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0
var board = {}

function player() {  
    //Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
    //return turn % 2 === 0 ? 'O' : 'X';
    return turn % 2 === 0 ? 'X' : 'O';
}

function updateState(td) {
    //Gameplay Users cannot place a token in a square that is already taken:
        //Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
    var token = player()
    $(td).text(token)
}

function setMessage(winner) {
    $("#message").text(winner);
}

function checkWinner() {
    // var board = {}
    var winner = false

    //Returns true if the current board contains any winning combinations

    //checks each square in the game board for its value
    $("td").text(function(board_position, token) {

        // sets token to 
        board[board_position] = token
    })   

    //iterates over winning_combinations for each board[element[index position]]
    winning_combinations.some((element)=>{
        
        // checks board index position [0, 1, 2] for each square in the winning combination that is not empty ("") and has the same token ("X" or "O")
        if (board[element[0]] !== "" && board[element[0]] === board[element[1]] && board[element[0]] === board[element[2]]) {
            setMessage(`Player ${board[element[0]]} Won!`);
            winner = true
        }
    })

    //Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). 
    //double bang would make a truthy value into the Boolean 'true,' and the same for falsey to 'false
    return !!winner
} 

function resetBoard() {
    $('td').empty();
    turn = 0
    currentGame = 0
}

function doTurn(td) {
    //Invokes the updateState() function, passing it the element that was clicked
    updateState(td)

    //Increments the turn variable by 1.
    turn++;

    //Invokes checkWinner() to determine whether the move results in a winning play.
    if (checkWinner() === true) {
        saveGame()
        resetBoard()
    }

    //doTurn() invokes the setMessage() function with the argument "Tie game." when the game is tied:
    else if (turn === 9) {
        setMessage('Tie game.');
        saveGame()
        resetBoard()
    }
}

function attachListeners() {
    //Attaches the appropriate event listeners to the squares of the game board as well as for the button#save, button#previous, and button#clear elements.
    $("td").on("click", function(event) {
        if (!$.text(this) && !checkWinner()) {
            //When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
            doTurn(this)
        }
    })

    //Attaches the appropriate event listeners to the button#save, button#previous, and button#clear elements.
    //When you name your save and previous functions, make sure to call them something like saveGame() and previousGames(). If you call them save() and previous() you may run into problems with the test suite.
    $("#save").on("click", function() {
        $
        saveGame()
    })
    $("#previous").on("click", function() {
        previousGames()
    })
    $("#clear").on("click", function() {
        clearGame()
    })
}

var currentGame = 0

function saveGame() {
    var stateData = []
    var gameData;
    //checks each square in the game board for its value
    $("td").text(function(board_position, token) {

        // sets token to 
        board[board_position] = token
        stateData.push(token)
    }) 
    gameData = {state: stateData}
console.log(gameData)
console.log(stateData)
    if (currentGame) {
        $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
          
            url : `/games/${currentGame}`,
            type : 'PATCH',
            data : gameData //{state: stateData}
         })

    } else {
        // post request
        $.post('/games', gameData, function(game) {
            currentGame = game.data.id
            $('#games').append(`<button id="gameid-${game.data.id}">Game ${game.data.id}</button><br>`); 
            $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
        })        
    } 
}

function previousGames() {
    //clears all game buttons
    $("#games").empty()

    //"adds those previous games as buttons in the DOM's div#games element"
    $.get( "/games", function(games) {
        //if (games.data) {
            games.data.forEach (game=> {
            // //creating button HTML as a string
             var button = `<button id="currentGame-${game.id}">Game ${game.id}</button><br>`; 
             $("#games").append(button)
            $(`#currentGame-${game.id}`).on("click", function () {
                reloadGame(game.id)
            })
        });
    })
} 

function clearGame() {
    $('td').empty();
    turn = 0
    currentGame = 0
}

function reloadGame(gameId) {
    $.get(`/games/${gameId}`, function(game) {
        var id = game.data.id
        var state = game.data.attributes.state
        var counter = 0

        // Two for loops for Matrix
        // Outter loop y0, y1, y2 Vertical Rows Increments y by  1 < 3
        for (var y=0; y < 3; y++) {
             // Inner loop x0, x1. x2 Horizontal Rows Increments x by 1 < 3
            for (var x= 0; x < 3; x++) {
                document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[counter] 
                counter++ 
            }
        }
        //Set currentGame to the id of the game button selected
        currentGame = id
        //Set turn to the number of tokens on the board 
        turn = state.join("").length
    });
}