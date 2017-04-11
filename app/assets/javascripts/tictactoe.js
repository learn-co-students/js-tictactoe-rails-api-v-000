var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];

var winningStates = [
  [0, 1, 2], 
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

$(document).ready( function() {
   attachListeners();
});
  
function attachListeners() {
  $("table").on("click", "td",  function(e){
    target = e.target
    xCoord = parseInt(target.attributes['data-x']['nodeValue']);
    yCoord = parseInt(target.attributes['data-y']['nodeValue']);
    doTurn(target)
  });

  $('#save').on("click", function() {
    //make AJAX request to post '/games'
  })

  $('#previous').on("click", function() {
    //make AJAX request to get '/games'
  })
}

function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function doTurn(target) {
  if (target.innerHTML === "") {
    updateState(target);
    turn++;
  } else {
    alert("That spot is occupied.")
  }
  checkWinner(state);
}

function updateState(target) {
  target.innerHTML = player();
  var i = yCoord * 3 + xCoord;
  state[i] = player();

}

function checkWinner(state) {
  if (state === undefined) {
    return false; 
  }
  /* these lines break everything and I don't know why
 for (var i = 0; i < 8; i++) {
    if (state[winStates[i][0]] !== "" && state[winStates[i][0]] === state[winStates[i][1]] && state[winStates[i][1]] === state[winStates[i][2]]) {
        message(`Player ${state[winStates[i][0]]} has won!`);
    }
  }
  */
}

function message(input) {
  $('#message').html(input)
}



















