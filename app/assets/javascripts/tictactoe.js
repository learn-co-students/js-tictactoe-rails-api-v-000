// Code your JavaScript / jQuery solution here
var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
window.turn = 0
var player = () => window.turn % 2 ? 'O' : 'X';  //0 is falsy, X for even turn count
var currentGame = 0  //id of currentgame in db, 0 (falsy) for non saved games

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
    saveGame()
    clearGame()
  }
  if (window.turn === 9 && !checkWinner()){
    {setMessage('Tie game.')}
    saveGame()
    clearGame()
  }
}

function attachListeners(){
  $('td').on('click',function(e){
      if (!$.text(this) && !checkWinner())
      doTurn(this)
  })

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => previousGame())
  $('#clear').on('click', () => clearGame())

}

function previousGame(){
  $.get('/games', function(data){
    if (data.data){
      $('div#games').empty()
      for (const game of data.data){
         $('div#games').append(`
          <button id=gameid-${game.id}> Game ${game.id} </button>
          `)
          $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
      }
    }
  })
}

function loadGame(id){
  $.get('/games/' + id, function(game){
    let arr = game.data.attributes.state
    currentGame = game.data.id
    window.turn = arr.filter(Boolean).length
    for (let i=0; i<9; i++){
      $('td')[i].innerHTML = arr[i]
    }
  })
}


function saveGame(){
  let gamedata = {state: []}
  for (const el of $('td')){
    gamedata.state.push(el.innerText)
  }
  if (currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gamedata
    });
  }
  else{
   $.post('/games', gamedata, function(data){
     currentGame = data.data.id
     $('div#games').append(`
      <button id=gameid-${currentGame}> Game ${currentGame} </button>
      `)
      $(`#gameid-${currentGame}`).on('click', () => loadGame(currentGame));
   })

  }
}

function clearGame(){
    currentGame = 0
    window.turn = 0
    $('td').text('')
}
