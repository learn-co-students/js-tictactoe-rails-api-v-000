// Code your JavaScript / jQuery solution here
var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
window.turn = 0
var player = () => window.turn % 2 ? 'O' : 'X';  //0 is falsy, X for even turn count

$(document).ready(function() {
  attachListeners();
});

function updateState(spot){
  let token = window.player()
  $(spot).text(token)
}

function setMessage(string){
  $('#message').text(string)
}

function checkWinner(){
  const spots = $('td')
  let won = false
  for (const el of WINNING_COMBOS){
    if ((spots[el[0]].innerHTML!== '') && (spots[el[0]].innerHTML === spots[el[1]].innerHTML) && (spots[el[1]].innerHTML === spots[el[2]].innerHTML)) {
      setMessage(`Player ${spots[el[0]].innerHTML} Won!`)
      won = true
    }
  }
  return won
}

function doTurn(spot){
  updateState(spot)
  window.turn += 1
  if (checkWinner()) {
    window.turn = 0
    $('td').text('')
  }
  if (window.turn === 9){
    if (!checkWinner()) {setMessage('Tie game.')}
    window.turn = 0
    $('td').text('')
  }
}

function attachListeners(){
  $('td').on('click',function(e){
      if (!$.text(this) && !checkWinner())
      doTurn(this)
  })

  $('#save').on('click', () => save())
  $('#previous').on('click', () => previous())
  $('#clear').on('click', () => clear())

}

function previous(){
  $.get('/games', function(data){
    console.log(data)
  })
}


function save(){
 $.post('/games', function(data){
   console.log(data)
 })
}


function clear(){
  $.get('/games', function(data){
    console.log(data)
  })
}







//
