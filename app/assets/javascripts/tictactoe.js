$(document).ready(function() {
  attachListeners();
});

function attachListeners() {

}

function updateState() {
  $('td').on('click', function() {
    if($(this).html == '' && (num % 2 == 0)) {
      $(this).text = 'X';
    } else if ($(this.html == '' && (num % 2 != 0)) {
      $(this).text = 'O';
    } else {
      alert("This position is taken.")
    };
  });
}

function player() {
  
}