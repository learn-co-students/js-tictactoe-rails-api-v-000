$(function(){
  attachListeners()
})
var turn = 0
var winner = []
var currentGame;
function attachListeners(){

$('#previous').on("click",function(event){
    showGames()
  })
    loadGame()
    $("td").click(function(event){
      if($(this).text() == ""){
      doTurn(event)

    }

    })

      $('#save').click(function(event){
        saveGame(false)
      })
}



function doTurn(event){
  console.log(currentGame)
  updateState(event)

  checkWinner(event)
   turn ++


    if(turn == 9){
      message("Tie game")
      saveGame()
      $('td').empty()
      turn = 0

    }

  }


function player(){

  if (turn %2 == 0) {
      return "X"
  } else {
      return "O"
  }

}

function checkWinner(event){


for ( let i = 0; i < winCombos.length; i ++){

   if(winnerArray[winCombos[i][0]] == player() && winnerArray[winCombos[i][1]] == player() && winnerArray[winCombos[i][2]] == player()){
    message("Player " + player() + " Won!")

     turn = -1
     $('td').empty()
     saveGame(true)

     } else if( i == winCombos.length -1 ){
     return false
   }


}

}

function message(message){
  $('#message').text(message)

}
function updateState(event){

  $(event.target).text(player())
    $('td').each(function(index){
    winnerArray[index] = $(this).text()
  })

}


///// Save and Open Game functionality ////




function getBoard(){
  return winnerArray
}


function saveGame(won){

    var values = getBoard();
    if(!currentGame){
        if(values.length != 0){
           $.ajax({
            type: "POST",
            data: {game:{state: values}},
            url: "/games",
            success: function(resp){
              if(won){
                console.log("I'm in Post top " + won + " " + currentGame)
                currentGame = null
              }else {
                //  debugger;
                console.log("I'm in Post bottom " + won + " " + currentGame)
                currentGame = resp.game
              }
            }
          });
      }
    } else {
      var posting = $.ajax({
        type: "PATCH",
        url: "/games/"+ currentGame.id,
        data: {game:{state: values}},
        success: function(resp){
          if(won){
            console.log("I'm in Patch top " + won + " " + currentGame)
            currentGame = null
          }else {
            // debugger;
            console.log("I'm in Patch bottom " + won + " " + currentGame)
            currentGame = resp.game
          }
        }
      })

    }
}


function showGames(){
    $('#games').empty()
    $.get("/games", function(data, status){
      //debugger;
      for(let i  = 0; i < data.games.length; i++) {
        $('#games').append('<li>'+ data.games[i].id + '</li>')

      }
    })
  }

function loadGame(){
  $('#games').on('click','li', function(event){
    let gameId = this.innerHTML - 1

    $.get('/games', function(data, status){
      currentGame = data.games[gameId]
      console.log(currentGame)
      $('td').each(function(index){
        this.innerHTML = data.games[gameId].state[index]
      })
    })
  })


}



const winnerArray = [ ]
const winCombos = [[0,1,2],
                  [3,4,5],
                  [6,7,8],
                  [0,3,6],
                  [1,4,7],
                  [2,5,8],
                  [0,4,8],
                  [2,4,6]]
