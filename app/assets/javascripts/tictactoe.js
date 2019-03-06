// Code your JavaScript / jQuery solution here
var turn = 0;
var board = $('table').find('td');

function player() {
  if (turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
};

function updateState(td) {
  var square = board.filter(function() {
    return this.dataset["x"] == td.dataset["x"] && this.dataset["y"] == td.dataset["y"]
  });
  square.text(player());
};

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var win_combos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  // check if the inner text is the same for all configurations
  var check_horizontal = board.filter(function(index) {
    return (this.innerHTML !== "" && this.innerHTML === board[index + 1].innerHTML && this.innerHTML === board[index + 2].innerHTML);
  });
  var check_vertical = board.filter(function(index) {
    return (this.innerHTML !== "" && this.innerHTML === board[index + 3].innerHTML && this.innerHTML === board[index + 6].innerHTML);
  });
  var check_left_diagonal = board.filter(function(index) {
    return (this.innerHTML !== "" && this.innerHTML === board[index + 4].innerHTML && this.innerHTML === board[index + 4].innerHTML);
  });
  var check_right_diagonal = board.filter(function(index) {
    return (this.innerHTML !== "" && this.innerHTML === board[index + 2].innerHTML && this.innerHTML === board[index + 2].innerHTML);
  });
  // get the winner's value from whichever configuration, if it exists
  let winner = '';
  if (check_left_diagonal.length == 0) {
    false;
  } else {
    winner = check_left_diagonal[0].innerText;
  }
  if (check_right_diagonal.length == 0) {
    false;
  } else {
    winner = check_right_diagonal[0].innerText;
  }
  if (check_vertical.length == 0) {
    false;
  } else {
    winner = check_vertical[0].innerText;
  }
  if (check_horizontal.length == 0) {
    false;
  } else {
    winner = check_horizontal[0].innerText;
  }
  if (winner == '') {
    false;
  } else {
    var message =  `Player ${winner} Won!`;
    setMessage(message);
  }
};

function doTurn(td) {
  turn += 1;
  updateState(td);
  checkWinner();
}

function attachListeners() {
  board.click(function() {
    doTurn(this);
  })

}

$(function () {
  attachListeners();
})

$(function () {
	// load new game
	$.post('/games', function(data) {
		var state = data.state
		$("table").find("td").map(function(i, e) {
			// fill the board with state values
			// e.textContent = state[i]
		})
	})
})


$(function () {
	$("#previous").click(function() {
		$.get('/games.json', function(data) {
			// var ids = data.map( ())
      var games = `<li><button data-id="${id}" onclick="updateState(this);">${id}</button>`
			var string = "<ul>"
				+`${games}`
				+"</ul>";
			$("#games").text(string);
		});
	});
});

$(function () {
	$("#clear").click(function() {
		$("table").find("td").empty();
	})
})

$(function () {
	$("#save").click(function() {
		var state = $("table").find("td").text().split("");
		var update = $.post('/games/' + id, state)
		update.done(function(data) {
			var state = data.state
			// fill in the board
		})
	})
})
