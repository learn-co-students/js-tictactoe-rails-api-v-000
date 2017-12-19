// Code your JavaScript / jQuery solution here
var turn = 0

var current_id;

$( function(){
  attachListeners();
});

function player() {
  if (turn == 0 || turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {

  const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  var winner = WIN_COMBINATIONS.some(function(win_combo) {
    var td_one = $("td")[0].innerHTML
    var td_two = $("td")[1].innerHTML
    var td_three = $("td")[2].innerHTML
    var td_four = $("td")[3].innerHTML
    var td_five = $("td")[4].innerHTML
    var td_six = $("td")[5].innerHTML
    var td_seven = $("td")[6].innerHTML
    var td_eight = $("td")[7].innerHTML
    var td_nine = $("td")[8].innerHTML
    var td_array = [td_one,td_two,td_three,td_four,td_five,td_six,td_seven,td_eight,td_nine]
    //debugger;
    //console.log(win_combo)
    if (td_array[win_combo[0]] == "X" && td_array[win_combo[1]] == "X" && td_array[win_combo[2]] === "X") {
      //console.log("pass")
      setMessage("Player X Won!");
      return true
    } else if (td_array[win_combo[0]] == "O" && td_array[win_combo[1]] == "O" && td_array[win_combo[2]] == "O") {
      //console.log("pass")
      setMessage("Player O Won!");
      return true
    }
  });

  if (winner) {
    return true
  } else {
    return false
  }
}

function doTurn(square) {
  if (square.innerHTML == "") {
    updateState(square);
    var td_one = $("td")[0].innerHTML
    var td_two = $("td")[1].innerHTML
    var td_three = $("td")[2].innerHTML
    var td_four = $("td")[3].innerHTML
    var td_five = $("td")[4].innerHTML
    var td_six = $("td")[5].innerHTML
    var td_seven = $("td")[6].innerHTML
    var td_eight = $("td")[7].innerHTML
    var td_nine = $("td")[8].innerHTML
    var td_array = [td_one,td_two,td_three,td_four,td_five,td_six,td_seven,td_eight,td_nine]
    turn += 1;
    if (!td_array.includes("") && !checkWinner()) {
      setMessage("Tie game.");
      $("#save").click();
      resetBoard();
      turn = 0;
    } else if (checkWinner()) {
      checkWinner();
      $("#save").click();
      resetBoard();
      turn = 0;
    }
  }
}

function resetBoard() {
  $("td")[0].innerHTML = ""
  $("td")[1].innerHTML = ""
  $("td")[2].innerHTML = ""
  $("td")[3].innerHTML = ""
  $("td")[4].innerHTML = ""
  $("td")[5].innerHTML = ""
  $("td")[6].innerHTML = ""
  $("td")[7].innerHTML = ""
  $("td")[8].innerHTML = ""
  turn = 0;
  current_id = undefined;
}

function attachListeners() {
  var td_one = $("td")[0]
  var td_two = $("td")[1]
  var td_three = $("td")[2]
  var td_four = $("td")[3]
  var td_five = $("td")[4]
  var td_six = $("td")[5]
  var td_seven = $("td")[6]
  var td_eight = $("td")[7]
  var td_nine = $("td")[8]

  $(td_one).on("click", function(){
    move(td_one);
  });
  $(td_two).on("click", function(){
    move(td_two);
  });
  $(td_three).on("click", function(){
    move(td_three);
  });
  $(td_four).on("click", function(){
    move(td_four);
  });
  $(td_five).on("click", function(){
    move(td_five);
  });
  $(td_six).on("click", function(){
    move(td_six);
  });
  $(td_seven).on("click", function(){
    move(td_seven);
  });
  $(td_eight).on("click", function(){
    move(td_eight);
  });
  $(td_nine).on("click", function(){
    move(td_nine);
  });

  $("#previous").on("click", function() {
    $.get('/games', function(data){
      //debugger;
      data["data"].forEach(function(element){
        //debugger;
        ids = []
        for (i = 0; i < $(".load-button").length; i++) {
          ids.push($(".load-button")[i]["attributes"]["data-id"].value);
        }
        if(!ids.includes(element["id"])) {
          previous_game = '<button href="games/'
            + element["id"] +
            '" class="load-button" onclick="load_game(' + element["id"] + ');" data-id="'
            + element["id"] +
            '">' + element["id"] + '</button>';
            //console.log(previous_game)
          $("#games").append(previous_game);
        }
      });
    });

  });

  $("#save").on("click", function(){
    var td_one = $("td")[0].innerHTML
    var td_two = $("td")[1].innerHTML
    var td_three = $("td")[2].innerHTML
    var td_four = $("td")[3].innerHTML
    var td_five = $("td")[4].innerHTML
    var td_six = $("td")[5].innerHTML
    var td_seven = $("td")[6].innerHTML
    var td_eight = $("td")[7].innerHTML
    var td_nine = $("td")[8].innerHTML
    var td_array = [td_one,td_two,td_three,td_four,td_five,td_six,td_seven,td_eight,td_nine]
    var values = { 'state':  td_array}

    //console.log(current_id == undefined)
    if (current_id == undefined){
      var posting = $.post('/games', values)
    } else {
      var posting = $.ajax('/games/' + current_id, {
        method: 'PATCH',
        data: values
      })
    }

    posting.done(function(data){
      debugger;
      current_id = data["data"]["id"]
    });
  });

  $("#clear").on("click", function(){
    resetBoard();
  });

}

function load_game(data_id) {
  turn = 0;
  $.get("/games/" + data_id, function(data) {
    debugger;
    current_id = data["data"]["id"];
    for (i = 0; i < data["data"]["attributes"]["state"].length; i++) {
      $("td")[i].innerHTML = data["data"]["attributes"]["state"][i]
      if (data["data"]["attributes"]["state"][i] == "X" || data["data"]["attributes"]["state"][i] == "O") {
        turn++;
      }
    }
  });
}

function move(square) {
  if (!checkWinner()) {
    doTurn(square);
  }
}
