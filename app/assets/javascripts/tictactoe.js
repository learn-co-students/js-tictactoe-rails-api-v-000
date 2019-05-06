// Code your JavaScript / jQuery solution here

var turn = 0

function getGame(e) {

  $.getJSON("/games/" + e.currentTarget.value, function(result){
    $("#ssave").remove()

    var s = document.createElement('input')
    s.setAttribute("type", "hidden")
    s.setAttribute("value", result.data.id)
    s.setAttribute("id", "ssave")
    $("td").empty()
    $("body").append(s)
    turn = 0
    for (var i = 0; i < 9; i++) {
      $("td")[i].innerText = result.data.attributes.state[i]
      if(result.data.attributes.state[i] != ""){
        turn = turn + 1
      }
    }
    $('#message').empty()
    checkWinner()
  })
}



function postGame() {
  $("#ssave").remove()
  let arr = []
  for(i=0; i<9; i++ ) {
    arr.push($("td")[i].innerText)
  }
  let data = {state: arr}
  $.post('/games', data, function(data, status){
    var s = document.createElement('input')
    s.setAttribute("type", "hidden")
    s.setAttribute("value", data['data'].id)
    s.setAttribute("id", "ssave")
    $("body").append(s)
  })

}

function patchGame() {
  let arr = []
  for(i=0; i<9; i++ ) {
    arr.push($("td")[i].innerText)
  }
  var t = new Object()
  t["state"] = arr
  $.ajax({
    url: `/games/${$("#ssave")[0].value}`,
    type: "PATCH",
    data: t
  })

}

function player() {

  if (turn % 2 === 0){
    return "X"
  }
  return "O"
}

function updateState(passed_element) {
  $(passed_element).html(player())
}

function setMessage(message) {
  $('#message').html(message)
}

function checkWinner() {
  //debugger
  //horizontal check
  for(i=0; i < 7; i=i+3){
    if($('td')[i].innerText === $('td')[i+1].innerText && $('td')[i].innerText === $('td')[i+2].innerText && $('td')[i].innerText !== ""){
      setMessage(`Player ${$('td')[i].innerText} Won!`)
      return true
    }
  }

  //vertical Check
  for(i=0; i < 3; i++){
    if($('td')[i].innerText === $('td')[i+3].innerText && $('td')[i].innerText === $('td')[i+6].innerText && $('td')[i].innerText !== ""){
      setMessage(`Player ${$('td')[i].innerText} Won!`)
      return true
    }
  }

  //diagonal check
  if ($('td')[2].innerText === $('td')[4].innerText && $('td')[4].innerText === $('td')[6].innerText && $('td')[6].innerText !== "") {
    setMessage(`Player ${$('td')[2].innerText} Won!`)
    return true
  }
  if ($('td')[0].innerText === $('td')[4].innerText && $('td')[4].innerText === $('td')[8].innerText && $('td')[8].innerText !== "") {
    setMessage(`Player ${$('td')[0].innerText} Won!`)
    return true
  }

  return false
}

function doTurn(element){

  updateState(element)
  turn = turn + 1

  let ret = checkWinner()

  if(ret === true){

    if(typeof $("#ssave")[0] === 'undefined'){
      postGame()
    }else{
      patchGame()
    }

    turn = 0
    $("#ssave").remove()
    $("td").empty()

  }

  if(turn === 9) {
    if(ret === false){
      setMessage("Tie game.")
      //save the tie game
      if(typeof $("#ssave")[0] === 'undefined'){
        postGame()
      }else{
        patchGame()
      }
    }
    turn = 0
    $("#ssave").remove()
    $("td").empty()
  }
}


function attachListeners() {

  //get each table square to call doTurn
  for (var i = 0; i < 9; i++) {
    $("td")[i].addEventListener('click', function (e) {

      //debugger
      if (e.currentTarget.innerHTML === "" && checkWinner() === false && turn < 9){
        doTurn(e.currentTarget);
      }

      //doTurn(e.currentTarget);
    });
  }

  //attach to save button
  $("#save")[0].addEventListener('click', function (e) {
    if(typeof $("#ssave")[0] === 'undefined'){
      postGame()
    } else{
      patchGame()
    }
  });

  //clear game
  $("#clear")[0].addEventListener('click', function (e) {
    turn = 0
    $("td").empty()
    $("#ssave").remove()
  })


  $("#previous")[0].addEventListener('click', function(e) {
    $("#games").empty()

    $.getJSON('/games', function(result){
      var br = document.createElement('br');
      for(i=0; i<result['data'].length; i++ ){
        var br = document.createElement('br');
        var b = document.createElement('BUTTON')

        b.setAttribute('value', result["data"][i].id)
        b.innerText = `Game ${result["data"][i].id}`

        b.addEventListener('click', function (e) {
          getGame(e)
        })

        $("#games").append(b)
        $("#games").append(br)

      }
    })
  })
}

$(function() {
  attachListeners()
});
