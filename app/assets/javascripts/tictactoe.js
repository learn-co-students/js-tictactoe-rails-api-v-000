var turn = 0
$(document).ready(function() {
    attachListeners();
})

var attachListeners = function() {
  $("tbody").click(function(e) {
    doTurn(e);
    // alert(e)
  });
}


var doTurn = function(e) {
  updateState(e);
  checkWinner();
  turn += 1;

};

var updateState = function(e) {
  $(e.target).text(player());
}

var checkWinner = function() {
  var WinningDiagonal1 = [$("[data-x=0][data-y=0]").text(),
                           $("[data-x=1][data-y=1]").text(),
                            $("[data-x=2][data-y=2]").text() ].join("")

  var WinningDiagonal2 = [$("[data-x=2][data-y=0]").text(),
                           $("[data-x=1][data-y=1]").text(),
                            $("[data-x=0][data-y=2]").text() ].join("")

  var combos =  [
                    $("[data-x=0]").text(),
                    $("[data-x=1]").text(),
                    $("[data-x=2]").text(),
                    $("[data-y=0]").text(),
                    $("[data-y=1]").text(),
                    $("[data-y=2]").text(),
                  ]
  combos.push(WinningDiagonal1, WinningDiagonal2);
  var outcome;
  combos.forEach(function(arg) {
    if (arg === "XXX"){
      message("Player X Won!");
    } else if(arg === "OOO"){
      message("Player O Won!");
    } else {
      outcome = false;
    }
  })
  return outcome;

}

var player = function() { 
  if(turn%2 === 0){
    return "X";
  } else{
    return "O";
  }
}

var message = function(str) {
  $("#message").text(str)
}


// var WinningDiagaonal1 = [$("[data-x=0][data-y=0]").text()]
// var WinningDiagaonal2 = ....
// CheckWinners[data-y=0] WinningDiagaonal2, WinningDiagaonal1,


// Checkwinners.each()