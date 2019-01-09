// Code your JavaScript / jQuery solution here

var turn = 0;

function player() {
  return turn % 2 ? "O" : "X";
}

function updateState(clickedSquare) {
  let token = player();
  $(clickedSquare).text(token);
}

function setMessage(string) {
  $('div#message').text(string);
}


var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function checkWinner() {

// we're checking to see if there's a winner everytime a move is made.
// so we need to take the move that was just made and compare the board now with the winning combos

// by default a player isn't a winner
  var winner = false;

  // now we need to create a board out of the td nodes there. convert the token strings to something we can use to compare.
  // const board = $("td").map(function() { return $(this).html() }).toArray();
  // using the lines below is better and easier to read at the end

  var board = {};
  // index comes from the different 'td' nodes/elements
  // square is the user click at the moment
  // the board is iniatialized above (as empty), and when a user clicks, we're creating a key/value pair using the td node index and the user click
  $('td').text((index, square) => board[index] = square);


  winningCombos.some(function(combo) {
    position1 = board[combo[0]]
    position2 = board[combo[1]]
    position3 = board[combo[2]]
    comparison_set = JSON.stringify([position1, position2, position3])
    xSet = JSON.stringify(["X","X","X"])
    oSet = JSON.stringify(["O","O","O"])
    // debugger

    if (comparison_set === xSet || comparison_set === oSet) {
      winner = true;
      setMessage(`Player ${position1} Won!`)
    }

  });

  return winner;
}

function doTurn(clickedSquare) {
  turn++
  updateState(clickedSquare);
  checkWinner();

  if (turn > 8){
    setMessage("Tie game.")
    // debugger
  }
}
