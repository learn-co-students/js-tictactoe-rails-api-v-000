 /* global $ */

// Code your JavaScript / jQuery solution here

// Variables
let turn;
let token;
let game_num = 0;
// const WIN_COMBINATIONS = [
//     [0,1,2],  // Top row
//     [3,4,5],  // Middle row
//     [6,7,8],  // Bottom row
//     [0,4,8],  // Diagonal Left Top to Right Bottom
//     [2,4,6],  // Diagonal Right Top to Left Bottom
//     [0,3,6],  // Left Col
//     [1,4,7],  // Middle Col
//     [2,5,8]   // Right Col
//   ];

$(document).ready(function(){
    console.log("Initialize Document");

    // Set default variables on page load
    turn = 0;
    token = "X";
    
    // Attach listeners to buttons and board
    attachListeners();

});

// Return "current player" token based on turn counter
function player() {
    // console.log('Player function');
    if (turn % 2 === 0) {
        token = "X";
    } else {
        token = "O";
    }
    // console.log(`turn = ${turn} || player token = ${token}`);
    return token;
};

// Update game state based on passed in "td" square element
function updateState(square) {
    // console.log('Update state function');
    const player_token = player();
    const square_data_x = parseInt(square.getAttribute("data-x"));
    const square_data_y = parseInt(square.getAttribute("data-y"));
    // console.log(`Square data cell : Col = ${square_data_x}, Row = ${square_data_y}`);
    
    // Update table with player token
    document.getElementsByTagName("table")[0].rows[square_data_y].cells[square_data_x].innerHTML = player_token;
};

// Update "message" div with given message
function setMessage(message) {
    // console.log('Set Message Function');
    // console.log('Message = ', message);
    $("#message").text(message);
};

// Checks for winner and displays winner message if applicable
function checkWinner() {
    // console.log('Check Winner');

    // NOTE : TEMP PUTTING THIS HERE -- because tests say that it isn't defined and this is the only place it really comes up I think...
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
        // console.log("Combo = ", combo);
        if (board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
            winnerToken = board[combo[0]];
            return combo;
        };
    });

    // if yes -> display winner message + return true
    if (winStatus === true) {
        setMessage(`Player ${winnerToken} Won!`);
        // console.log(`Player ${winnerToken} Won!`);
    };
    
    // if no -> return false
    // console.log("winStatus = ", winStatus);
    return winStatus;
};

// Note : Function to return the current state of the game board (in array form)
function getCurrentGameState() {
    // console.log("Get current game state");
    const game = document.getElementsByTagName("table")[0];
    const board = [];
    
    // Iterate through game cells and collect values
    for (let x = 0; x < game.rows.length; x++) {
        for (let y = 0; y < game.rows[x].cells.length; y++) {
            let cell = game.rows[x].cells[y];
            // console.log(cell);
            board.push(cell.innerHTML);
        }
    };
    
    // console.log("Board = ", board);
    return board;
};

// Performs a singular turn if possible
function doTurn(element) {
    // console.log('Do turn : ', turn);
    // console.log('Turn element = ', element);
    const board = getCurrentGameState();
  
    // Call updateState
    updateState(element);
    // Increment turn counter
    turn++;
    
    // Check if turn is possible (should not be able to modify a winning game board)?
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
    // console.log('Attach event listeners');
    
    // Add button event listeners
    $("#save").click(saveButtonClick);
    $("#previous").click(previousButtonClick);
    $("#clear").click(clearButtonClick);
    
    // Add event listeners to game board cells
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
          doTurn(this);
        }
      });
};

// Save button function -- Save or Update Game "Current" State (if not completed)
function saveButtonClick(){
    console.log('Clicked save button');
    // Get current game state
    
    // Check if current game exists or needs updating
    // Save or update
};
   
// Previous button function --  Return list of previously played games as buttons to display state
function previousButtonClick(){
    console.log('Clicked previous button');
    // Empty div for get response
    $('#games').empty();
    // Retrieve previously played games
        // Display previously played games as buttons in div "#games"
    $.get( "/games", function( data ) {
        console.log("Games Data Length = ", data.data.length);
        console.log("Games Data = ", data);
        
        // Only display previous games if they exist
        if (data.data.length > 0) {
            let gameData = `<button id="game-${data.data.id}">${data.data.id}</button><br>`;
            $("#games").append( gameData );
            $(`#game-${data.data.id}`).click(showGame(this));
        };
    });
};

// Clear button function --  Clear current game state
function clearButtonClick(){
    console.log('Clicked clear button');
    // Clear current game state
    turn = 0;
    game_num = 0;
    $("td").text('');
};

// const squares = document.querySelectorAll('td');

function showGame(gameId) {
    
};