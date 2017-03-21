var turn = 0;
var winCombinations = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
var board = [[,,], [,,], [,,]]

//TODO: work out checkWinner logic
var checkWinner = function() {
//   for(let row=0; row<8; row++) {
//     for(let col=0; col<3; col++) {
//       $('[data-x="' + row + '"][data-y="' + col + '"]').html()
//       // console.log($('[data-x="' + row + '"][data-y="' + col + '"]').html());
//       // console.log(board[row][col]);
//     }
//   }
   return false;
}

// TODO: workout checkTie logic
// var checkTie = function() {
//   return false;
// }

var player = function() {
  if(turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

var updateState = function(event) {
   $(event.target).html(player());
//
// //TODO: update board with new position
// //  debugger;
// //  board[row][col] = $(event.target).html();
}

var message = function(message) {
  $("#message").html(message);
}
var doTurn = function(event) {
  if(checkWinner()) {
    console.log("winner or tie");
  } else {
    turn++;
    updateState(event);
    debugger;
  }
}

var attachListeners = function() {
    $("tbody").click(function(event) {
        doTurn(event);
    });
}

$(function() {
  attachListeners();
});

// $("tbody").find('td').click(function(event) {
//     col = $(this).index();
//     $("tbody").find('tr').click(function(event) {
//         row = $(this).index();
//     });
// });
