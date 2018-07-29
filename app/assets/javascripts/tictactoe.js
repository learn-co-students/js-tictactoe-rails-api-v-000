 /* global $ */

// Code your JavaScript / jQuery solution here

// Variables
let turn;
let token;

$(document).ready(function(){
    
    // Set variables to default
    turn = 0;
    token = 'X';
    
    // Save or Update Game "Current" State (if not completed)
    $("#save").click(function(){
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
    });
    
    // Return list of previously played games as buttons to display state
    $("#previous").click(function(){
        console.log('Clicked previous button');
        // Retrieve previously played games
        // Display previously played games as buttons in div "#games"
    });

    // Clear current game state
    $("#clear").click(function(){
        console.log('Clicked clear button');
        // Clear current game state
    });
    
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
}

// Update game state based on passed in "td" square element
function updateState(square) {
    // console.log('Update state function');
    const player_token = player();
    const square_data_x = parseInt(square.getAttribute("data-x"));
    const square_data_y = parseInt(square.getAttribute("data-y"));
    // console.log(`Square data cell : Col = ${square_data_x}, Row = ${square_data_y}`);
    
    // Update table with player token
    document.getElementsByTagName("table")[0].rows[square_data_y].cells[square_data_x].innerHTML = player_token;
}

// Update "message" div with given message
function setMessage(message) {
    // console.log('Set Message Function');
    // console.log('Message = ', message);
    $("#message").text(message);
}

// 
function checkWinner() {
    
}

// const squares = window.document.querySelectorAll('td');

function doTurn() {
    
}

function attachListeners() {
    
}