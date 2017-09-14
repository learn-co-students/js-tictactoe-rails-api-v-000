// Code your JavaScript / jQuery solution here
$(function () {

  $('#save').click(function(event) {
    var values = $(this).serialize();
    debugger;
    var posting = $.patch('/games', values);

    posting.done(function(data) {
      debugger;

    });
  });

  $('#clear').click(function() {
    var x = document.getElementsByTagName("td")
    $(x).empty();
    window.turn = 0;
    $.get('/games');
  });

  $('#previous').click(function() {
    var posting = $.get('/games');
    posting.done(function(data) {
      var games = data["data"]
      $("#games").empty()
      games.forEach(function(game){
      var button = $('<button type="button">Game ' + game["id"] + '</>');
      $("#games").append(button)})
    });
  });

});

$(document).ready(function attachListeners() {
    $('td').click(function() {
      doTurn(this);
    })
  })


var turn = 0;

function player(){
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(input) {
  input.innerHTML = player();
}

function message(string) {
  return document.getElementById("message").innerHTML = string
}

function checkWinner() {
  var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
  var dumbArray = []
  dumbArray.push(document.getElementsByTagName("td")[0]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[1]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[2]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[3]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[4]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[5]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[6]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[7]["textContent"])
  dumbArray.push(document.getElementsByTagName("td")[8]["textContent"])

  winCombinations.forEach(function(win) {
    if (dumbArray[win[0]] === dumbArray[win[1]] && dumbArray[win[1]] === dumbArray[win[2]] && dumbArray[win[0]] != ""){
      message('Player ' + player() + ' won!')
      return true
    } else {
      return false
    }
  })
}

function doTurn(input) {
  updateState(input)
  checkWinner()
  turn +=1
}
