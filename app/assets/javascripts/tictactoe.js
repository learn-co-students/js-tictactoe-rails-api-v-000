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
    // debugger;
    // let params = $('table').serialize();
    let postRequest = $.post('/games', { 'state[]': [ "", "", "", "", "", "", "", "", ""] })

    postRequest.done(function(response) {
      console.log("my hypothetical game got saved");
    })
  });
}

// <script type="text/javascript" charset="utf-8">
//   $(function() {
//     $('form').submit(function(event) {
//       event.preventDefault();
//       var params = $(this).serialize();
//       var postRequest = $.post('/products', params);
//
//       postRequest.done(function(renderedJSONHash) {
//         var product = renderedJSONHash;
//         $("#productName").text(product["name"]);
//         $("#productInventory").text(product["inventory"]);
//         $("#productPrice").text("$" + product["price"]);
//         $("#productDescription").text(product["description"]);
//       });
//     });
//   });
// </script>
