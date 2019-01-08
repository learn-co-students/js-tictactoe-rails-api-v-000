// Code your JavaScript / jQuery solution here

var turn;

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


var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
                        
function checkWinner() {
  var winner = false;
  const board = $("td").map(function() { return $(this).html() }).toArray();

  
  winningCombos.some(function(combo) {
    
  });
  
  return winner;
}


// def won?(board) ----> from the ruby TICTACTOE


//   WIN_COMBINATIONS.each do |win_combo|
//       position1 = board[win_combo[0]]
//       position2 = board[win_combo[1]]
//       position3 = board[win_combo[2]]
//       comparison_set = [position1, position2, position3]

//       if comparison_set == ["X","X","X"] || comparison_set == ["O","O","O"]
//           return win_combo
//       else
//         next
//       end
//     end
//   false
// end


