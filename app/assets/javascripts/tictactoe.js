$(function(){
attachListeners();
});

var currentGame
var turn = 0
var counter = 0

  function attachListeners(event){
    $("table tbody").on('click', function(event){
      var target = event.target
       doTurn(target)
    })

    $("#previous").on('click', function(){
      listGames()
    })

    $("#save").on('click', function(){
      if(counter === 0){
        save()
        counter++
      } else {
        update()
      }
    })

    $("#games").on('click', 'li', function(event){
      load(event)
    })

  }

  function doTurn(event){
    updateState(event)
    if (checkWinner()){
      save()
      reset()
    } else {
      turn += 1
    }
  }

  function updateState(event){
    var token = player()
    $(event).text(token)
  }

  function currentState(){
    var state = []
    $('td').each(function(index, td){
      state.push($(td)[0].innerText)
    })
    return state
  }

  function player(){
    if (turn % 2 == 0 ){
      return "X"
    } else {
      return "O"
    }
  }

  // td0 td1 td2
  // td3 td4 td5
  // td6 td7 td8

  function checkWinner(){
    var td0 = $('td')[0]
    var td1 = $('td')[1]
    var td2 = $('td')[2]
    var td3 = $('td')[3]
    var td4 = $('td')[4]
    var td5 = $('td')[5]
    var td6 = $('td')[6]
    var td7 = $('td')[7]
    var td8 = $('td')[8]

    if(td0.textContent != "" && td0.textContent == td1.textContent && td1.textContent == td2.textContent){
      message("Player " + player() + " Won!")
      return true
    } else if(td3.textContent != "" && td3.textContent == td4.textContent && td4.textContent == td5.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td6.textContent != "" && td6.textContent == td7.textContent && td7.textContent == td8.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td0.textContent != "" && td0.textContent == td3.textContent && td3.textContent == td6.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td1.textContent != "" && td1.textContent == td4.textContent && td4.textContent == td7.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td2.textContent != "" && td2.textContent == td5.textContent && td5.textContent == td8.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td0.textContent != "" && td0.textContent == td4.textContent && td4.textContent == td8.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(td2.textContent != "" && td2.textContent == td4.textContent && td4.textContent == td6.textContent) {
      message("Player " + player() + " Won!")
      return true
    } else if(turn === 8) {
      message("Tie game")
      return true
    } else {
      return false
    }
  }

  var reset = function(){
    turn = 0
    $('td').each(function(){
      $(this).html("")
    })
  }

  function message(string){
    $('#message').text(string)
  }

  function listGames(){
    $.get('/games', function(data){
      $('#games').text("")
      var games = data
      if (games.length !== 0){
        games.forEach(function(game){
        $('#games').append("<li data-gameid=" + game.id + ' data-gamestate=' + game.state + '>' + game.id + "</li>")
        })
      }
    })
  }

  function load(event){
    var state = $(event.target).data('gamestate')
    var i = 0
    $('table tr td').each(function(){
      $(this).text(state[i])
      i++
    })
    currentGame = $(event.target).data.id
  }

  function save(){
    $.ajax({
      url: '/games',
      method: 'POST',
      dataType: 'json',
      data: { 
        game: {
          state: JSON.stringify(currentState())
        }
      },
      success: function(data){
      currentGame = data.id
    }
  })
}

  function update(){
    $.ajax({
      url: '/games/' + currentGame,
      method: 'PATCH',
      dataType: 'json',
      data: { 
        game: {
          state: JSON.stringify(currentState())
        }
      },
      success: function(data){
      currentGame = data.id
    }
  })
}
