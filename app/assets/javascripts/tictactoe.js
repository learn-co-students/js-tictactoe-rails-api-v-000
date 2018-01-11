// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  console.log("ready!");
  saveGame();
});

// <script type="text/javascript" charset="utf-8">
// $(function () {
//   $(".js-more").on('click', function() {
//     // get the id from the data attribute
//     var id = $(this).data("id");
//     $.get("/posts/" + id + "/body", function(data) {
//       // Replace text of body-id div
//       $("#body-" + id).text(data);
//     });
//   });
// });
// </script

function saveGame() {
  $("#save").on('click', function() {
    console.log("save game got clicked!");
  });
}
