var turn = 0

$(function(){

  attachListeners();

});

function attachListeners(){
  $('table').on('click', 'td', function(e){
    doTurn(e);
  })
};

function doTurn(event){
  turn += 1;
  updateState(event);
  checkWinner();
};

function updateState(event){
  $(event.target).text(player());
};

function checkWinner(){

};

function player(){
  if(turn % 2 === 0){
    return "X";
  }
  else {
    return "O";
  }
};

function updateState(){

};

function checkWinner(){

};

function message(){

}

