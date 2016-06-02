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
  updateState(event);
  checkWinner();
  turn += 1;
}

function updateState(event){
    $(event.target).text(player());
}
//
function player(){
  return (turn % 2) ? "O" : "X";
}

function checkWinner(){
  var tie = $('td').filter(function(index, char){return $(char).text() === ""});
  var winner = winningCombinations.filter(function(combo) {
  return ($('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text() === player());
  });
  if (tie.length === 0)
  //   var tie = $('td').filter(function(index, char){return $(char).text() === ""});
  //   if (tie.length === 0)
       {message("Tie game")}
  else if (winner.length > 0) { message("Player " + player() + " Won!"); return true}
  else { return false;}
}


  // if (winner.length > 0) { $('#message').text("There's a winner"); return true} else { $('#message').text("no one won"); return false;}

//
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




});
