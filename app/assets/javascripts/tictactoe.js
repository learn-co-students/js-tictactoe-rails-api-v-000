// Code your JavaScript / jQuery solution here
var turn = 0

$( function(){

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

  console.log(winner)

  if (winner) {
    return true
  } else {
    return false
  }

}
