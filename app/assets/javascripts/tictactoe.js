// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
function player(){
  return turn % 2 === 0 ? "X" : "O"
}
function updateState(ele){
  if ($(ele).text() === ""){
    $(ele).text(player())
    turn++
  }
}
function setMessage(string){
  $("div#message").html(string)
}
function checkWinner(){
    // Horizontal Next
  if($("td:eq(0)").html() === $("td:eq(1)").html() && $("td:eq(1)").html() === $("td:eq(2)").html() && $("td:eq(2)").html() != ""){
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(3)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(5)").html() && $("td:eq(5)").html() != "") {
    setMessage("Player " + $("td:eq(3)").html() + " Won!")
    return true
  }else if ($("td:eq(6)").html() === $("td:eq(7)").html() && $("td:eq(7)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(6)").html() + " Won!")
    return true
    // Diagonal Next
  }else if ($("td:eq(0)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(6)").html() && $("td:eq(6)").html() != "") {
    setMessage("Player " + $("td:eq(2)").html() + " Won!")
    return true
    // Vertical Next
  }else if ($("td:eq(0)").html() === $("td:eq(3)").html() && $("td:eq(3)").html() === $("td:eq(6)").html() && $("td:eq(6)").html() != "") {
    setMessage("Player " + $("td:eq(0)").html() + " Won!")
    return true
  }else if ($("td:eq(1)").html() === $("td:eq(4)").html() && $("td:eq(4)").html() === $("td:eq(7)").html() && $("td:eq(7)").html() != "") {
    setMessage("Player " + $("td:eq(1)").html() + " Won!")
    return true
  }else if ($("td:eq(2)").html() === $("td:eq(5)").html() && $("td:eq(5)").html() === $("td:eq(8)").html() && $("td:eq(8)").html() != "") {
    setMessage("Player " + $("td:eq(2)").html() + " Won!")
    return true
  }else {
    return false
  }
}
function doTurn(ele){
  updateState(ele)
  if(turn === 9){
    saveGame()
    $("td").empty()
    setMessage("Tie game.")
    turn = 0
  }else if(checkWinner()){
    saveGame()
    $("td").empty()
    turn = turn -1
  }
}

$(document).ready(function() {
  attachListeners();
})

function attachListeners(){
  $("td").click(function(){
    doTurn(this);
  })
  $("#previous").on("click",function(e){
    previousGames()
  })
  $("#save").on("click",function(e){
    saveGame()
  })
  $("#clear").on("click",function(e){
    $("td").empty()
    turn = 0
    currentGame = 0
  })

  $("#games").on("click",function(e){
    $.ajax({
      url: '/games/' + e.target.id,
      method: "GET"
    }).done(function(response){
      response.data.attributes.state.forEach(function(val,i){
        $(`td:eq(${i})`).html(val)
      })
      currentGame = e.target.id
      turn = response.data.attributes.state.filter(String).length
    })
  })

}

function previousGames(){

  $.get("/games").done(function(response){
    let currentGameIds = []
    $("#games button").each(function(i,obj){
       currentGameIds += obj["innerHTML"]
    })

    response.data.forEach(function(i){
      if (!currentGameIds.includes(i.id)){
        $("#games").append(`<button id="${i.id}">` + i.id + '</button>')
      }
    })
  })
  $(this).data('clicked', true);
}

function saveGame(){
  if(currentGame === 0){
    let currentState = []
    $("td").each(function(){
      currentState.push($(this).text())
    })
    $.post("/games",{"state": currentState}).done(function(response){
      currentGame = response.data.id
    })
  }else{
    $.ajax({
      url: '/games/' + currentGame,
      method: "PATCH"
    }).done(function(data){

    })
  }
}
