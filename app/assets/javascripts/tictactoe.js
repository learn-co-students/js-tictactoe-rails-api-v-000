// Code your JavaScript / jQuery solution here

var turn = 0;

var currentGame = 0;

WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]
];

 function player() {
   return turn % 2 === 0 ? "X" : "O"
 };


 function updateState(square) {
   let token = player()
   $(square).text(token);
 };

 function setMessage(message) {
   $("#message").text(message)
 };



 function checkWinner() {
   var board = {};
   var winner = false;

   $('td').text((index, square) => board[index] = square);

   WIN_COMBOS.forEach(function(index) {
     if (board[index[0]] === board[index[1]] && board[index[1]] === board[index[2]] && board[index[0]] !== "") {
       setMessage(`Player ${board[index[0]]} Won!`);
       return winner = true;
     }
   });
   return winner;
 }


 function doTurn(square) {
   updateState(square)
   turn ++
   checkWinner()
   setMessage("Tie game.")
 };
