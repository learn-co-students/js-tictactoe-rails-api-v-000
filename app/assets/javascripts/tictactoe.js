var turn = 0;
// we want it to be accessible by all functions

function attachListeners() {
	$('td').on('click', function(event){
		doTurn(event);
	})
}

function doTurn(event) {
	updateState(event);
	if ( checkWinner() ) {
		// game is finished
	} else {
		turn += 1;
	}
}

function player() {
	return turn % 2 == 0 ? "X" : "O" ;
}

function updateState(event) {
	// console.log(event.target);
	var target = event.target;
	$(target).html( player() );
}

function checkWinner(){
	return false;
}

$(document).ready(function(){
	attachListeners();
})