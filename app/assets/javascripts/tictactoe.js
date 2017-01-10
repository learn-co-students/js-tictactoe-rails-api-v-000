$(document).ready(function() {
  attachListeners();
  $('.previous').hide();

  $(function() {
    $('#games').on('click', function(event) {
        parseState($(event.target).text());
    });
    $('#save').on('click', function() {
        save();
    });
    $('#previous').on('click', function() {
        prev();
    });

  });
}
);
var all = ["","","","","","","","",""];
var turn = 0;
var count = 1;
var previousGames = [];
var currentGame;
var COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function parseState(id) {
  var url = "/games/" + id;
  var method = "GET"
  $.ajax({
    url: url,
    method: method,
    dataType: "json"
  }).done(function(data) {
    data["state"].forEach(function(x,y) {
      $('td:eq('+y+')').text(x);
    });
  });
}

function prev() {
    var url = "/";
    var method = "GET"
    $.ajax({
      url: url,
      method: method,
      dataType: "json"
    }).done(function(data) {
      var all2 = [];
      $('li').each(function() { all2.push(parseInt($(this).text())); });
      data["home"].forEach(function(x){
        if (!all2.includes(x["id"])) {
          $('.previous').append("<li>" + x["id"] + "</li>").addClass("list-"+ x["id"]);
        }
      });
    });
    $('.previous').show();

}

function save() {
    var url = "/games";
    var method = "POST";
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: state()
      }
    }
  });
}

function state() {
  var test = [];
  $('td').each(function() { test.push($(this)["0"]["textContent"])});
  return test;
}

function attachListeners() {
$('td').on('click', function(e) {
  doTurn(e);
});

}

function doTurn(event) {

    updateState(event);
    checkWinner();
    turn++
}

function isEven(num) {
  return num%2 == 0;
}

function player() {
  return isEven(turn) ? "X" : "O";
}

function updateState(event) {
  $(event.target).text(player());

}

function reset() {
  $('td').html("");
  turn = 0;
}

function checkWinner() {

  for (i=0; i < COMBOS.length; i++) {

    var one = $('td:eq(' + COMBOS[i][0] + ')')["0"]["textContent"];
    var two = $('td:eq(' + COMBOS[i][1] + ')')["0"]["textContent"];
    var three = $('td:eq(' + COMBOS[i][2] + ')')["0"]["textContent"];

    if (one === two && one === three && one != "") {
      message("Player " + player() + " Won!");
      save();
      reset();
      return
    }
    else if (turn == 8 && i == COMBOS.length-1) {
      message("It is a tie!");
      save();
      reset();
      return
    }
  }
  return false
}

function message(string) {
  $('#message').html(string);
  return string;
}
