var turn = 0;
var gameId = 0;
var player = () => turn % 2 ? "O" : "X"
// The player variable points to an anonymous arrow function
// Since we omit curly braces {} around the function body, we get implicit returns
// If there's a remainder when we divide the turn variable's value by 2,
// turn is an odd number, so return "O"
// Otherwise, turn is an even number, so return "X"

function updateState(clickedSquare) {
  var currentPlayerToken = player();
  $(clickedSquare).text(currentPlayerToken);
}
// clickedSquare argument is <td> element = square clicked on game board
// invoking player() returns the string "X" or "O", which is stored in variable currentPlayerToken
// updateState(clickedSquare) invokes player() and adds the current player's token,
// i.e., the 'X' or 'O' string returned by player(), to the passed-in <td> element
// Alternative way to write updateState(clickedSquare) method:
// var updateState = (clickedSquare) => $(clickedSquare).text(player())
// variable updateState points to an anonymous arrow function which accepts
// an argument of the <td> element representing the square that was clicked on the game board.
// this clickedSquare parameter is found inside the parentheses before the arrow.
// use jQuery to grab the <td> element clicked on, and add the result of invoking player(),
// which is just a string "X" or "O", as the text of the <td> element (square) clicked on

function setMessage(string) {
  $('#message').text(string);
}
// setMessage(string) sets a provided string as the innerHTML of the div#message element

