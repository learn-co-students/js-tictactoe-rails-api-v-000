$(document).ready(function(){
  updateBoard();
});

function attachListeners() {
  $('td').click(function(event) {
    updateBoard(event);
  });
  $('#games').click(function(event) {
    getGame(getGameId(event))
  });
  $('#save').click(function(){
    save();
  });
  $('#previous').click(function(){
    getAllGames();
  });
}

function doTurn() {
  updateBoard();
}

// function player(num) {
//   if(num % 2 == 0) {
//     $(this).text('O');
//   } else {
//     $(this).text('X');
//   }
// }
var num;
var gameCount = 0;

function updateBoard() {
  num = 1;
  $("td").on("click", function(){
    if($(this).html() == '' && (num % 2 == 0)) {
       $(this).text("X");
       num += 1;
    } else if ($(this).html() == '' && (num % 2 != 0)){
       $(this).text("O");
       num += 1;
    } else {
      alert("This position is taken.");
    }

    checkWinner();

    if (num == 10) {
      alert("Cats Game!");
      $("table td").empty();
      num = 1;
      displayCount();
    }
  });
}

function displayCount() {
  gameCount++;
  $('#games').append("<ul><li>" + gameCount + "</li></ul>");
}

function checkWinner() {
  if($("#one").html() == "X" && $("#two").html() == "X" && $("#three").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#four").html() == "X" && $("#five").html() == "X" && $("#six").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#seven").html() == "X" && $("#eight").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#one").html() == "X" && $("#four").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#two").html() == "X" && $("#five").html() == "X" && $("#eight").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#three").html() == "X" && $("#six").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#one").html() == "X" && $("#five").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#three").html() == "X" && $("#five").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#one").html() == "O" && $("#two").html() == "O" && $("#three").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#four").html() == "O" && $("#five").html() == "O" && $("#six").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#seven").html() == "O" && $("#eight").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#one").html() == "O" && $("#four").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#two").html() == "O" && $("#five").html() == "O" && $("#eight").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#three").html() == "O" && $("#six").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#one").html() == "O" && $("#five").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();

  } else if($("#three").html() == "O" && $("#five").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    $("table td").empty();
    num = 1;
    displayCount();
  } 
}

function message() {

}





















