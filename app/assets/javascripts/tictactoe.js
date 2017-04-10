$(document).ready( function() {
   attachListeners();
});
  
function attachListeners() {
  $("tbody").on("click", "td",  function(e){
  doTurn(e.target)
 //   console.log(e.target); => returns clicked cell with data-x and data-y properties
  });

  $('#save').on("click", function() {

  })

  $('#previous').on("click", function() {

  })
}