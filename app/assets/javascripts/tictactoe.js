// Code your JavaScript / jQuery solution here
window.onload = function(){
  console.log("The window has loaded")
  saveGame()
}
  
function gameControl(){
  document.getElementsByTagName("button")
}

function saveGame(){
  const buttons = document.querySelectorAll("button")
  buttons.forEach((button)=> {
    button.addEventListener('click', function(e){
      window[`${this.id}`]()      
    });
  });
}


function save(){
  console.log("SAVE")
  fetch('/games', {
    method: 'PATCH'
  })
}

function previous(){
  console.log("PREVIOUS")
}

function clear(){
  console.log("CLEAR")
}