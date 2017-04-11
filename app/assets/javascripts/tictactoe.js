var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];

var winStates = [
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
  debugger;
  checkWinner(state);
}

function updateState(target) {
  target.innerHTML = player();
  var i = yCoord * 3 + xCoord;
  state[i] = player();

}

function checkWinner(state) {
  //debugger;
  if (state === undefined || state === ["", "", "", "", "", "", "", "", ""]) {
    return false; 
  }
 // debugger;
 // these lines break everything and I don't know why
 // [0,1,2]
 //that does make sense - so I thought the way I had it written was checking if the state was a win State?
 for (var i = 0; i < winStates.length; i++) {
    if (state[winStates[i][0]] !== "" && state[winStates[i][0]] === state[winStates[i][1]] && state[winStates[i][1]] === state[winStates[i][2]]) {
        message("Player " + player() + " Won!");
        return true; // return breaks out of loops and just returns the value, no more code will  be executed within the function
    }
  }
  return false;
}

function message(input) {
  $('#message').html(input)
}

//it does make sense but i'm not sure why it's still broken, because I think I 
//am iterating through the win states combo on the states variable?


















