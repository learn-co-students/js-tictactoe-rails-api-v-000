let turn = "odd"

function player() {
	if (turn === "odd") {
		return "X";
		turn = "even";
	} else {
		return "O";
		turn = "odd"
	}
}