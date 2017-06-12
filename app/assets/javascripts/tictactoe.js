var turn = 0
var currentGame = 0

const winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

var player = () => {
  return (turn % 2 == 0)? 'X' : 'O'
}

var attachListeners = () => {
  $('td').click(function(e) {
    doTurn(e)
  })

  $('#previous').click(function(e){
    getGames()
  })

  $('#save').click(function(e){
    saveGame()
  })
}

var tie = function() {
  if (turn == 8) {
    message("Tie game")
    return true
  } else {
    return false
  }
}

var doTurn = e => {
  // if (e.currentTarget.innerHTML == ""){
    updateState(e)
    if (checkWinner() || tie()) {
      saveGame()
      resetBoard()

    } else {
      turn += 1
    }
    // if (turn === 8){
    //   console.log('tie game')
    //   message('Tie game')
    // }
  // } else {
  //   message('This cell is taken')
  // }
}
  // updateState(e)
  // if (checkWinner() || turn === 9 {
  //   saveGame()
  //   resetBoard()
  // })
  // else {turn += 1}
// }

var updateState = e => {
  $(e.target).html(player())
}

var getState = () => {
  var $state = []
  $('td').each((index, value) => {$state.push(value.innerText)})
  return $state
}

var checkWinner = () => {
  var result = false
  var current = player()
  var $state = getState()
  $.each(winningCombos, (index, value) => {
    if ($state[value[0]] == current && $state[value[1]] == current && $state[value[2]] == current) {
      let winner = $state[value[0]]
      message('Player ' + winner + ' Won!')
      saveGame()
      resetBoard()
      result = true
    }
  })
  return result
}

var saveGame = function(resetCurrentGame) {
  var url
  var method

  if(currentGame) {
    console.log("patch request")
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    console.log("post request")
    url = "/games"
    method = "POST"
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: { game: { state: getState() } },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

// var saveGame = (resetCurrentGame) => {
//   var url, method
//     if (currentGame) {
//       console.log('post request')
//       url = '/games/' + currentGame
//       method: 'PATCH'
//     } else {
//       url = '/games'
//       method = 'POST'
//     }
//
//     $.ajax({
//       url: url,
//       method: method,
//       dataType: "json",
//       data: {
//         game: {
//           state: getState()
//         }
//       },
//       success: function(data) {
//         if(resetCurrentGame) {
//           currentGame = undefined;
//         } else {
//           currentGame = data.game.id;
//         }
//       }
//     })


    //   let obj = {}
    //   obj.game = {}
    //   obj.game.state = getState()
    //   obj.game.turn = turn
    //   $.post('/games', obj)
    //   console.log(obj)
    // } else if (currentGame != 0) {
    //   console.log('patch request')
    //   let obj = {}
    //   obj.game = {}
    //   obj.game.state = getState()
    //   obj.game.turn = turn
    //   console.log(obj)
    //   $.ajax({url: '/games' + currentGame, data: obj, type: 'PATCH'})
    // }
  //}



var resetBoard = () => {
//  saveGame()
  $('td').html('')
  turn = 0
//  currentGame = 0
}

var message = (message) => {
  $('#message').text(message)
}


// Persistence Functions

function getGames() {
  $.ajax({
    url: '/games',
    type: 'GET',
    dataType: 'json'
  }).done(function(res){
    showGames(res.games)
  })
}

function showGames(games) {
  var gamesHTML = $()
  games.forEach(function(game){
    gamesHTML = gamesHTML.add(showGame(game))
  })
  $('#games').html(gamesHTML)
}

function showGame(game){
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

$(() => {
  attachListeners()
})
