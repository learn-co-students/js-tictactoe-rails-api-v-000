// Code your JavaScript / jQuery solution here
/////////////////////////////////////////TTT FUNCTIONALITY ///////////////////////////////////////////////////////////////////////////
let turn = 0;
let currentGame = 0;
function player(){
   return (turn % 2 ? "O" : "X")
}


function updateState(){
    $('td').on('click', function(){
        $(this).innerText += player();
    });
}

function setMessage(string){
    $("div#message").innerHTML += string;
}

function checkWinner(){
    
}



function attachListeners(){
    $("td").on("click", function(){
        // idk what we do here
    })

    $("#save").on('click' , () => saveGame());
    $("#previous").on('click', () => previousGame());
    $("#clear").on("click", ()=> resetBoard())
}





////////////////////////////////////////////BUTTONS//////////////////////////////////////////////////////////////////////////////////


    function saveGame(){
            var values = $(this).serialize();

            var posting = $.post("/games",function(data){
              // upon saving what needs to happen in the dom? 
              // NOTHING... I believe             
            });
            
        };
    // to insert an x into the first box (top left) do
    // firstRow = $("[data-y=0]") 
    // firstRow[0].innerText = "X"



    function previousGames(){
               $.get("/games", function(data){
                // once we have all the games, what needs to happen in the dom?
                // we need to create a button for each under div(#games)
                var games = data
                debugger;
                //to get state of first game we have to dig to the below
                //games["data"][0]["attributes"]["state"] 
            });
        };


    
    // games.forEach(function (game){
    //     console.log('<ul><button id="element.id"> element.id </button><ul>')
    // });
    // debugger;

 