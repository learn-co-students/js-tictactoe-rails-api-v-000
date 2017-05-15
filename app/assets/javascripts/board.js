function oldGames() {
  $('#previous').on('click', function() {
    $.get('/games', function(data) {
      for (i=0;i<data.length;i++)
       $('.old-games').append('<li class="old" id=' + data[i]['id'] + '>' + data[i]['id'] + '</li>');
    })
  })
}

function showOldGame() {
  $(document.body).on('click', '.old', function() {
    var thisId = $(this).attr('id');
    $.get('/games', function(data) {
       var state = data[thisId - 1]['state'];
       var stateList = state.split(",");

       for (var i=0;i<3;i++) {
         var xAxis = 0;
         var yAxis = 0;
       $('table').append('<tr><td data-x="' + xAxis + '" data-y="' + yAxis + '">' + stateList[i] + '</td></tr>');
         xAxis+=1;
     }

   });
 })
}
