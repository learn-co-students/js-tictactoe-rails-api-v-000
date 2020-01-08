
  var turn = 0

function player() {
  if (turn%2 == 0){
    return "X"
  }else{
    return "O"
  }
}

function updateState(square){
  square.innerHTML += player()
  turn++

}

function setMessage(string){
  var message = document.getElementById("message")
  message.innerHTML= string
}

function checkWinner(){
  var td = document.getElementsByTagName('td')
  var combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8],[2,4,6]]

  for(var i = 0; i < combinations.length; i++){
    if((td[(combinations[i][0])].innerHTML === td[(combinations[i][1])].innerHTML) && (td[(combinations[i][1])].innerHTML === td[(combinations[i][2])].innerHTML)){
      saveGames($("#save").attr("data_id"))
      if((td[(combinations[i][0])].innerHTML !== "")){
      setMessage(`Player ${td[(combinations[i][1])].innerHTML} Won!`)
      return true}
    }
  }
  return false
}


function doTurn(square){
  if(!checkWinner()){
  if(square.innerHTML === ""){
    updateState(square)
}}


  if(turn === 9){
    setMessage("Tie game.")
    saveGames($("#save").attr("data_id"))
    clearBoard()

  }
}


function clearBoard(){
  turn = 0
  var boxes = document.getElementsByTagName('td')
  for(var i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = ''
  }
  $("#save").attr('data_id', 0)


}

function showPreviousGames(game){
  previousDiv = document.getElementById("games")
  previousDiv.innerHTML +=`<button onClick="showGame(${game.id})"> Game ${game.id} </button><br>`

}

function showGame(id){
  $("#save").attr('data_id', id)
  $.get("/games/"+id, function(data){
    array = data.data.attributes.state
    for(var i=0; i<9; i++){
      document.getElementsByTagName("td")[i].innerHTML = array[i]
      if(array[i] == "O" || array[i] == "X"){
        turn++
      }}
  })
}


function saveGames(id=0){
  array=[]
  for(let i =0; i<9; i++){
    array.push(document.getElementsByTagName("td")[i].innerText)
  }
  if(id == 0){
    $.post("/games", {data: array}).done(function(data){
      $("#save").attr('data_id', data.data.id)
    })

   }
    else{
      $.ajax({
        url: "/games/" + id,
        data: array,
        method: "PATCH",
         contentType: "application/json",
         dataType: "json"
       })
    }



}
function attachListeners(){
  document.querySelectorAll('td')
.forEach(e => e.addEventListener("click", function() {
    // Here, `this` refers to the element the event was hooked on
    doTurn(e)
}));
  $("#previous").click(function(){
    $.get("/games", function(response){
      if(response.data.length > 0){
        document.getElementById("games").innerHTML = ""
        for (var j = 0; j < response.data.length; j++){
          showPreviousGames(response.data[j])

    }
  }
    })
  })

  $("#save").click(function(){
    if($("#save").attr('data_id') == undefined || $("#save").attr('data_id') == 0 ){
      id = 0
    }
    else{
      id = $("#save").attr('data_id')}

    saveGames(id)}
)

  $("#clear").click(function(){
    var boxes = document.getElementsByTagName('td')
    clearBoard()
})

}



window.onload =() =>{
  attachListeners()
}
