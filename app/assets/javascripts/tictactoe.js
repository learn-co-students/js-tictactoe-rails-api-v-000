// Code your JavaScript / jQuery solution here
$(function () {
  attachListeners();

})
var turn = 0;

var winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

const testArray = [1, 2, 3, 4]


function player() {
  if (isEven(turn)) {
    return "X"
  } else {
    return "O"
  }
}

function isEven(num) {
  if (num % 2 === 0) {
    return true;
  }
  else {
    return false;
  }
}

function doTurn(elem) {
  // console.log(elem);
 updateState(elem);
 if (checkWinner()) {
   for (i = 0; i < 9; i++) {
   $("td")[i].innerHTML = ""
   }
   turn = 0
 }
  // turn += 1;
  // updateState(elem);
  // checkWinner();

}

// function turnCount() {
//   counter = 0
//   for (var i = 0; i < 9; i++) {
//     if ($("td")[i].innerHTML === "X" || $("td")[i].innerHTML === "O") {
//       counter++
//     }
//   }
//   return counter
// }
function updateState(elem) {
  if ($(elem).is(':empty')) {
    $(elem).text(player());
    turn += 1
  }
  // else{
  //   turn -= 1;
  // }
}

function setMessage(winner) {
  $("#message").text(winner);
}

function checkWinner() {
  for (var i = 0; i < winCombos.length; i++) {
    if ($("td")[winCombos[i][0]].textContent === "X"
        && $("td")[winCombos[i][1]].textContent === "X"
        && $("td")[winCombos[i][2]].textContent === "X") {
          setMessage("Player X Won!")
          return true
    } else if ($("td")[winCombos[i][0]].textContent === "O"
        && $("td")[winCombos[i][1]].textContent === "O"
        && $("td")[winCombos[i][2]].textContent === "O") {
          setMessage("Player O Won!")
          return true
    } else if(turn > 7) {
          setMessage("Tie game.")
          return true
    }
  }
  return false
}

function saveGame() {
  var myArray = []
  for (var i = 0; i < 9; i++) {
      myArray.push($("td")[i].innerHTML);
  }
  $.post('/games', {'state' : myArray})
  // console.log(myArray);
}

function previousGame() {
  $.get('/games', function(data) {

    var games = data["data"]
    console.log(data);
    $("#games").html("")
    for (var i = 0; i < games.length; i++) {
      $("#games").append('<input type="button" class="js-next" data-id="' + games[i]["id"] + '" value=" Game '+ games[i]["id"] + '"> <br>')
      // console.log(games[i]["id"]);
    }
    $(".js-next").on("click", function() {
      var nextId = parseInt($(this).attr("data-id"))
      // console.log(nextId);
      $.get("/games/" + nextId + ".json", function(data) {
        var board = data.data.attributes["state"]
        for (var i = 0; i < board.length; i++) {
          $("td")[i].innerHTML = board[i]
        }
        // console.log(board);
      })
    })
  })
  // $.ajax({
  //       type: "GET",
  //       dataType: "json",
  //       url: "/games",
  //       success: function(data){
  //         console.log(data.data);
  //         for (var i = 0; i < data.data.length; i++) {
  //           console.log(data.data[i].attributes.state);
  //         }
  //       }
  //   });
}

function loadGame() {
  // console.log(this);
}

function clearGame() {
  for (i = 0; i < 9; i++) {
    $("td")[i].innerHTML = ""
  }
}

function attachListeners() {
  // $("#ttt tbody tr").on("click", "td", doTurn);
  $("td").click(function() {
    if(!checkWinner())
    {
      doTurn(this);
    }
  });
  $("#save").on("click", saveGame);
  $("#previous").on("click", previousGame);
  $("#clear").on("click", clearGame)
}
