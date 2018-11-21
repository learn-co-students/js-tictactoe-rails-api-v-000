// Code your JavaScript / jQuery solution here


const winning_combinations = [
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 4, 8],
	[2, 4, 6],

];

window.turn = 0;


function player() {
	if (window.turn % 2 == 0) {
		return "X"
	}
	else {
		return "O"
	}
}


function updateState(box) {
	box.innerHTML = player();
}

function setMessage(string) {
	$("#message").text(string);
}

function checkWinner() {
	for (var i = 0; i <= 7; i++) {
		if ((window.document.querySelectorAll('td')[winning_combinations[i][0]].innerHTML == 
			window.document.querySelectorAll('td')[winning_combinations[i][1]].innerHTML)
			&&
		(window.document.querySelectorAll('td')[winning_combinations[i][1]].innerHTML == 
			window.document.querySelectorAll('td')[winning_combinations[i][2]].innerHTML)) {
			if (window.document.querySelectorAll('td')[winning_combinations[i][0]].innerHTML != "") {
				let string = ''
				if (window.document.querySelectorAll('td')[winning_combinations[i][0]].innerHTML == "X") {
					string = "Player X Won!";
				}
				else {
					string = "Player O Won!";
				}
			setMessage(string);
			if (!window.id) {
			$.post('/games', function(response) {
				window.id = response.data.id
			})
			}
			else {
			$.ajax({
 				method: "PATCH",
			 	url: `/games/${window.id}`,
			})
			}
			return true;
			}
		}
	}
	return false;
}

function isFull() {
	// if (window.turn == 9) {
	// 	return true;
	// }
	// else {
	// 	return false;
	// }
	var answer = 0;
	var i = 0;
	for (i = 0; i <= 8; i++) {
		if (window.document.querySelectorAll('td')[i].innerHTML != "") {
			answer = answer + 1;
		}
	}
	if (answer == 9) {
		return true;
	}
	else {
		return false;
	}
}


function attachListeners() {
	$("td").click(function(event) {
		if ((this.innerHTML === "") && (checkWinner() === false)) {
			doTurn(this);
		}
	})

	$("#previous").click(function(event) {
		$.get('/games', function(response) {
			for (var i = 0; i < response.data.length; i++) {
				x = i + 1
				x = x.toString()
				z = "#" + x
				if ($(z)[0]) {
				}
				else {
					$('#games').append("<button id =" + response.data[i].id + " class = savedGames>" + response.data[i].id + "</button>");
				}
			}
			$(".savedGames").click(function(event) {
				$.get('/games/' + this.id, function(response) {
					debugger
					window.id = response.data.id
					window.document.querySelectorAll('td')[0].innerHTML = response.data.attributes.state[0]
					window.document.querySelectorAll('td')[1].innerHTML = response.data.attributes.state[1]
					window.document.querySelectorAll('td')[2].innerHTML = response.data.attributes.state[2]
					window.document.querySelectorAll('td')[3].innerHTML = response.data.attributes.state[3]
					window.document.querySelectorAll('td')[4].innerHTML = response.data.attributes.state[4]
					window.document.querySelectorAll('td')[5].innerHTML = response.data.attributes.state[5]
					window.document.querySelectorAll('td')[6].innerHTML = response.data.attributes.state[6]
					window.document.querySelectorAll('td')[7].innerHTML = response.data.attributes.state[7]
					window.document.querySelectorAll('td')[8].innerHTML = response.data.attributes.state[8]
					window.turn = 0
					for (var i = 0; i <=8; i++) {
						if (window.document.querySelectorAll('td')[i].innerHTML != "") {
							window.turn = window.turn + 1
						}
					}
				})
			})
		})
	})

	$("#save").click(function(event) {
		if (!window.id) {
			$.post('/games', function(response) {
				window.id = response.data.id
			})
		}
		else {
			$.ajax({
 				method: "PATCH",
			 	url: `/games/${window.id}`,
			})
		}
	})

	$("#clear").click(function(event) {
		resetBoard();
		window.turn = 0;
		window.id = 0;
	})

};

function resetBoard() {
	for (var i = 0; i <= 8; i++) {
		window.document.querySelectorAll('td')[i].innerHTML = ""
	}
}


function doTurn(box) {
	updateState(box);
	window.turn = window.turn + 1;
	
	if (checkWinner()) {
		window.turn = 0;
		resetBoard();
	} else {
	}
	if (isFull()) {
		let string = "Tie game."
		setMessage(string);
		if (!window.id) {
			$.post('/games', function(response) {
				window.id = response.data.id
			})
		}
		else {
			$.ajax({
 				method: "PATCH",
			 	url: `/games/${window.id}`,
			})
		}
		window.turn = 0;
		resetBoard();
	}

}

$(document).ready(function() {
	attachListeners();
});