// on load
var gameId;

$(document).ready(function(){

  $("#save").on("click",function(){

    if(typeof gameId == 'undefined'){
      $.post('/games',{state: getState()}, function(data){
        gameId = data["data"]["id"]
        $("#message").text("saved game #" + gameId)
      });
    } else {
      $.ajax({type: "PATCH", url: `/games/${gameId}`, data: {state: getState()},
      success: function(data){
        $("#message").text("saved game #" + gameId)
      }});
    }
  });

  $("#previous").on("click",function(){
    $.get('/games',function(data){
      var array = data["data"]
      var out = ""
      for(var i=0;i<array.length;i++){
        var button = '<button onclick="restoreState('+array[i]["id"]+')" id="game-'+array[i]["id"]+'">Save Game #'+array[i]["id"]+'</button>'
        out += button
      }
      $("#games").html(out)

    })

  });

  $("#clear").on("click", function(){
    gameId = undefined;
    $("#message").text("New Game Initiated");
  })

})

function getState() {
  //converts board state to array of strings
  var spaces = document.getElementsByTagName("td");
  var out = []

  for(var i=0;i<spaces.length;i++){
    out.push(spaces[i].innerHTML)
  }
  return out
}

function restoreState(id){
  $.get('/games/'+id, function(data){
    setState(data["data"]["attributes"]["state"]);
    gameId = data["data"]["id"]
  })
}

function setState(array){
  var spaces = document.getElementsByTagName("td");
  for(var i=0;i<spaces.length;i++){
    spaces[i].innerHTML = array[i]
  }
}

/*
// TTT functionality
*/
