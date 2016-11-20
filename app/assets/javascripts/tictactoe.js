var turn = 0;

// Use this for refactor of checkWinner()
var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function attachListeners() { // COMPLETE
// You must have a function called attachListeners() which the tests call to attach the click handlers to the page after the DOM has been loaded
// When a client clicks on a cell, the function doTurn() should be called and passed a parameter of the event
  $('td').click(function(move) {
    doTurn(move);
  });
}

function board() { // COMPLETE
  return $('td').map(function(index, square) {
    return square.innerHTML;
  });
}

function doTurn(move) { // COMPLETE
    // Increment the variable turn by one
  // Should call on the function updateState() and pass it the event
  // Should call on checkWinner()
  //move.taget == <td data-x="2" data-y="2"></td>
  updateState(move.target);
  checkWinner();
  turn++;
}

function player() {  // COMPLETE
  // If the turn number is even, this function should return the string "X", else it should return the string "O"
  return (turn % 2 === 0) ? "X" : "O";
  // if (turn % 2 === 0) {
  //   return "X";
  // } else {
  //   return "O";
  // }
}

function updateState(move) { // COMPLETE
  // This method should call on player() and add the return value of this function to the clicked cell on the table
  $(move).text(player());
}

function checkWinner() { // COMPLETE
  // This function should evaluate the board to see if anyone has won
  // If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().
  // 3 Horizontal Wins
  // 2 Diagonal Wins
  // 3 Vertical Wins
  if (board()[0] === board()[1] && board()[1] === board()[2] && board()[2] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[3] === board()[4] && board()[4] === board()[5] && board()[5] !== "") {
    return message("Player " + board()[3] + " Won!");
  } else if (board()[6] === board()[7] && board()[7] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[6] + " Won!");
  } else if (board()[0] === board()[4] && board()[4] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[2] === board()[4] && board()[4] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if (board()[0] === board()[3] && board()[3] === board()[6] && board()[6] !== "") {
    return message("Player " + board()[0] + " Won!");
  } else if (board()[1] === board()[4] && board()[4] === board()[7] && board()[7] !== "") {
    return message("Player " + board()[1] + " Won!");
  } else if (board()[2] === board()[5] && board()[5] === board()[8] && board()[8] !== "") {
    return message("Player " + board()[2] + " Won!");
  } else if ($.inArray("", board()) === -1) {
    return message("Tie game");
  } else {
    return false;
  }
}

function message(string) { // COMPLETE
  // This function should accept a string and add the string to the div with an id of "message"
  $('#message').html(string);

  //Saves the board/game state in a variable.
  //Creates an ajax request where data is sent to the backend to be stored for later use.
  saveGameState();

  $('td').empty();
  turn = 0;
}










// NOTE: Below are the updates I've made. Feel free to make any changes you need. I've tried to add notes to make it clear, fingers crossed lol. Realistically we probably have another 2 hours worth of work but I'll help out once I get up. May be a little late, worked later than I wanted. I'll talk to ya in a few hours.



$(function() {
  attachListeners();

  // TODO: set gameID (unless new game). Will be used when saving a game.
  // var gameID;


  // NOTE: Game # Link(s)
  // (1) Clicking on an individual (Game#) link makes an ajax call via getJSON().
  // (2) With the data-id attribute, getJSON makes a 'GET' request for the specified game resource.
  // (3) The request gets processed by the #show action in games controller and returned in the response.
  // (4) TODO: Take the response variable and populate the board with those values and resume game.
  //
  $('#games').on('click', 'a', function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    $.getJSON(`/games/${id}.json`, function(response){
      // TODO: edit response below
      var gameState = response
      debugger
    });//end
  });//end of on()



  // NOTE: "Show Previous" button
  // Game History (clicking the "Show Previous Games")
  // (1) Clicking on the "Show Previous" button makes an ajax call via getJSON().
  // (2) getJSON makes a 'GET' request for all available game resources.
  // (3) The request gets processed by the #index action in games controller and returned in the response.
  $("#previous").on('click', function() {
    $.getJSON("/games.json", function(response) {

      var html = "<h2>Game History</h2>";
      html += "<ul>";
      $.each(response.games, function(i, game){
        var id = game.id;
        html += `<li><a href="#" class"js-game" data-id="${id}">Game# ${id}</a></li>`;
      })//end of each()

      html += "</ul>";
      $("#games").html(html);

    });//end of get()
  });//end of on()


  // NOTE: Saves or updates game resource to the db
  function saveGameState() {

    // var gameState = board();
    var gameState = ["O", "", "", "X", "O", "X", "", "X", "O"];
    // TODO: remove hard coded value above once board() return value has been reformatted


    // TODO: Set "ajaxMethod" and "ajaxUrl" variables
    // (1) Set "ajaxMethod" variable based on whether the current game is a new record or already saved in the database.
    // (2) "ajaxMethod" should be set to "POST" if game is new or set to "PATCH" if game is in progress.
    // (3) "ajaxUrl" variable also needs to be set based on whether or not a game is new.
    // (4) Set "ajaxUrl" to "/games" if new resource and "games/id_value" if updating an exsisting resource.

    // TODO: set
    //var ajaxMethod;
    //var ajaxUrl;

    $.ajax({
      // TODO: add "PATCH" when games are saved
      type: ajaxMethod,//  "POST" or "PATCH"
      url: ajaxUrl,//  "/games" or "/games/<gameID>",
      dataType: "json",
      data: {
              game: {
                state: gameState
              }
            }
      // TODO: add callback function to set board
      // success: function() { callback function; }

    });//end ajax()
  }//end saveGameState()



});//end of function()
