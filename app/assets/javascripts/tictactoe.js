// Code your JavaScript / jQuery solution here
var game_id;
var turn = 0;

function player(){
  if (turn % 2){
    return "O"
  }else {
    return "X"
  }
}

function updateState(position){
  var token = player()
  var el = document.querySelector(position)
  el.html(token)
}


function setMessage(){

}





$(function () {
  $("#save").on('click', function() {
    if (game_id === undefined){
      $.post("/games", $("td").text(), function(data){
        // console.log(data)
      })
    }
    var id = $(this).data("id");
    // $.patch("/games/" + id, function(data) {
    //   $("#body-" + id).text(data);
    // });
  });
});