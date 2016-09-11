$(document).ready(function() {
  attachListeners();
}
);
var all = ["","","","","","","","",""];
var turn = 0;
var COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];


function mult(one, two) {
  var final = [0,0,0,0,0,0,0,0,0];
  final[0] = one[0] * two[0];
  final[1] = one[0] * two[1];
  final[2] = one[0] * two[2];
  final[3] = one[1] * two[0];
  final[4] = one[1] * two[1];
  final[5] = one[1] * two[2];
  final[6] = one[2] * two[0];
  final[7] = one[2] * two[1];
  final[8] = one[2] * two[2];
  return final.indexOf(1);
}


function attachListeners() {
$('td').on('click', function(e) {
  doTurn(e);
});

}

function doTurn(event) {

    updateState(event);
    checkWinner(event);
    turn++;

}

function isEven(num) {
  return num%2 == 0;
}

function player() {
  return isEven(turn) ? "X" : "O";
}

function updateState(event) {
  var matrix1 =  [0,
                  0,
                  0];
  var matrix2 = [0,0,0];

  matrix1[event.target.attributes[0].value] = 1;
  matrix2[event.target.attributes[1].value] = 1;
  all[mult(matrix1,matrix2)] = player();
  $(event.target).text(player());

}

function checkWinner(event) {
  var mess = "";
  COMBOS.forEach(function(x){

      if (all[x[0]] == "X" && all[x[1]] == "X" && all[x[2]] == "X") {
all = ["","","","","","","","",""];
        mess = "Player X Won!";
        turn = 0;
        $('td').html("");

      }
      else if (all[x[0]] == "O" && all[x[1]] == "O" && all[x[2]] == "O") {
all = ["","","","","","","","",""];
        mess = "Player O Won!";
        turn = 0;
        $('td').html("");
      } else if (turn == 9) {
        mess = "Tie game";
        turn = 0;
        $('td').html("");
      }
  });
  if (mess == "") {
    return false;
  } else {
      message("Player X Won!");
      return true;
    }

}

function message(string) {
  $('#message').html(string);
  return string;
}
