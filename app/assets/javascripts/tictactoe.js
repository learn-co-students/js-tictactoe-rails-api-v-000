var turn = 0;

function player() {
	return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square) {
	if (squareAvailable) {
		return $(square).text(player());
	}
};

function squareAvailable(square) {
	return $(square).text === "" ? true : false
}

function setMessage(string) {
	return $('div#message').append(string)
}