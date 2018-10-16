// Code your JavaScript / jQuery solution here
let turn = 0

function populate(id) {
  let elements = $('td');
  $.get(`/games/${id}`, function(result) {
    $("tbody").data("id", result["data"]["id"])
    $.each(result["data"]["attributes"]["state"], function( index, value) {
      if (value === 'X' || value ==='O') {
        turn += 1
      }
      elements[index].textContent = value;
    });
  });
}

function isEven(value) {
	return (value%2 === 0 ? true : false)
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  }else {
    return "O";
  }
}

function updateState(element) {
  const token = player();
  $(element).text(token);
}

function doTurn(element) {
  updateState(element);
  turn ++;
  if (checkWinner()) {
    turn = 0
    $('td').text("")
    $("tbody").data("id", null)
  }
}

function saveGame() {
  let elements = $('td')
  let state = $.map(elements, function(value, key) {
    return value.textContent;
  });
  if ($("tbody").data("id")) {
    const id = $("tbody").data("id");
    $.ajax({
      method: "PATCH",
      url: `/games/${id}`,
      data: { state: state }
    })
  }else {
    const posting = $.post("/games", {"state": state})
    posting.done(function(data) {
      $("tbody").data("id", data["data"]["id"]);
    });
  };
}

function setMessage(string) {
  $('#message').html("<p>" + string + "</p>");
}

function checkWinner() {
  const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
  ];
  let windicator = false
  let elements = $('td')
  let state = $.map(elements, function(value, key) {
    return value.textContent;
  });
  function tie(element) {
    return element !== ""
  }

  winCombos.forEach(function(combo) {
    if (combo.every(x => state[x] === "X")){
      saveGame();
      setMessage("Player X Won!");
      windicator = true
    }else if (combo.every(x => state[x] === "O")){
      saveGame();
      setMessage("Player O Won!");
      windicator = true;
    }else if (state.every(tie)) {
      saveGame();
      setMessage("Tie game.")
      turn = 0
      $('td').text("")
      $("tbody").data("id", null)
    }
  });
  return windicator;
}

function attachListeners() {
  $("td[data-x=0][data-y=0]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=1][data-y=0]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=2][data-y=0]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=0][data-y=1]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=1][data-y=1]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=2][data-y=1]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=0][data-y=2]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=1][data-y=2]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });

  $("td[data-x=2][data-y=2]").click(function() {
    if (($(this).text() === 'X') || ($(this).text() === 'O')) {
      alert("Please choose a square that has not been taken.");
    }else {
      doTurn(this);
    }
  });


}


$(function () {
  attachListeners();

  $("#save").on("click", function() {
    elements = $('td')
    state = $.map(elements, function(value, key) {
      return value.textContent;
    });
    if ($("tbody").data("id")) {
      const id = $("tbody").data("id");
      $.ajax({
        method: "PATCH",
        url: `/games/${id}`,
        data: { state: state }
      })
    }else {
      const posting = $.post("/games", {"state": state})
      posting.done(function(data) {
        $("tbody").data("id", data["data"]["id"]);
      });
    };
  });

  $('#previous').on('click', function() {
    $.get("/games", function(data) {
      data["data"].forEach(function(element) {
        if (!document.getElementById(`${element["id"]}`)) {
          // const array = element["attributes"]["state"] why doesn't this array
          // pass into the populate function correctly???
          // $('#games').append(`<button id="${element["id"]}" onClick="populate(${array})">Game ${element["id"]}</button>`);
          $('#games').append(`<button id="${element["id"]}" onClick="populate(${element["id"]})">Game ${element["id"]}</button>`);
        }
      });
    });
  });

  $('#clear').on('click', function() {
    $('td').text("")
    $("tbody").data("id", null)
    turn = 0
  });
});
