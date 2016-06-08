$(document).ready(function() {
    console.log("ready!");
    attachListeners();
});

var turn = 1;

var winningCombos = [
[ [0,0], [1,0], [2,0] ], 
[ [0,1], [1,1], [2,1] ],
[ [0,2], [1,2], [2,2] ],
[ [0,0], [1,1], [2,2] ],
[ [0,0], [0,1], [0,2] ],
[ [2,0], [2,1], [2,2] ],
[ [1,0], [1,1], [1,2] ],
[ [2,0], [1,1], [0,2] ]
]

var xMoves = []
var oMoves = []


var attachListeners = function(){
  $('td').on('click', function(event){
    if($(event.target).html().length == 0) {
      doTurn(event);
    } 
  });
};

var doTurn = function(event){
  updateState(event);
  turn += 1;
  checkWinner();
};

var player = function() {
  if(turn % 2 === 0){
    return "X";
} else {
    return "O";
  }
}

var updateState = function(event){
  $(event.target).html(player());
} 

var message = function(message) {
  $('#message').append(message)
};


var checkWinner = function(){
  $.each(winningCombos, function(i, combo){
    var winner = checkBoard(combo)
    if(winner){
      message("Player " + winner + " Won!")
    }
  })
  return false
}

var checkBoard = function(combo){
  var board = combo.map(function(arr){
    return $('[data-x=' + arr[0] + '][data-y=' + arr[1] + ']').text();
  });
  var xWin = board.every(function(token){
    return token == "X";
  });
  var oWin = board.every(function(token){
    return token == "O";
  });
  if(xWin){
    return "X"
  } else if(oWin){
    return "O"
  } else {
    return false
  }
}



// ['toElement']['dataset']