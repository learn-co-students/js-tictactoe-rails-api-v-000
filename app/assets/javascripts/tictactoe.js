$(document).ready(function(){
  doTurn();
});

function attachListeners() {

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

function updateBoard() {
  var num = 1;
  $("td").click(function(){
    if($(this).html() == '' && (num % 2 == 0)) {
       $(this).text("X");
    } else if ($(this).html() == '' && (num % 2 != 0)){
       $(this).text("O");
    } else {
      alert("This position is taken.");
    }
    checkWinner();
    if(num == 9) {
      alert("Cats Game!");
    };
    num += 1;
  });
}

function checkWinner() {
  if($("#one").html() == "X" && $("#two").html() == "X" && $("#three").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#four").html() == "X" && $("#five").html() == "X" && $("#six").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#seven").html() == "X" && $("#eight").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#one").html() == "X" && $("#four").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#two").html() == "X" && $("#five").html() == "X" && $("#eight").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#three").html() == "X" && $("#six").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#one").html() == "X" && $("#five").html() == "X" && $("#nine").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#three").html() == "X" && $("#five").html() == "X" && $("#seven").html() == "X") {
    alert("X Wins!")
    reset();
  } else if($("#one").html() == "O" && $("#two").html() == "O" && $("#three").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#four").html() == "O" && $("#five").html() == "O" && $("#six").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#seven").html() == "O" && $("#eight").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#one").html() == "O" && $("#four").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#two").html() == "O" && $("#five").html() == "O" && $("#eight").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#three").html() == "O" && $("#six").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#one").html() == "O" && $("#five").html() == "O" && $("#nine").html() == "O") {
    alert("O Wins!")
    reset();
  } else if($("#three").html() == "O" && $("#five").html() == "O" && $("#seven").html() == "O") {
    alert("O Wins!")
    reset();
  } 
}

function boardFull() {
}

function message() {

}



















