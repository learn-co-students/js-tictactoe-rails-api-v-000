var turn = 0;
var winningCombos = [
  [$('td')[0], $('td')[1], $('td')[2]],
  [$('td')[3], $('td')[4], $('td')[5]],
  [$('td')[6], $('td')[7], $('td')[8]],
  [$('td')[0], $('td')[3], $('td')[6]],
  [$('td')[1], $('td')[4], $('td')[7]],
  [$('td')[2], $('td')[5], $('td')[8]],
  [$('td')[0], $('td')[4], $('td')[8]],
  [$('td')[2], $('td')[4], $('td')[6]],
]

$(document).ready( function() {
   attachListeners();
});
  
function attachListeners() {
  $("table").on("click", "td",  function(e){
    target = e.target
    //xCoord = $(target).attr('data-x');
    //yCoord = $(target).attr('data-y');
    //point = [parseInt(xCoord), parseInt(yCoord)]
    console.log(target);
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
  checkWinner();
  if ($(target).html() === "") {
    updateState(target);
    turn++;
  } else {
    alert("That spot is occupied.")
  }
}

function updateState(target) {
//  $(target).html() = player();
}

function checkWinner() {
  for (var i = 0; i < 9; i++) {
    if (winningCombos[i][0].innerHTML != "") {
      if (winningCombos[i][0].innerHTML === winningCombos[i][1] && winningCombos[i][1] === winningCombos[i][2]) {
        token = winningCombos[i][0].innerHTML
        message(`Player ${token} has won!`);
        break;
      }
    }
  }
  return false; 
}

