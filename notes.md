<script type="text/javascript" charset="utf-8">
  //Controls the actions of the "Show Previous Game" button
  $(function(){
    $("#previous").on("click", function(e){
      $.get('/games').success(function(games){
        //1 redraw the list of saved games
        $("#games").html(games)
        //2 listen for clicks on previous games and then load selected game
        $("li").on("click", function(){
        //3 identifies the id of the desired game and sets it
          currentGame = this.id
        //4 Loads selected game
          $.get('/games/'+this.id).success(function(game){
            $(function(){
              board = JSON.parse(game)
              loadBoard();
            });
          });
        });
      });
    });
  });
</script>

<script type="text/javascript" charset="utf-8">
  //Controls the actions of the "Show Previous Game" button
  $(function(){
    $("#previous").on("click", function(e){
      $.ajax({
        url: '/games',
        method: 'GET'
        success: function(games){
          $("#games").html(games)
          $("li").on("click", function(){
            currentGame = this.id
            $.get('/games/'+this.id).success(function(game){
              $(function(){
                board = JSON.parse(game)
                loadBoard();
              })
            })
          })
        }
      })
    });
  });
</script>

$.ajax({
  url: "/games",
  type: 'POST',
  data: { game: {state: JSON.stringify(board)},
  authenticity_token: $("input")[1].value}).success(function(response){
    getPreviousGames();
    currentGame = $('li').last().attr("id");
  });
});

<div id="hidden_form"></div>
<script type="text/javascript" charset="utf-8">
  $(function(){
    $.get('/games/new').success(function(response){
      $('#hidden_form').html(response);
    });
  });
</script>
