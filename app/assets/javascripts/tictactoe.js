
let turn = 0; //will turn++ with each doTurn()

$(document).ready(attachListeners());

function player() {
  if (turn % 2) {
    return 'O'
  } else {
    return 'X'
  }
}

function updateState(boxChoice) {
  // basically is listening for which box you're clicking on
  // then filling box with that players token
  //call update state from doturn, which is called in event listeners using this
  $(boxChoice).text(player()); //works in console!
}

function setMessage(message) {
  $('div#message').text(message);
}

function checkWinner() {
  // here need to go through html of board and save in variables to compare against winning cobo
  // in console, able to access squares like this
  let squareZero = $('td')[0]
  let squareOne = $('td')[1]
  let squareTwo = $('td')[2]
  let squareThree = $('td')[3]
  let squareFour = $('td')[4]
  let squareFive = $('td')[5]
  let squareSix = $('td')[6]
  let squareSeven = $('td')[7]
  let squareEight = $('td')[8]

  let board = [squareZero, squareOne, squareTwo, squareThree, squareFour, squareSix, squareSeven, squareEight]

  const winCombinations = [
       [0,1,2],
       [3,4,5],
       [6,7,8],
       [0,3,6],
       [2,5,8],
       [1,4,7],
       [0,4,8],
       [6,4,2]
     ]

  for (const element of winCombinations) {
    if (board[element[0]] == 'X' && board[element[1]] == 'X' && board[element[0]] == 'X') {
      setMessage('Player X Won!');
      return true;
    } else if (board[element[0]] == 'O' && board[element[1]] == 'O' && board[element[0]] == 'O') {
      setMessage('Player O Won!');
      return true;
    } else {
      return false;
    }

  }
  //iterate through winCombinations
  // for each iteration will get array like [0, 1, 2]
  //use these to access those indices on board array
  // check if each one is either x & x & x or all ys
}

function doTurn(boxChoice) {
  turn ++;
  updateState(boxChoice);
  checkWinner();
}

function attachListeners() {
  // button event listeners go here!
  $('td').on('click', function() {
    //check if empty first
    doTurn(this);
    //in debugger, this is full td
    //get boxchoice here, pass to doturn, which passes to update game
  })
  // basically do same thing as above for buttons, just plug in below functions where doturn is
}

function currentGame() {
  //how to access current game/know if a game has been created?
}

function saveGame() {
  let squareZero = $('td')[0]
  let squareOne = $('td')[1]
  let squareTwo = $('td')[2]
  let squareThree = $('td')[3]
  let squareFour = $('td')[4]
  let squareFive = $('td')[5]
  let squareSix = $('td')[6]
  let squareSeven = $('td')[7]
  let squareEight = $('td')[8]
  //can use a map to go through

  let board = [squareZero, squareOne, squareTwo, squareThree, squareFour, squareSix, squareSeven, squareEight]

  if (!!currentGame()) {
    //how to access current game/know if a game has been created?
    // Don't need game object?
    // Need to save location spots-just in array?
    //Don't need to save instance of game class! just talk to rails api and get game data!
    game = currentGame(); //create currentGame() function?
    game.state = board;
  } else {
    game = Game.new;
    game.state = board;
    game.save; // AJAX request to save game
  }
  // save game state
  // game is a class with a state attribute
  // what is state? the board?
  // then in win method, just check state

}

function previousGames() {

}
