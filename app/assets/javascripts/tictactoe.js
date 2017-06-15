var turn = 0
$(document).ready(function() {
    attachListeners();
})

var attachListeners = function() {
  $("tbody").click(function(e) {
    doTurn(e);
    // alert(e)
  });
  $("#previous").click(function(e){
    showGames();
  });
  var action = 0
  $("#save").click(function(e) {
    if ( action == 0 ) {

        saveGame()
        action +=1
    } else {
      updateGame();
    }
  });
  $("#games").click(function(e){
    // debugger;
    var arry = $(e.target).text().split(",")

    $("td").each(function( index ) {
    $(this).text(arry[index]);
    })
  })
}

$('.myClass').click(function() {
  var clicks = $(this).data('clicks');
  if (clicks) {
     // odd clicks
  } else {
     // even clicks
  }
  $(this).data("clicks", !clicks);
});


var saveGame = function() {
  $.ajax({
    url: "/games",
    method: "POST",
    dataType: 'json',
    data: {
      game: {
        state: currentState()
      }
    },
    success: function(msg) {
      currentGame = msg.game.id;
    }
  })
}

var showGames = function(){''
  $('#games').text("")
  $.ajax({
    url: "/games",
    method: "GET",
    dataType: 'json',
    success: function(msg) {
      msg.games.forEach(function(arg){
        $('#games').append("<li " + "data-gameid=" + arg.id +">" + arg.state + "</li>");
      })
    }
  })
}

var updateGame = function(){
  // $.patch("/games/:id")
  $.ajax({
    url: "/games/" + currentGame,
    method: "PATCH",
    dataType: 'json',
    data: {
      game: {
        state: currentState()
      }
    },
    success: function(msg) {
      currentGame = msg.game.id;
    }
  })
}


var doTurn = function(e) {
  updateState(e);
  turn += 1;
  checkWinner();
  checkTie();

};

var checkTie = function(){
  if(turn === 9){
    message("Tie game");
    saveGame();
    resetBoard();
  }
}

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
      saveGame();
      resetBoard();
    } else if(arg === "OOO"){
      message("Player O Won!");
      saveGame();
      resetBoard();
    } else {
      outcome = false;
    }
  })
  return outcome;

}

var resetBoard = function() {
  turn = 0;
  $("[data-x=0]").text("");
  $("[data-x=1]").text("");
  $("[data-x=2]").text("");
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

var currentGame = function() {

}

var currentState = function() {
  var state = []
  $('td').each(function(arg){
    state.push( $(this).text() );
  }  )
  // var state = $("td").map(function(arg) {
  //   return ( $(this).text() )
  // })
  // return "i am here"
  // debugger;
  return state
}

