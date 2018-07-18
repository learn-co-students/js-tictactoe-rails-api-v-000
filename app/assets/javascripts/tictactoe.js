// Code your JavaScript / jQuery solution here
$( document ).ready(function() {

});//end document.ready

var turn = 1;

const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

//Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function player() {
  var player = ""
  if ((turn % 2) === 0) {
    player = "X"}
  else {
      player = "O"
    }
  return player;
};

//Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(square) {
  var token = player();
  square.innerHTML = token;
}

//Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  $( "#message" ).html(string);
}

//Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
//If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function checkWinner() {
<<<<<<< HEAD
  var board = $("td").get();
  var answer = false;
  var winner = "";
  const board_array = board.map(square => square.innerHTML);
  var test_array = [];

  function checkForX(element){
    return ( (element === "X"));
  }
  function checkForO(element){
    return ( (element === "O"));
  }
=======
  //has to get the current state of the board
  //iterate through board using jquery to grab the html inside each td and create an array of those values
  //compare the board array to the winning combinations
  var board = $("td").each(function() {return $(this)});
  board.forEach(function(square) {
    console.log(element);
  });

  const board_array = board.map(square => square.innerHTML);
>>>>>>> 77558264956fcca0a7b592c7ce365603bcb15a5a

  WIN_COMBINATIONS.forEach(function(combo){ //returns array of winning combinations, ex. [0,1,2]
    combo.forEach(function(index){
      test_array.push(board_array[index]) //push in the value at that index either "X","Y", or ""
    });
    if (test_array.every(checkForX)) {
     answer = true;
     winner = "X"
   } else if (test_array.every(checkForO)) {
      answer = true;
      winner = "O"
    };
    test_array = [];
  });



  var message = `Player ${winner} Won!`
  setMessage(message);
  return answer;
}
