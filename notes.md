  function player(){
    return 'O'
    // 1) player() is defined:
    // 2) player() returns "X" when the turn count is even:
    // 3) player() returns "O" when the turn count is odd:
  }

  function updateState(){
    // 4) updateState() is defined:   
    // 5) updateState() invokes the player() function:
    // 6) updateState() adds the current player's token to the passed-in <td> element:
  }
  
  function setMessage(){
    // 7) setMessage() sets a provided string as the innerHTML of the div#message element:
  }

  function checkWinner(){
    // 8) checkWinner() is defined:   
    // 9) checkWinner() returns true when a player wins horizontally:
    // 10) checkWinner() returns true when a player wins diagonally:
    // 11) checkWinner() returns true when a player wins vertically:
    // 12) checkWinner() returns false if no winning combination is present on the board:
    // 13) checkWinner() invokes the setMessage() function with the argument "Player X Won!" when player X wins:   
    // 14) checkWinner() invokes the setMessage() function with the argument "Player O Won!" when player O wins:
  }

  function doTurn(){
    // 15) doTurn() is defined:    
    // 16) doTurn() increments the value of the "turn" variable:
    // 17) doTurn() invokes the checkWinner() function:    
    // 18) doTurn() invokes the updateState() function:   
    // 19) doTurn() invokes the setMessage() function with the argument "Tie game." when the game is tied:    
    // 20) doTurn() resets the board and the "turn" counter when a game is won:
  }

  function attachListeners(){
    // 21) attachListeners() is defined:    
    // 22) attachListeners() attaches event listeners that invoke doTurn() when a square is clicked on:
    // 23) attachListeners() passes the clicked-on <td> element to doTurn():
  }
  // 24) Gameplay Users can play multiple games:
  // 25) AJAX interactions with the Rails API Clicking the button#previous element sends a GET request to the "/games" route: 
  // 26) AJAX interactions with the Rails API Clicking the button#previous element when no previously-saved games exist in the database does not add any children to the div#games element in the DOM:
  // 27) AJAX interactions with the Rails API Clicking the button#previous element when previously-saved games exist in the database adds those previous games as buttons in the DOM's div#games element:
  // 28) AJAX interactions with the Rails API Clicking the button#previous element when previously-saved games exist in the database does not re-add saved games already present in the div#games element when the "previous" button is clicked a second time:
  // 29) AJAX interactions with the Rails API Clicking the button#save element when the current game has not yet been saved sends a POST request to the "/games" route:
  // 30) AJAX interactions with the Rails API Clicking the button#save element when the current game already exists in the database sends a PATCH request to the "/games/:id" route:
  // 31) AJAX interactions with the Rails API Clicking the button#clear element when an unsaved game is in progress clears the game board:
  // 32) AJAX interactions with the Rails API Clicking the button#clear element when the in-progress game has already been saved fully resets the game board so that the next press of the "save" button results in a new game being saved:
  // 33) AJAX interactions with the Rails API Completing a game auto-saves tie games:
  // 34) AJAX interactions with the Rails API Completing a game auto-saves won games:
  // 35) AJAX interactions with the Rails API Clicking a saved game button (in the div#games element) sends a GET request to the "/games/:id" route:
  // 36) AJAX interactions with the Rails API Clicking a saved game button (in the div#games element) loads the saved game's state into the board:
  // 37) AJAX interactions with the Rails API Clicking a saved game button (in the div#games element) marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH