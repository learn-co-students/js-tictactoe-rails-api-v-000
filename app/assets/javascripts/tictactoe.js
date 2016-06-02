var turn = 0;

var winningCombinations = [
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[0,1],[0,2]],
    [[2,0],[2,1],[2,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[1,1],[0,2]]
  ];


function attachListeners(){
    $('td').click(function(event){
      doTurn(event);
    })
  }

function doTurn(event){
  checkWinner();
  updateState(event);
  turn += 1;
}

function updateState(event){
    $(event.target).text(player());
}

function player(){
  return (turn % 2) ? "O" : "X";
}

function checkWinner(){}

function message(string) {
  $('#message').text(string);
}

// $('td').on('click', function(event){
//
//   if ($(this).text()==="") {
//
//     $(this).text("X");
//     event.stopPropagation();
// }
//   else {alert("box occupied")}
// });

  // event.stopPropagation();


$('document').ready(function(){

  attachListeners();

  // $.each(winningCombinations[3], function(index, value) {
  //   $('td[data-x=' + value[0] + '][data-y=' + value[1] + ']').text("O");
  // });
  //
  // var playerarray = ["X", "O"]
  // $.map(playerarray, function(playerValue, playerIndex) {
  //   $.each(winningCombinations, function(wcIndex, winValue) {
  //     if (
  //           $('td[data-x=' + winValue[0][0] + '][data-y=' + winValue[0][1] + ']').text() === playerValue &&
  //           $('td[data-x=' + winValue[1][0] + '][data-y=' + winValue[1][1] + ']').text() === playerValue &&
  //           $('td[data-x=' + winValue[2][0] + '][data-y=' + winValue[2][1] + ']').text() === playerValue)
  //
  //           { $('#message').text(playerValue + " won");}
  //   });
  // });

  // $.each(winningCombinations, function(index, value) {
  //   if (
  //         $('td[data-x=' + value[0][0] + '][data-y=' + value[0][1] + ']').text() === "X" &&
  //         $('td[data-x=' + value[1][0] + '][data-y=' + value[1][1] + ']').text() === "X" &&
  //         $('td[data-x=' + value[2][0] + '][data-y=' + value[2][1] + ']').text() === "X")
  //
  //         { $('#message').text("X won");}
  // });



// $('td[data-x=' + value[0] + '][data-y=' + value[1] + ']').text("X");

// value is a winning combination
// comprised of three arrays
// each array corresponds to a cell


});
