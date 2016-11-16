
$(document).ready(function(){
  attachListeners();
});

var turn = 0;
var wins = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function attachListeners(){
  $('td').on('click', function(event) {
    doTurn(event);
  });
};

function doTurn(event){
  turn += 1;
  updateState();
  checkWinner();
};

function checkWinner(){
  var box_values = []
  var boxes = document.getElementsByTagName('td');
  for (var i = 0; i < boxes.length; i++) {
    box_values.push(boxes[i].innerHTML)
  };
  for(var i = 0; i < wins.length; i++){
    var a = box_values[wins[i][0]];
    var b = box_values[wins[i][1]];
    var c = box_values[wins[i][2]];

    if(a == b && a == c && a != 0){
      var winner = 'Player ' + a + ' Won!';
      message(winner);
    }
  }
};

function updateState(){
  var move = player();
  $(event.target).text(move);
};

function player(){
  if ((turn % 2) == 0) {
    return "X";
  } else {
    return "O";
  }
};

function message(string){
  $('#message').html(string);
};
