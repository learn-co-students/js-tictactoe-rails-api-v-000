// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var turn = 0;

function player() {
  if(turn % 2 == 0) {
    // turn++
    return "X"
  } else {
    // turn++
    return "O"
  };
};

function updateState(square) {
  let token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var winner = false;
  var board = {}
  var token = player();
  $('td').text((x, y) => board[x] = y);
  WINNING_COMBOS.some(function(position){
     if (board[position[0]] !== "" && board[position[0]]  === board[position[1]] && board[position[1]] === board[position[2]]){
       setMessage(`Player ${board[position[0]]} Won!`);
       return winner = true;
     }
   });
   return winner;
};

function doTurn(square) {
  turn++;
  updateState(square);
  if(checkWinner()) {
      $('td').empty();
      turn = 0;
  } else if (turn === 9) {
    $('td').empty();
    turn = 0;
    setMessage("Tie Game.");
  }
};

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });

}
