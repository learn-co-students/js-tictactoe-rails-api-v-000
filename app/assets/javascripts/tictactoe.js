var rowIndex = ""
var cellIndex = ""

var turn = 0;

$(function() {
	attachListeners();
})

var player = function() {	
	if(turn % 2 === 0) {	
		return "X"
	} else {
		return "O"
	}
}

function updateState(event) {
	var td = event.target

	// changeContent(player())
	
	$(td).text(player())
	
}

function doTurn(event) {
	var td = event.target;

	if($(td).text() === "") {
			
		updateState(event);
	} else {
		return;
	}
	turn++;
	if(checkWinner() === true) {
		clearBoard();
	}

}

function attachListeners() {
	$("td").on("click", function(event) {	
		// token = player();
		// rowIndex = event.target.parentElement.rowIndex;
  //   	cellIndex = event.target.cellIndex;
    	// updateState();
    	let event = event.target
    	doTurn(event);
		
	})
	$("#clear").on("click", function() {
		clearBoard();
	})
}

function changeContent(state){
    var x=document.getElementById('myTable').rows
    var y=x[rowIndex].cells
    y[cellIndex].innerHTML=state
}

function setMessage(str) {

	$("#message").text(str);
}

function checkWinner() {
	var arr = $("td").map(function() {
    	return $(this).html()
  		}).toArray();

	if(arr[0] != "" && arr[0] === arr[1] && arr[1] === arr[2]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[3] != "" && arr[3] === arr[4] && arr[4] === arr[5]) {
		setMessage(`Player ${arr[3]} Won!`)
		return true;
	} else if(arr[6] != "" && arr[6] === arr[7] && arr[7] === arr[8]) {
		setMessage(`Player ${arr[6]} Won!`)
		return true;
	} else if(arr[0] != "" && arr[0] === arr[4] && arr[4] === arr[8]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[2] != "" && arr[2] === arr[4] && arr[4] === arr[6]) {
		setMessage(`Player ${arr[2]} Won!`)
		return true;
	} else if(arr[0] != "" && arr[0] === arr[3] && arr[3] === arr[6]) {
		setMessage(`Player ${arr[0]} Won!`)
		return true;
	} else if(arr[1] != "" && arr[1] === arr[4] && arr[4] === arr[7]) {
		setMessage(`Player ${arr[1]} Won!`)
		return true;
	} else if(arr[2] != "" && arr[2] === arr[5] && arr[5] === arr[8]) {
		setMessage(`Player ${arr[2]} Won!`)
		return true;
	} else if(turn === 9) {
		setMessage("Tie game.")
		return true;
	} else {
		return false;
	}
}



function clearBoard() {
	
	turn = 0;
	$("td").each(function() {
		$(this).html("");
	})
}