function checkWinner() {
  var board = {};
  var winner = false;
  const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                               [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  $('td').text((index, stringToken) => board[index] = stringToken);

  winningCombinations.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}
// To set text content of selected elements using a function:
// $(selector).text(function(index,currentcontent))
// function(index,currentcontent) specifies a function that returns the new text content for the selected elements
// index - Returns the index position of the element in the set
// currentcontent - Returns current content of selected elements

// use jQuery function to select <td> elements, which are squares on the game board
// To recreate the state of the game board in the object stored in board variable:
// Return the text content of the selected <td> elements using an arrow function:
// The parameters passed in are found in the parentheses before the arrow
// index = the index position of each <td> square on the board (a number 0-8)
// stringToken is the current text content ("X" or "O") of each <td> square on the game board
// Populate the board object with key/value pairs,
// where each key is the index position of a <td> square on the game board,
// and the value corresponding to each key is the string token "X" or "O" at that position.

// The Array.prototype.some() method tests whether at least 1 element in the array
// passes the test implemented by the provided function.
// The .some() method returns true or false.
// Call .some() method on the winningCombinations array (it's an array of arrays)
// We're checking to see whether at least 1 array element
// (an array of a possible winning combination stored in the combo variable)
// passes the test implemented by the provided function.
// The elements of each array (stored in combo variable) are index numbers
// for 1 possible winning combination on the game board.
// Example: let's say that combo currently = the array of possible winning combination indices: [3, 4, 5]
// combo[0] is the first element in the array, in this case, the number 3
// This number 3 is the index position (key) on the board (object).
// object[key] = value, so board[index number] = string token
// Make sure that the value corresponding to this index position (key) on the board (object)
// is NOT an empty string (i.e. NOT a blank, unoccupied space),
// but rather, "X" or "O".
// Also make sure that the 3 values corresponding to those three index positions
// are either all "X" or all "O"

function saveGame() {
  var state = [];
  $('td').each(function(){
    state.push(this.textContent);
  });

  if(gameId){
    $.ajax({
      method: "PATCH",
      url: `/games/${gameId}`,
      data: {state: state}
    })
  } else {
    var jqXHRObject = $.post("/games", {state: state})
    jqXHRObject.done(function(response){
      gameId = response["data"]["id"];
    })
  }
}
// A game instance has a state attribute = array representing the current state of the game board
// variable state is initially set = to an empty array
// Use jQuery function ($) to grab <td> elements (that represent all the squares on the game board)
// Iterate over the <td> elements using the each() method,
// which accepts a callback function that will be executed on each element in the array
// For each <td> element, (the current <td> element being iterated over is referred to as this),
// grab its text content ("X", "O" or empty string "")
// using this.textContent
// and push the string text content value into the state array
// If there is a gameId, this means that the game instance was already saved to the DB,
// so we're updating a previously-saved game, and we need to use an AJAX request of HTTP type PATCH
// The ajax() method accepts an object as its argument, which has
// the key "method" (which points to the value of "PATCH")
// and the key "url" (which points to the string URL "/games/:id"
// to which we're sending the AJAX PATCH request)
// We interpolate the gameId in the URL string using `` and ${}
// If there is NO gameId, this means that the game has NOT been saved to the DB yet
// We're creating and saving a NEW game instance to the DB.
// Using jQuery .post() method, send an AJAX request of HTTP type POST to "/games"
// The arguments passed to $.post():
// 1). the URL to which we're sending the AJAX POST request, in this case, "/games"
// 2). the data that is sent to the server with the request:
// this data can be a plain object (a JS object with 0 or more k/v pairs), or a string
// Here, the data that we send to the server with the AJAX POST request is a JS object
// with the key of "state" pointing to the state array
// Reminder: state = an array that represents the current state of the game board,
// and it will be serialized so the game instance is rendered as json (see games#create),
// using GameSerializer and class method serialize :state, Array in the AR Game model
// $.post() method returns a jqXHR object, stored in variable jqXHRObject
// call .done() on jqXHRObject, passing in the callback function that handles the response
// In this callback, set gameId = response["data"]["id"]
// response = plain text JSON string of JSON object representing @game instance
// (that was just created and saved to DB in games#create)
// The response JSON object has a key called "data", which points to top-level data object
// and this data object has a key "id", which points to id attribute value of game instance just created and saved to DB

function resetGame() {
  $('td').each(function(){
    $(this).text("");
  })
  turn = 0;
  gameId = 0;
}

function doTurn(clickedSquare) {
  updateState(clickedSquare);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetGame();
  }
}
// updateState(clickedSquare) makes the text of the <td> element clicked
// = the current player's string token "X" or "O"
// The increment operator (++) adds one to the turn variable's value and then returns the new value
// If there is a winner or if the game is a tie, the game is over, so nobody plays another turn
// and in both situations, call saveGame() and resetGame()
// Note: invoking checkWinner() returns true if a winner was found and false if not
// Note: a tie game occurs when turn === 9 (all 9 squares on the board were filled, but nobody won).
// If there is a tie, we also call setMessage("Tie game.")
// so that "Tie game." text appears in <div id="message">
function presentPreviousGames() {
  $.get("/games").done(function(response) {
    if (response.data.length > 0) { // games exist in the DB
      response.data.forEach(function(game) { // iterate over the games
        if (game.id > $('#games button:last').text()) {
          $('#games').append(`<button onclick="restoreGameBoard.call(this);" data-id="${game.id}">${game.id}</button>`)
        }
      });
    }
  });
}
// Explanation of presentPreviousGames function:
// Use jQuery .get() method to send an AJAX request of HTTP type GET to "/games"
// "/games" is the string URL where we would normally retrieve the index page of all games
// $.get() method returns a jqXHR object, on which we call done(),
// passing in the callback function that handles the response.
// In games#index, we store the AR::Relation of all game instances in the games variable
// games = Game.all and then we call render json: games
// This tells the requestor that the response is plain text JSON string
// (of the JSON object representing all the game instances stored in the DB)
// so we can use JS to operate on it.
// The response JSON object has a top-level key "data" that points to the top-level data object
// which is like an array of all AR game instances, in this case
// object.key = value
// Calling response.data.length will tell us how many games were saved in the DB and rendered to JSON
// Clicking the button#previous element when NO previously-saved games exist in the database
// does NOT add any children to the div#games element in the DOM
// Clicking the button#previous element when previously-saved games DO exist in the DB
// adds those previous games as buttons in the DOM's div#games element,
// as long as buttons for those games have NOT already been added to div#games element.
// There will NOT be duplicate buttons for a game in the div#games element
function restoreGameBoard() {
  var gameToRestore = $(this).data("id");
  $.get(`/games/${gameToRestore}`).done(function(response) {
    var stateToRestore = response.data.attributes.state;
    var currentState = document.querySelectorAll('td');
    for (let i = 0; i < 9; i++) {
      currentState[i].innerHTML = stateToRestore[i];
      if (stateToRestore[i] !== "") {
        turn++;
      }
    }
    gameId = response.data.id;
  })
}
// this refers to the <button onclick="restoreGameBoard.call(this)" data-id="${game.id}"...>
// from presentPreviousGames function above
// Remember: each previous game listed in <div id="games"> has a button to restore its game board
// We can click a button for a particular game and know which game to restore
// b/c the button has a data-id property = the id attribute value of the game instance to restore
// Then, use jQuery .get() method to make an AJAX request of HTTP type GET to "/games/:id"
// "/games/:id" is the string URL that we would normally use to get to the game show page
// Interpolate the value of the gameToRestore variable, which = the id of the game instance we want to restore
// $.get() method returns a jqXHR object, on which we call .done()
// and pass in a callback function to handle the response
// Reminder: a game instance has a state attribute value = array
// representing the current game's state, with a string "X", "O", or an empty string ""
// at each index position of the state array
// variable stateToRestore stores the retrieved state array of the game we want to resume,
// which we got from the JSON response: var stateRestored = response.data.attributes.state
// document.querySelectorAll('td') returns a NodeList representing a list of the document's <td> elements,
// i.e., a list of the game board's square spaces (the current state)
// Using a for loop, we then set the current state of the game board to
// = the retrieved state we wished to restore
// i represents the index of each position on the board
// there are 9 positions on the board, so indices go from 0-8
// During the iteration, increment and then return the index value, as long as the index is < 9
// the innerHTML of each <td> element in the NodeList stored in currentState
// equals the value found ("X", "O" or "") at that same index in the stateToRestore array.

function attachListeners() {
  $('td').on("click", function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').on("click", () => saveGame());
  $('#previous').on("click", () => presentPreviousGames());
  $('#clear').on("click", () => resetGame());
}
// Using jQuery function, select any <td> element on the page
// (each represents a square on the game board)
// and hijack their click event by binding a new click event to the <td> elements
// Inside the callback function,
// this refers to the specific <td> element that triggered the click event
// (the square that was clicked)
// If the clicked <td> element does NOT contain any text
// (it's an empty string "" representing an available spot on the game board)
// AND if checkWinner() returns false, meaning the game is NOT won,
// then call doTurn(this), passing in the <td> element that was clicked

$(document).ready(function() {
  attachListeners(); // attachListeners() is invoked once the DOM page is fully loaded
})
