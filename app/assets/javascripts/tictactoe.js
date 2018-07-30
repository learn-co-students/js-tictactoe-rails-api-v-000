 /* global $ */

// Code your JavaScript / jQuery solution here

// Variables
let turn;
let token;
let game_num = 0;
const win_combinations = [
    [0,1,2],  // Top row
    [3,4,5],  // Middle row
    [6,7,8],  // Bottom row
    [0,4,8],  // Diagonal Left Top to Right Bottom
    [2,4,6],  // Diagonal Right Top to Left Bottom
    [0,3,6],  // Left Col
    [1,4,7],  // Middle Col
    [2,5,8]   // Right Col
  ];

$(document).ready(function(){

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
    console.log('Check Winner');

    const board = getCurrentGameState();
    let winnerToken;
    
    // Check winner combination for specific token
    function checkCombo(element){
      let win_index_1 = win_combinations[0]
      let win_index_2 = win_combinations[1]
      let win_index_3 = win_combinations[2]

      let position_1 = board[win_index_1] // load the value of the board at win_index_1
      let position_2 = board[win_index_2] // load the value of the board at win_index_2
      let position_3 = board[win_index_3] // load the value of the board at win_index_3

      if ((position_1 == "X" && position_2 == "X" && position_3 == "X") || (position_1 == "O" && position_2 == "O" && position_3 == "O")) {
            return win_combinations;
          }
    };

    // Check if winning combination on board
    const winStatus = win_combinations.some(checkCombo);

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
            console.log(cell);
            board.push(cell.innerHTML);
        }
    };
    
    // console.log("Board = ", board);
    return board;
};

// Performs a singular turn if possible
function doTurn(element) {
    console.log('Do turn : ', turn);
    console.log('Turn element = ', element);
    // Check if turn is possible (should not be able to modify a winning game board)
    // Call updateState
    updateState(element);
    // Call checkWinner
    checkWinner();
    // Increment turn counter
    turn++;
};

// const squares = document.querySelectorAll('td');

// Attach listeners to buttons
function attachListeners() {
    console.log('Attach event listeners');
    
    // Add button event listeners
    $("#save").click(saveButtonClick);
    $("#previous").click(previousButtonClick);
    $("#clear").click(clearButtonClick);
    
    // Add event listeners to game board cells
    // https://stackoverflow.com/questions/46341171/how-to-addeventlistener-to-table-cells
    // https://stackoverflow.com/questions/3740650/adding-addeventlistener-to-a-clicked-table-cell-to-change-the-color
    // document.querySelectorAll('td').forEach(e => e.click(doTurn));
};

// Save button function -- Save or Update Game "Current" State (if not completed)
function saveButtonClick(){
    console.log('Clicked save button');
    const game = document.getElementsByTagName("table")[0];

    // let current_state_list = document.querySelectorAll('td');
    // const current_state = [];
    // current_state_list.forEach(function(item){
    //     let json = JSON.stringify({
    //         x: parseInt(item.getAttribute("data-x")),
    //         y: parseInt(item.getAttribute("data-x")),
    //         token: item.innerHTML
    //     });
    //     current_state.push(json);
    // });
    // console.log('Current game state is : ', current_state);

    // Get current game state
    // Check if current game exists or needs updating
    // Save or update
};
   
// Previous button function --  Return list of previously played games as buttons to display state
function previousButtonClick(){
    console.log('Clicked previous button');
    // Retrieve previously played games
    // Display previously played games as buttons in div "#games"
};

// Clear button function --  Clear current game state
function clearButtonClick(){
    console.log('Clicked clear button');
    // Clear current game state
};
