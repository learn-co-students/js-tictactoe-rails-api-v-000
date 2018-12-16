const winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0
var gameId = 0;
var state = [];

function player(){
    // returns the token of the player whose turn it is
    return (turn % 2 ? 'O' : 'X')
 }

function updateState(cell) {
    // invokes player() and adds the current player's token to the passed-in <td> element
    $(cell).text(player());
}

function setMessage(message) {
    // sets a provided string as the innerHTML of the div#message element
    $("#message").text(message);
}

function checkWinner() {
    let gameBoard = {};
    $('td').text( function(index, cell) {
        gameBoard[index] = cell;
    });
    // returns true if three in a row and returns false if no winning combination is present on the gameBoard
    return winCombos.some(function(winCombo) {
        if (gameBoard[winCombo[0]] !== "" && gameBoard[winCombo[0]] === gameBoard[winCombo[1]] && gameBoard[winCombo[1]] === gameBoard[winCombo[2]]) {
            // invokes setMessage() function with the argument "Player X Won!" when player X wins
            setMessage(`Player ${gameBoard[winCombo[0]]} Won!`);
            return true;
        }
    });
}

function doTurn(cell) {
    //  invokes the updateState() function
    updateState(cell);
    // increments the value of the "turn" variable
    turn ++;
    if (checkWinner()) {
        // Completing a game auto-saves won games
        saveGame();
        // resets the gameBoard and the "turn" counter when a game is won
        clearGame();
    } else if (turn === 9 && !checkWinner()) {
        // invokes the setMessage() function with the argument "Tie game." when the game is tied
        setMessage("Tie game.");
        // Completing a game auto-saves tie games
        saveGame();
        clearGame();
    }
}

$( document ).ready(function() {
    attachListeners();
});

function attachListeners() {
    // attaches event listeners that invoke doTurn() when a square is clicked on
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            // passes the clicked-on <td> element to doTurn()
            doTurn(this);
        }
    });    
    $('#save').on('click', function() { saveGame(); });
    $('#previous').on('click', function() { previousGame(); });
    $('#clear').on('click', function() { clearGame(); }); 
}

function saveGame() {
    //  Clicking the button#save element:
    //  1. loads the saved game's state into the gameBoard
    //  2. when the current game already exists in the database sends a PATCH request to the "/games/:id" route 
    //  3. marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request
    //  4. when the current game has not yet been saved sends a POST request to the "/games" route    
    $('td').text( function(index, cell) {
        state.push(cell);
    });
    if (gameId) {  
        $.ajax({
            data: {state: state},
            type: 'PATCH',
            url: `/games/${gameId}`
        });
    } else {
        $.post('/games', {state: state}, function(game) {
            gameId = game.data.id;
        });
    }
}

function previousGame() {
    // Clicking the button#previous element:
    // 1. when previously-saved games exist in the database adds those previous games as buttons in the DOM's div#games element
    // 2. when no previously-saved games exist in the database does not add any children to the div#games element in the DOM
    // 3. re-add saved games already present in the div#games element when the "previous" button is clicked a second time         
    $.get('/games', function(savedGames) {
        $('#games').empty();
        $('#message').empty();
        savedGames.data.forEach(function(game) {
        if (savedGames.data.length !== 0) {
                $("#games").append(`<button id="gameId-${game.id}">Game ${game.id}</button><br>`);
                $("#gameId-" + game.id).on('click', function() {
                    showGame(game.id);
                });
            };
        });
    });
};
    
function showGame(id) {
    $.get(`/games/${id}`, function(game) {
        // Clicking a saved game button (in the div#games element): 
        //  1. sends a GET request to the "/games/:id" route 
        //  2. loads the saved game's state into the board:
        //  3. marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request
        $("#games").empty();
        $("#message").text(`Game ${id}`);
        gameId = game.data.id;
        state = game.data.attributes.state;
        turn = state.join("").length;
        i = 0;
        state.forEach( function(element) {
            $('td')[i].innerHTML = element;
            i++;
        });
    });
};

function clearGame() {
    // Clicking the button#clear element:
    // 1. when an unsaved game is in progress clears the game board
    // 2. when the in-progress game has already been saved fully resets the game board so that the next press of the "save" button results in a new game being saved
    turn = 0;
    gameId = 0;
    $("td").empty();
}