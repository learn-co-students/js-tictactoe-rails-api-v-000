// Code your JavaScript / jQuery solution here
$(function save(){
  var array = []
  function setState(list) {
    for (var i = 0; i < list.length; i++) {
    array.push(list[i].innerHTML);
    }
  }

  $("#save").on("click", function() {
    array = []
    row1= $("table tr")[0].getElementsByTagName('td')
    row2= $("table tr")[1].getElementsByTagName('td')
    row3= $("table tr")[2].getElementsByTagName('td')
    setState(row1)
    setState(row2)
    setState(row3)
    debugger
    let values = {state: array}

  if ($('#data-id')) {
    debugger
    let id = parseInt($(".games").attr("data-id"))} else {
    let posting = $.post(`/games/${"#data-id"}`, values);

    posting.done(function(data) {
      let attribute = document.createAttribute('data-id')
      $('.games').appendChild(attribute)
      $('data-id').text(game['id'])
      });
    }
  })
});
