// Code your JavaScript / jQuery solution here
let game_id;
var turn = 0;

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


function player(){
  if (turn % 2){
    return "O"
  }else {
    return "X"
  }
}

function updateState(position){
  var el = document.querySelector(position)
  el.html(position)
}

function setMessage(){

}