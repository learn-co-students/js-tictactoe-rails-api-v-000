 /* global $ jQuery */

// Code your JavaScript / jQuery solution here

// Variables
let turn;
let token;
let game_num;

$(document).ready(function(){

    // NOTE : Set default variables on page load -- need to do this for globals for test suite to be able to access them
    turn = 0;
    token = "X";
    game_num = 0;
    
    // Attach listeners to buttons and board
    attachListeners();

});

// Return "current player" token based on turn counter
function player() {
    if (turn % 2 === 0) {
        token = "X";
    } else {
        token = "O";
    }
    return token;
};

// Update game state based on passed in "td" square element
function updateState(square) {
    const player_token = player();
    const square_data_x = parseInt(square.getAttribute("data-x"));
    const square_data_y = parseInt(square.getAttribute("data-y"));

    // Update table with player token
    document.getElementsByTagName("table")[0].rows[square_data_y].cells[square_data_x].innerHTML = player_token;
};

// Update "message" div with given message
function setMessage(message) {
    $("#message").text(message);
};

// Checks for winner and displays winner message if applicable
function checkWinner() {
    const WIN_COMBINATIONS = [
        [0,1,2],  // Top row
        [3,4,5],  // Middle row
        [6,7,8],  // Bottom row
        [0,4,8],  // Diagonal Left Top to Right Bottom
        [2,4,6],  // Diagonal Right Top to Left Bottom
        [0,3,6],  // Left Col
        [1,4,7],  // Middle Col
        [2,5,8]   // Right Col
      ];
      
    const board = getCurrentGameState();
    let winnerToken;
    
    // Check if winning combination on board
    const winStatus = WIN_COMBINATIONS.some(function(combo) {
        if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
            winnerToken = board[combo[0]];
            return combo;
        };
    });

    // if yes -> display winner message + return true
    if (winStatus === true) {
        setMessage(`Player ${winnerToken} Won!`);
    };
    
    // if no -> return false
    return winStatus;
};

// Note : Function to return the current state of the game board (in array form)
function getCurrentGameState() {
    const game = document.getElementsByTagName("table")[0];
    const board = [];
    
    // Iterate through game cells and collect values
    for (let x = 0; x < game.rows.length; x++) {
        for (let y = 0; y < game.rows[x].cells.length; y++) {
            let cell = game.rows[x].cells[y];
            board.push(cell.innerHTML);
        }
    };
    
    return board;
};

// Performs a singular turn if possible
function doTurn(element) {
    const board = getCurrentGameState();
  
    // Call updateState
    updateState(element);
    
    // Increment turn counter
    turn++;
    
    // Check if turn is possible
    if (checkWinner()) {
        saveButtonClick();
        clearButtonClick();
    } else if (turn > 8) {
        setMessage("Tie game.");
        saveButtonClick();
        clearButtonClick();
    };

};

// Attach listeners to buttons
function attachListeners() {

    // Add button event listeners
    $("#save").click(saveButtonClick);
    $("#previous").click(previousButtonClick);
    $("#clear").click(clearButtonClick);
    
    // Add event listeners to game board cells
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
          doTurn(this);
        };
      });
};

// Save button function -- Save or Update Game "Current" State (if not completed)
function saveButtonClick(){

    // Get current game state
    const board = getCurrentGameState();
    const gameData = { state: board };

    // Check if current game exists or needs updating
    // Save or update
    if (game_num > 0) {
        $.ajax({
          type: 'PATCH',
          url: `/games/${game_num}`,
          data: gameData
        });
    } else { 
        $.post('/games', gameData, function(game) {
          game_num = game.data.id;
        });
    };
};

// Previous button function -- Return list of previously played games as buttons to display state
function previousButtonClick(){

    // Empty div for get response
    $('#games').empty();
    $.get( "/games", function( games ) {
        const previousGames = games.data;

        // Only display previous games if they exist
        if (previousGames.length > 0) {
            previousGames.forEach(function(game) {
                let gameData = `<button id="game-${game.id}">${game.id}</button><br>`;
                $("#games").append( gameData );
                $(`#game-${game.id}`).click(() => showGame(game.id));
            });
        };
    });
};

// Clear button function -- Clear current game state
function clearButtonClick(){
    turn = 0;
    game_num = 0;
    $("td").text('');
};

// Show State of a Saved Game
function showGame(gameId) {
    game_num = gameId;
    
    // Get game data from show route
    $.get( `/games/${gameId}`, function( data ) {
        const stateArray = data.data.attributes["state"];
        
        // Load the game state into the view
        pushCurrentGameState(stateArray);
    });
};

// Sibling function to set game state values rather than get them
function pushCurrentGameState(array) {

    const game = document.getElementsByTagName("table")[0];
    let arrayIterator = 0;
    turn = 0;

    // Iterate through game cells and set values
    for (let x = 0; x < game.rows.length; x++) {
        for (let y = 0; y < game.rows[x].cells.length; y++) {
            let cell = game.rows[x].cells[y];
            
            // Update turn variable
            if (array[arrayIterator] != "") {
                turn++;
            };
            
            // Update Board
            cell.innerHTML = array[arrayIterator];
            arrayIterator++;
        }
    };
};
