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

let turn = 0;

function player() {
  if(turn % 2 == 0) {
    turn++
    return "X"
  } else {
    turn++
    return "O"
  };
};

function updateState(square) {
  token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  let winner = false;
  let board = {}
  let token = player();
  $('td').text((x, y) => board[x] = y);
  WINNING_COMBOS.some(function(position){
     if (board[position[0]] !== "" && board[position[0]]  === board[position[1]] && board[position[1]] === board[position[2]]){
       setMessage(`Player ${board[position[0]]} Won!`);
       return winner = true;
     }
   });
   return winner;
};

function doTurn() {

};

function attachListeners() {

};
