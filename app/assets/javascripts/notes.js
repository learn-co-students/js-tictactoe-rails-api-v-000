  // $('body').on('click', 'button.saved-game', function(e){
  //   // sends a GET request to the "/games/:id" route
  //   // TypeError: Cannot read property 'method' of undefined

  //   $.ajax({
  //     type: 'GET',
  //     url: `/games/${this.dataset.id}`,
  //     // data: {id: `${gameId}`, state: state},
  //     success: (function (response){
  //       // setMessage(`Game ${data.data.id} PATCHED.`)
  //       // console.log(`Game ${data.data.id} patched.`)
  //       // debugger
  //       loadGame(response)
  //     })
  //   })



    // $.GET(`/games/${this.dataset.id}`, function(response){
    //   $('div#game').html(`${response.data.id}`)
    // })
  // })




  $('body').on('click', 'button.saved-game', function(e){
    $.ajax({
      type: 'GET',
      url: `/games/${this.dataset.id}`,
      dataType: 'json',
      success: (function (response){
      })
    })
  })


  //loadGame
  function loadGame(gameId){
    $.get(`/games/${gameId}`, function(response){
      for(let i = 0; i < 9; i++){
        $('td')[i].innerHTML = response.data.attributes.state[i]
      }
      setMessage(`Game ${response.data.id} loaded.`)
    })
  }
