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
  $(selector).html(player())
  checkWinner();
}

function checkWinner(){

}

function horizontalCheck(){
  if ( $('td')[0].innerHTML === "X" ){
    console.log ("First step working")
  }
}


function turn(){

}

function message(){

}
