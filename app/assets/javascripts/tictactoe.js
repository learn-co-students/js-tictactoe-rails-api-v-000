function doTurn(x=nil,y=nil) {

}

function attachListeners() {
  tableListener();
  saveListener();
  previousListener();
}

function tableListener() {
  $("td").on("click", function(e) {
    var x = $(this).data("x");
    var y = $(this).data("y");

    doTurn(x,y);
  });
}

function tableHandler() {

}

function saveListener() {
  $("#save").on("click", function(e) {
    alert("save!");
  });
}

function previousListener() {
  $("#previous").on("click", function(e) {
    alert("previous");
  });
}

$(function(){
  var turn = 0;

  attachListeners();
});
