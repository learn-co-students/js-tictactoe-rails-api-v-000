'use strict'

const  winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
let turn = 0
let currentGame = 0

$(() => {
  attachListeners()
})

const attachListeners = function () {
  $('td'').on('click', function(data) {
    doTurn($(this).data('x'), $(this).data('y'));
  })
  $('#previous').on('click', function () {
    getAllGames()
  })
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
  let winner = false;
  let board = checkBoard ();
  const resetBoard = () => {
    turn = -1
    $('td').html("")
  }
  winningCombos.forEach(function(position) {
    if (board[position[0]] == board[position[1]] && board[position[1]] == board[position[2]] && board[position[0]] != ""){
      winner = true
    }
  })
  if (winner === true) {
    message(`Player ${player()} Won!`)
    resetBoard()
  } else if (turn === 8) {
    message('Tie game')
    resetBoard()
  } else {
    return false
  }
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

function message (message) {
  $('#message').html(message)
}

function getAllGames () {
  $.get('/games')
}
