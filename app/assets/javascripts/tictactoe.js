// Code your JavaScript / jQuery solution here
  var turn = 0;

  function player(){
    if(turn % 2 === 0){return "X"}
    else{return "O"}
  }
  
  function updateState(square){
    var x = $(square).data("x");
    var y = $(square).data("y");
    $('td[data-x = "' + x + '"][data-y = "'+ y +'"]').text(player());
    turn++;
  }

$(function(){
  $("td").on('click', function(){
    updateState(this);
  });

});