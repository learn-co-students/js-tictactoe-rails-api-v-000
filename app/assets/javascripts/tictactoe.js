$(document).ready(function() {
  attachListeners();

}
);
var all = ["","","","","","","","",""];
var turn = 0;
var testing = "";
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
    checkWinner();
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
  //testing = player();
  matrix1[event.target.attributes[0].value] = 1;
  matrix2[event.target.attributes[1].value] = 1;
//  all[mult(matrix1,matrix2)] = player();
  $(event.target).text(player());

}

function checkWinner(event) {
  var finish = false;
  var count = 0;
  var mess = "";

  while (!finish && count < COMBOS.length) {

    if ($('#num-' + COMBOS[count][0]).text() != "" &&  $('#num-' + COMBOS[count][0]).text() == $('#num-' + COMBOS[count][1]).text()  && $('#num-' + COMBOS[count][0]).text() == $('#num-' + COMBOS[count][2]).text() ) {

          var player = $('#num-' + COMBOS[count][0]).text();
            finish = true;
            $('td').html("");

            message("Player " + player + " Won!");
            return true;

          }
        else {
          count++;
          var player2 = $('[data-x="0"][data-y="0"]').text();
          //var player2 = $('#num-0').text();
          message(player2);
        }

      }
      return false;

}

function message(string) {
  $('#message').html(string);
  return string;
}
