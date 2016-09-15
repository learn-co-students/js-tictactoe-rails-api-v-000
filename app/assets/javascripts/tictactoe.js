var turn = 0;

const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ];

function setFixtures() {
    
}

function doTurn(e) {
  
  console.log("doTurn fired. Turn: "+turn);
  console.log("It is player " + player() +"'s turn");
  updateState(e);
  checkWinner();
  turn++;
}

function checkWinner() {
  var board = $('td').map(function() {
                 return $(this).text();
              }).get();
  $.each(WIN_COMBINATIONS, function(index, combo) {
    (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != "") ? message(board[combo[0]]) : console.log("no win");
  })
}

function updateState(e) {
  var x = e.data("x");
  var y = e.data("y");
  $('td[data-x="' + x + '"][data-y="'+ y +'"]').append(player);
  return player;
}

function player() {
  return (turn % 2 === 0) ? 'X' : 'O';
}

function message(player) {
  $('#message').append("Player " + player + "wins!");
}



function attachListeners() {
  $('td').on('click', function(e) {
    doTurn($(this));
  });
  $('#save').on('click', function() {
    console.log('saved!');
  })
  $('#previous').on('click', function() {
    console.log('displaying previous games')
  })
}



$(document).ready(function(){
    attachListeners();
});