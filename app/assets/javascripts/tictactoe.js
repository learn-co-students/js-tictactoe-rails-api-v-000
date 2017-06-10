$(function() {
  attachListeners()
});

function attachListeners() {
	var allRows = document.getElementsByTagName("tr")

	//Goal : iterate through allRows to get rows
	// iterate through each of those rows to get cells

	  Array.prototype.forEach.call(allRows
	  	[0].children, function(row){
	    console.log(row)
	})


	  onClick(function(event){
	    console.log("Success!")
	})
	  // var selector = '[data-x="0"][data-y="0"]'
	  // document.querySelector(selector).addEventListener("click", doTurn()); 
}

function turn() {

}

function doTurn() {

}


