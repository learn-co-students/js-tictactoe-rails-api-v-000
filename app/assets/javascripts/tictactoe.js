'use strict'

$(() => {
  attachListeners()
})

let turn = 0

const attachListeners = function () {
  $("td").on('click', function(data) {
    doTurn($(this).data("x"), $(this).data("y"));
  });
}

function doTurn(x,y) {
  turn += 1
  updateState(x,y)
  checkWinner()
}

function updateState (x,y) {
  $(`[data-x=${x}], [data-y=${y}]`).text(player())
}

function checkWinner () {

}

function player() {
  if(turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}
