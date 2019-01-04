// Code your JavaScript / jQuery solution here

$(function(){
  attachListeners()
})

const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]

]


var turn = 0
let saved = 0

function player(){
return  turn % 2 === 0 ?  "X" : "O"
}

function updateState(square){
  $(square).text(player())
}

function setMessage(message){
  $("div#message").text(message)
}

function checkWinner(){
winner = false
board = {}
$('td').text((i,sq)=> board[i] = sq)
WINNING_COMBOS.forEach(combo => {
  if(board[combo[0]]=== board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ""){
    winner = true
    setMessage(`Player ${board[combo[0]]} Won!`)
  }

})
return winner
}

function doTurn(move){
  updateState(move)
  if(checkWinner()){
    saveGame()
    $('td').empty()
    turn = 0
  }else if(turn === 8){
    setMessage("Tie game.")
    saveGame()
    $('td').empty()
    turn = 0
  } else{ turn ++}
}

function attachListeners(){
  $('td').click(function(e){
    console.log($.text(this))
    if($.text(this) === ""&& checkWinner()=== false){
      doTurn(this)
    }
  })

  $('#previous').on('click', function(){
    previousGames()
  })

  $('#save').on('click', function(){
    saveGame()
  })

  $('#clear').on('click', function(){
    clearGame()
  })

}

function previousGames(){

  $.get('/games', function(e){
    $('#games').empty()
    e.data.forEach(function(g){
      $('#games').append(`<button id = "${g.id}">${g.id}</button>`)
      $(`#${g.id}`).on('click', function(){
        loadGame(g.id)
      })

    })
  })
}

function loadGame(id){
  $.get(`/games/${id}`, function(game){
    saved = id
    let counter = 0
    let state = game.data.attributes.state
    turn = $.grep(state, function(n, i){ return n !== ""}).length
    $.each($('td'), function(index,space){
      console.log($('td'))
      space.innerHTML = state[counter]
      counter++
    })

  })
}

function gameState(id){
  var h = $.get(`/games/${id}`)
  console.log(h)
}

function saveGame(){
  let state = []
  $('td').text(function(index,square){
    state.push(square)
  })
  if(saved){
    $.ajax({
      url : `/games/${saved}`,
      data: {id: saved, state: state},
      type: 'PATCH'
    })
  }else{
  $.post('/games', {state: state}, function(game){
    saved = game.data.id
  })

}
}

function clearGame(){
  saved = 0
  turn = 0
  $('td').empty()
}
