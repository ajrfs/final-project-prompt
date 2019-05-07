'use strict';
  var firebaseConfig = {
    apiKey: "AIzaSyCawzBRghfWvtygS21ZBPLjqYtT6vuQThc",
    authDomain: "sharing-movies.firebaseapp.com",
    databaseURL: "https://sharing-movies.firebaseio.com",
    projectId: "sharing-movies",
    storageBucket: "sharing-movies.appspot.com",
    messagingSenderId: "208118439961",
    appId: "1:208118439961:web:aea9ab220a8189e8"
  };
  
 firebase.initializeApp(firebaseConfig);
  
 var movieAppReference = firebase.database()

$( document ).ready(function() {
   getMovies() 

  $('.search').click(function() {
    event.preventDefault()
    var getMov = $('#movie').val();
    getMovieInfo(getMov);
    $('#movie').val('');
    
  function getMovieInfo(movieTitle) {
  var Url = "http://www.omdbapi.com/";
  var apikey = 'd3e93015';
  $.ajax({
    url: Url,
    type: 'GET',
    data: {
      t: movieTitle,
      apikey: apikey
    },

    success: function(response){
      console.log(response)
      var title = response.Title;
      var imgSrc = response.Poster;
      var actor = response.Actors;
      var year = response.Year;
       
  $('#popUp').fadeIn();
   let movieS = `<img src="${imgSrc}" alt=""/>
      <h2> ${title}  <span>${year}</span></h2>
      <h3> ${actor}</h3>`
       
  $('#container').append(movieS);
        
  $('.closePopUp , .popUpAction').click(function (){
     $('#container').empty();
     $('#popUp').fadeOut(); 
   });

 $('.popUpAction').click(function(){

    movieAppReference.ref('rating').push({
      poster : imgSrc,
      title :title,
      votes: 0
       })
      });
     }  
    }) 
   } 
  });

  function getMovies() { 
    movieAppReference
     .ref('rating')
     .on('value', (results) => {
      $('.movie-board').empty()
      let allMovies = results.val()
      
      for (let id in allMovies) {

        var like = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        like.on('click', (e) => {
          let updatedLikes = parseInt(e.target.parentNode.getAttribute('data-votes')) + 1
          movieAppReference
            .ref(`rating/${id}/`)
            .update({votes: updatedLikes})
        }) 

        var dislike = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
        dislike.on('click', (e) => {
          let updatedDislikes = parseInt(e.target.parentNode.getAttribute('data-votes')) - 1
          movieAppReference
            .ref(`rating/${id}/`)
            .update({votes: updatedDislikes})
        })        
        
        var deletedMovie = $(`<i class="fa fa-trash pull-right delete"></i>`)
        deletedMovie.on('click', (e) => { 
          movieAppReference
          .ref(`rating/${id}`)
          .remove() 
        })

        var showedVotes = $(`<div class="pull-right">${allMovies[id].votes}</div>`)
        let newMovie = $(`
        <img src="${allMovies[id].poster}" alt=""/>
        <h2 id=${id} data-votes=${allMovies[id].votes}>${allMovies[id].title}</h2>
        `);

        newMovie
          .append(showedVotes)
          .append(like)
          .append(dislike)
          .append(deletedMovie)

        $('.movie-board').append(newMovie);

      }
    })
  }  
}) 