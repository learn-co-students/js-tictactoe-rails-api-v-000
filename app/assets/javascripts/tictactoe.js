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
  checkWinner();
}


function player(){
  if (turn % 2 === 0 || turn === 0 ){
    return "X"
  } 
    return "O"
  }

function updateState(selector){
  var selector = selector
  $(selector).html(player());
  checkWinner(); 
}

function checkWinner(){
  if (horizontalCheck() === "true" || verticalCheck() == "true" || diagnolCheck() == "true" ){
    if (player() === "O"){
      var winner = "Player X Won!"
      message(winner);
    } else {
      var winner = "Player O Won!"
      message(winner);
    }
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
  if ( $('td')[0].innerHTML === "" && $('td')[1].innerHTML === "" &&
       $('td')[2].innerHTML === "" && $('td')[3].innerHTML === "" &&
       $('td')[4].innerHTML === "" && $('td')[5].innerHTML === "" &&
       $('td')[6].innerHTML === "" && $('td')[7].innerHTML === "" &&
       $('td')[8].innerHTML === "" ){
    return "false"
  } else {
    return "true"
  }
}


function turn (){

}



function message(winner){
  $("#message").html(winner)
}
