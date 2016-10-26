  $(function(){
  attachListeners();
  });


  var turn = 0;
  var winningCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
  var currentGame;
  var counter = 0

   var player = function(){
    if (turn % 2 == 0){
      return "X";
    }
    else {
      return "O";
    }
  }

  //WC[i][0] == wc[i][1] &&& [2]

  //    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')

  //if someone clicks the save button then i have a click function to run save()
  // when its saved, if its a game that is active. if currentGame is 1.  then it saves it as /games/:id. 
  // id is from currentGame

  var doTurn = function(event){
    updateState(event);
    if(checkWinner() || tie()){
      save();
      endGame();
    }
    else{
      turn += 1;
    }
  }

  var currentState = function(){
    var state = []
    $('td').each(function(i){
      state.push($(this).text())
    })
    return state
  }

  function attachListeners(){
    $("tbody").on("click", function(event){
      doTurn(event)
    });

     $('#previous').on("click", function(){
      showGames()
    })

     $('#save').on("click", function(){
      if (counter === 0){
        save()
        counter++
      } else {
        update()
      }
     })

     $('#games').on("click",  function(event){
      load(event)
     })
  }

  function save(){
    $.ajax({
      url: '/games',
      method: 'POST',
      dataType: 'json',
      data: {
        game: {
          state: currentState()
        }
      },
      success: function(data){
        currentGame = data.game.id
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

  function load(event){
    var number = event.target.innerHTML
    $.get('/games/'+ number, function(data){
    })
    //var state = $(event.target).data('gamestate')
    //var i = 0
    //$('table tr td').each(function(){
      //$(this).text(state[i])
      //i++
    //})
    currentGame = $(event.target).data.id
  }

  var tie = function(event){
    var tieVariable = true
    $("td").each(function(){
      if($(this).html().length <= 0){
        tieVariable = false;
      }
    });
    if(tieVariable) message("Tie game");
    return tieVariable
  }

  var endGame = function(){
    $("td").html("");
    turn = 0;
    currentGame = 0;
  }


  function showGames (){
    $.get('/games', function(data){
          $('#games').text("")
          var games = data.games
        games.forEach(function(game){
        $('#games').append("<li data-gameid=" + game.id + ' data-gamestate=' + game.state + '>' + game.id + "</li>")
        })
      })
  }

  function updateState(event){
    var token = player()
    $(event.target).text(token)  
  }


  var checkWinner = function(){
    for(var i = 0; i < winningCombos.length; i++){

      if(currentWinner(winningCombos[i]) == true){
      message("Player " + player() + " Won!");
      return true;
    }
    }
    return false;
  }

  var currentWinner = function(event){
    for(var i = 0; i < event.length; i++){
      var winCombination = event[i]
      var x = winCombination[0]
      var y = winCombination[1]
      var location = $('[data-x="' + x + '"][data-y="' + y + '"]')
      if (currentplayerMatch(location)){
        return false;
      }
    }

    return true;
  }


  var currentplayerMatch = function(element) {
  return (element.html() != player())
}


  var message = function(event){
    $('#message').html(event);
  }

