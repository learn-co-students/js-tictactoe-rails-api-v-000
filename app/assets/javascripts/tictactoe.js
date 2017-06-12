'use strict'

const winningCombos = [
                      [[0,0],[1,0],[2,0]],
                      [[0,1],[1,1],[2,1]],
                      [[0,2],[1,2],[2,2]],
                      [[0,0],[1,1],[2,2]],
                      [[0,0],[0,1],[0,2]],
                      [[2,0],[2,1],[2,2]],
                      [[1,0],[1,1],[1,2]],
                      [[2,0],[1,1],[0,2]]
                      ];

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
  updateState(x,y)
  checkWinner()
  turn += 1
}

function updateState (x,y) {
  $(`[data-x=${x}][data-y=${y}]`).html(player())
}

function checkWinner () {

}

function checkBoard () {
  return $('td').map(function() {
    return this.innerHTML
  }).toArray();
}

function player() {
  if(turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}
