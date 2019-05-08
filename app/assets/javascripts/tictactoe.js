// Code your JavaScript / jQuery solution here
var turn = 0
let id = ""
var board = ["", "", "", "", "", "", "", "", ""]
// var game = {'state': board}
// var table = $('table tr td')

function player() {
  return turn % 2 === 0 ? 'X' : 'O';
}


function updateState(square) {
  square.innerHTML = player();
}

function setMessage(text) {
  document.getElementById('message').innerHTML = `${text}`
}

function checkWinner() {
  if (checkHorizontal() || checkVertical() || checkDiagonal()) {
    saveOrUpdateGame();
    setMessage(`Player ${player()} Won!`)
    return true
  }else{
    return false
  }
}

function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    clearBoard();
    id = ""
  }else if (checkFull()){
    saveOrUpdateGame();
    return setMessage("Tie game.")
  }else{
    turn += 1;
  }
}

function attachListeners() {
  $('table tr td').on("click", function() {
    if (this.innerHTML == "") {
      doTurn(this);
    };
  });

  $('#save').on('click', function(e) {
    saveOrUpdateGame();
  })

  $('#previous').on('click', function(e) {
    removeLi();
    $.get(`/games`, function(data){
      $.each(data.data, function(k, v) {
      	appendGame(parseInt(v.id))
      })
      $('#games button').on('click', function(e) {
        $.get(`/games/${this.innerHTML}`, function(data){
          id = data.data.id
          $.each(document.querySelectorAll('td'), function(k, v){
            v.innerHTML = data.data.attributes.state[k]
          })
          setTurn(data.data.attributes.state);
        })
      })
    })
  })

  $('#clear').on('click', function(e){
  	clearBoard();
  })
}

$(document).ready(function() {
  attachListeners();
});


function checkHorizontal() {
  var table = $('table tr td')
  if (table[0].innerHTML == table[1].innerHTML && table[0].innerHTML == table[2].innerHTML && table[0].innerHTML != "" ||
  table[3].innerHTML == table[4].innerHTML && table[3].innerHTML == table[5].innerHTML && table[3].innerHTML != "" ||
  table[6].innerHTML == table[7].innerHTML && table[6].innerHTML == table[8].innerHTML && table[6].innerHTML != "") {
    return true
  }else{
    return false
  }
}

function checkVertical() {
  var table = $('table tr td')
  if (table[0].innerHTML == table[3].innerHTML && table[0].innerHTML == table[6].innerHTML && table[0].innerHTML != "" ||
  table[1].innerHTML == table[4].innerHTML && table[1].innerHTML == table[7].innerHTML && table[1].innerHTML != "" ||
  table[2].innerHTML == table[5].innerHTML && table[2].innerHTML == table[8].innerHTML && table[2].innerHTML != "") {
    return true
  }else{
    return false
  }
}

function checkDiagonal() {
  var table = $('table tr td')
  if (table[0].innerHTML == table[4].innerHTML && table[0].innerHTML == table[8].innerHTML && table[0].innerHTML != "" ||
  table[2].innerHTML == table[4].innerHTML && table[2].innerHTML == table[6].innerHTML && table[2].innerHTML != "") {
    return true
  }else{
    return false
  }
}

function checkFull() {
  setState()
  return board.includes("") ? false : true
}

function clearBoard() {
  var squares = document.querySelectorAll('td')
  id = ""
  turn = 0
  $.each(squares, function(k, v) {
	v.innerHTML = ""
  })
}

function setState() {
  var squares = document.querySelectorAll('td')
  board = $.map(squares, function(k,v) {
  	return k.innerHTML
  })
}

function appendGame(gameId) {
  var li = document.createElement("li")
  var button = document.createElement("button")
  button.innerText = gameId
  li.append(button)
  $('#games').append(li)
}

function saveGame() {
  var game = {'state': board}
  $.post('/games', game, function(data){
    id = parseInt(data['data'].id)
  })
}

function updateGame() {
  var game = {'state': board}
  $.ajax({
    url: `/games/${id}`,
    data: game,
    dataType: "json",
    method: "PATCH"
  })
}

function saveOrUpdateGame() {
  if (id != "") {
    updateGame();
  }else{
    saveGame();
  }
}

function removeLi() {
  $('#games li').remove()
}

function setTurn(board){
	turn = 0
	board.forEach(function(token){
		if (token != ""){turn += 1}
	})
}