$( document ).ready(function() {
    attachListeners();
});

var turn = 0 

function attachListeners(){
  //get the data-x and data-y values of the clicked square 

  $('td').on("click", function() {
    var x_value = ($(this).data('x'));
    var y_value = ($(this).data('y'));
    var selector =  `[data-x=${x_value}][data-y=${y_value}]`  // per spec format
      doTurn(selector);
    });
};

function doTurn(selector){
  updateState(selector);
  turn += 1 ;
  console.log(turn)
  checkWinner();
}


function player(){
  // even turns are 0, 2, 4....game starts on zero and an X
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }

}

function isEven(turn) {
   return turn % 2 == 0;
}

function updateState(selector){
  var selector = selector
  $(selector).html(player());
}

function checkWinner(){
 if (horizontalCheck() === "false" && verticalCheck() === "false" && diagnolCheck()=== "false" && fullBoard() === "true"){
    message("Tie game") }
 else if (horizontalCheck() === "true" || verticalCheck() === "true" || diagnolCheck()=== "true") {
    turn -= 1   // de-crementing the last turn so we can get the winning mark 
    message("Player " + player() + " Won!")
 } else {
  return false
 }
}

function horizontalCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[1].innerHTML === "X" && $('td')[2].innerHTML === "X" ||
       $('td')[3].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[5].innerHTML === "X" || 
       $('td')[6].innerHTML === "X" && $('td')[7].innerHTML === "X" && $('td')[8].innerHTML === "X" ||
       // check the O's for the same 
       $('td')[0].innerHTML === "O" && $('td')[1].innerHTML === "O" && $('td')[2].innerHTML === "O" ||
       $('td')[3].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[5].innerHTML === "O" || 
       $('td')[6].innerHTML === "O" && $('td')[7].innerHTML === "O" && $('td')[8].innerHTML === "O" )
  {
       return "true"
  } else {
       return "false"
  }
}

function verticalCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[3].innerHTML === "X" && $('td')[6].innerHTML === "X" ||
       $('td')[1].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[7].innerHTML === "X" || 
       $('td')[2].innerHTML === "X" && $('td')[5].innerHTML === "X" && $('td')[8].innerHTML === "X" ||
       // check the O's for the same 
       $('td')[0].innerHTML === "O" && $('td')[3].innerHTML === "O" && $('td')[6].innerHTML === "O" ||
       $('td')[1].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[7].innerHTML === "O" || 
       $('td')[2].innerHTML === "O" && $('td')[5].innerHTML === "O" && $('td')[8].innerHTML === "O" )
  {
       return "true"
  } else {
       return "false"
  }
}

function diagnolCheck(){
  if ( $('td')[0].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[8].innerHTML === "X" || 
       $('td')[2].innerHTML === "X" && $('td')[4].innerHTML === "X" && $('td')[6].innerHTML === "X" ||
       // check the O's for the same
       $('td')[0].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[8].innerHTML === "O" || 
       $('td')[2].innerHTML === "O" && $('td')[4].innerHTML === "O" && $('td')[6].innerHTML === "O" )
  {
      return "true"
  } else {
      return "false"
  }
}

function fullBoard() {
  if ( $('td')[0].innerHTML === "" || $('td')[1].innerHTML === "" ||
       $('td')[2].innerHTML === "" || $('td')[3].innerHTML === "" ||
       $('td')[4].innerHTML === "" || $('td')[5].innerHTML === "" ||
       $('td')[6].innerHTML === "" || $('td')[7].innerHTML === "" ||
       $('td')[8].innerHTML === "" ){
    return "false"
  } else {
    return "true"
  }
}


function message(comment){
  $("#message").html(comment)
  boardWipe();
}

function boardWipe(){ 
  turn = 0
  $("td").each(function() {
    ($(this).html("")
  )});
}
