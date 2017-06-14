var turn = 0

$(document).ready(function() {
  attachListeners()
});

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event)
  })
  $('#save').on('click', function(event) {
    var values = getTableValues();
    $.post('/games/:id')
  })
}

function doTurn(event) {
  turn += 1
  updateState(event)
  checkWinner()
}
function senddata() {
  $('#form').on('submit',(function(e) {
    var formData = new FormData(this);

    formData.append('_method', 'patch');
    $.ajax({
      type: "POST",
      url:'/slide/' + id,
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    }).done(function(r) {
    console.log(r);
  });
}


function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  return event.target.innerHTML = player()
}
