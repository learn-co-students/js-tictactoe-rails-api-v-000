let turn = 0
let currentGame = 0

//attachListeners
$(function(){
  attachListeners()
})

//////// begin attachedListeners ///////////
function attachListeners(){
  $("td").click(function(event) {
    doTurn(event.target)
  })

    //set board on load
    $('body').on('load', function(){
      turn = 0
      currentGame = 0

    })

    //new game
    $("button#new").click(function(e){
      turn = 0
      currentGame = 0

      $('td').html('')
      $('#games').html('')
      setMessage("Make your move!")
    })
      
    //button save game
    $("button#save").click(function(e){
      saveGame(e.target)
    })
      
    //button show previous game buttons
    $("button#previous").click(function(e) {
      $.get('/games', function(response){
        let games = response.data
        $('div#games').html('')
        for(let i = 0; i < games.length;i++){          
          $('div#games').append(`<button class='saved-game' data-id=${games[i].id}>Game no: ${games[i].id}</button><br>`)
        }
        if(response.data.length === 0){
          $('div#message').html("There are no previoius games to load.") 
        }else{
          $('div#message').html("Previous games loaded.") 
        }
      })
    })
      
    //button clear game
    $("button#clear").click(function(event) {
      $('td').html('')
      turn = 0
      $('div#message').html('Start a new game.') 
      $('div#game').html('')
      currentGame = 0

    })

    //button reset DB
    $("button#reset").click(function(e){
      $.get('/reset', function(response){
        $('div#game').html('')
        setMessage('Database reset')
        currentGame = 0
  
        console.log(response)
      })
    })

    //listen button, load saved game
    $('body').on('click', 'button.saved-game', function(e){
      $.ajax({
        type: 'GET',
        url: `/games/${this.dataset.id}`,
        dataType: 'json',
        success: (function (response){
          loadGame(response.data.id)
        })
      })
    })
}  ///////// end attachListeners  ///////////
 
//player
function player(){
  if (turn === 0 || turn % 2 === 0){
    $('div#turn').html(turn)
    return 'X'
  } else {
    $('div#turn').html(turn)
    return 'O'
  }
}

//saveGameHelper: make 'state' array from obj values
function cerealizer(obj){
  let arr = []
  for(i=0;i<obj.length;i++){
    arr.push(obj[i].innerHTML)
  }
  return arr
}

// //saveGame
// function saveGame(){
//   let state = cerealizer($('td'))
//   if(currentGame !== 0 ){
//     $.ajax({
//       type: "PATCH",
//       url: "/games",
//       data: {id: `${currentGame}`, state: state}
//     })
//   } else {
//   $.ajax({
//     type: "POST",
//     url: "/games",
//     data: {state: state}
    
//     })
//   }
// }
  
function saveGame() {
  var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}


//loadGame
function loadGame(gameId){
  $.get(`/games/${gameId}`, function(response){
    for(let i = 0; i < 9; i++){
      $('td')[i].innerHTML = response.data.attributes.state[i]
    }
    currentGame = gameId
    setMessage(`Game ${response.data.id} loaded.`)
  })
}
    
//setMessage
function setMessage(msg){
  $('div#message').html(msg)  
}
//checkWinner
function checkWinner(){ 
  let board = {};
  let winner = false;
  const combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
  [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
  
  $('td').text((index, square) => board[index] = square)
  combos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

//doTurn
function doTurn(e){
  updateState(e)
  turn++
  if (checkWinner()){
    saveGame()
    resetBoard()
  } else if (turn === 9){
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

//updateState
function updateState(e){
  let token = player()
  e.innerHTML = token
}

//resetBoard
function resetBoard(){
  $('td').empty()
  currentBoard = 0
  turn = 0
}
