"use strict";

$(document).ready(function(){

  var $cells=$('td');
  var $playerTurn = 'X';
  var $win=false;

  $cells.click(function(){
    //if gameover or one player won, restart
    if(gameover() || $win) {
      restart();
    }

    //Do not allow placing mark if cell is already marked
    if($(this).text()!=='') {
      alert('Please make another choice, this cell is already marked.');
      return;
    }

    //place the mark
    $(this).html($playerTurn);
    //after mark is placed, check if game is over
    if(gameover()) {
      $('#message').text('Game Over!');
    }
    //or if someone won
    if(checkForWin()) {
      console.log('inside winning statement'+checkForWin());
      $('#message').text('player ' + $playerTurn + ' won!');
      $win=true;
    }

    //change turn
    $playerTurn = ($playerTurn ==='X') ? 'O' : 'X';
  });

  //if restart button is clicked restart.
  $('.restart').click(function(){
    restart();
  });

  function checkForWin() {
    return (horizontalWin() || verticalWin() || diagonalWin());
  }

  function horizontalWin() {
    return ($('[data-x="0"][data-y="0"]').text()===$playerTurn && $('[data-x="1"][data-y="0"]').text()===$playerTurn && $('[data-x="2"][data-y="0"]').text()===$playerTurn) ||
           ($('[data-x="0"][data-y="1"]').text()===$playerTurn && $('[data-x="1"][data-y="1"]').text()===$playerTurn && $('[data-x="2"][data-y="1"]').text()===$playerTurn) ||
           ($('[data-x="0"][data-y="2"]').text()===$playerTurn && $('[data-x="1"][data-y="2"]').text()===$playerTurn && $('[data-x="2"][data-y="2"]').text()===$playerTurn);
  }

  function verticalWin() {
    return ($('[data-x="0"][data-y="0"]').text()===$playerTurn && $('[data-x="0"][data-y="1"]').text()===$playerTurn && $('[data-x="0"][data-y="2"]').text()===$playerTurn) ||
           ($('[data-x="1"][data-y="0"]').text()===$playerTurn && $('[data-x="1"][data-y="1"]').text()===$playerTurn && $('[data-x="1"][data-y="2"]').text()===$playerTurn) ||
           ($('[data-x="2"][data-y="0"]').text()===$playerTurn && $('[data-x="2"][data-y="1"]').text()===$playerTurn && $('[data-x="8"][data-y="2"]').text()===$playerTurn);
  }

  function diagonalWin() {
    return ($('[data-x="0"][data-y="0"]').text()===$playerTurn && $('[data-x="1"][data-y="1"]').text()===$playerTurn && $('[data-x="2"][data-y="2"]').text()===$playerTurn) ||
           ($('[data-x="2"][data-y="0"]').text()===$playerTurn && $('[data-x="1"][data-y="1"]').text()===$playerTurn && $('[data-x="0"][data-y="2"]').text()===$playerTurn);
  }

  function gameover() {
    var gameover=true;
    for(var i=0; i<$cells.length; i++) {
      if($($cells[i]).text()===''){
        gameover=false;
      }
    }
    return gameover;
  }

  function restart() {
    for(var i=0; i<$cells.length; i++) {
      $($cells[i]).html('');
    }
    $win=false;
    $('#message').text('');
  }

});
