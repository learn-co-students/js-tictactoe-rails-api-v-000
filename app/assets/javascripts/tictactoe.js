$(function(){
  attachListeners()
})

const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
var turn = 0
var currentGame = 0

function player(){
  return turn % 2 ? 'O' : 'X'
}

function updateState(sq){
  $(sq).text(player())
}

function setMessage(msg){
  $('#messages').text(msg)
}

function checkWinner(){
  var winner = false
  board = []
  $('td').text((index, square) => board[index] = square);
  win_combos.some(function(a){
    var wc = []
    a.forEach(function(i){
      wc.push(board[i])
    })
    if (wc[0] !== "" && wc[0] === wc[1] && wc[1] === wc[2])
    //setMessage(`Player ${wc[0]} Won!`)
    return winner = true
  })
  return winner
}

function doTurn(sq){
  ++turn
  updateState(sq)
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}
