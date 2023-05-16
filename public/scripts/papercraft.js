// Parse the URL
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// Give the URL parameters variable names
var source = getParameterByName('a');
var mOpen = false;

var imgsGot = false;
// Images loaded is zero because we're going to process a new set of images.
var imagesLoaded = 0;
// Total images is still the total number of <img> elements on the page.
var totalImages = $('img').length;
$(document).ready(function() {
  // Put the variable names into the hidden fields in the form.
  if (source != "" || source != null){
    fetch("../assets/artdescs.json")
      .then(response => response.json())
      .then(json =>{
        piece = json.papercraft[source]
        if (piece != undefined){
          document.title = piece.name + ' — Jessie Leslie'
          $(".tiltBox").addClass(piece.orientation)
          $("#menuButton").click(function(){
            mOpen = !mOpen
            if (mOpen){
              $("#menu").css({
                'transform': 'translateX(-500px)'
              })
            }
            else if (!mOpen){
              $("#menu").css({
                'transform': 'translateX(0)'
              })
            }
          });
          $("#menu").append(
            '<h1 id="name">'+ piece.name +'</h1><h2 id="author">'+ piece.author + ' ' + piece.year +'</h2><p id="description">'+ piece.description +'</p><a id="purchase"></a>'
          )
          if (piece.purchase){
            $("#purchase").text("Purchase?")
          }
          for (i = 0; i < piece.layers.length; i++){
            console.log(piece.layers[i])
            $(".tiltBox").append(
              "<img id='layer'" + i + "'' layer='" + i + "' class='layer' src='" + piece.directory + piece.layers[i] + "'>"
            )
            if ( i == piece.layers.length - 1){
              imgsGot = true;
              less.modifyVars({
                '@layerDepth': piece.layerDepth
              });
            }
          }
        }
        else{
          $(".other").append("<p>Something went wrong :/<br>Let me know about it?</p>")
          $('#menuButton').hide()
          $('#menu').hide()
        }
        //If all the images have been pulled from the JSON, then count to see if they've loaded all the way
        if (imgsGot == true){
          // Total images is still the total number of <img> elements on the page.
          totalImages = $('img').length;
          // Step through each image in the DOM, clone it, attach an onload event
          // listener, then set its source to the source of the original image. When
          // that new image has loaded, fire the imageLoaded() callback.
          $('img').each(function(idx, img) {
            $('<img>').on('load', imageLoaded).attr('src', $(img).attr('src'));
          });
        }
      });
  }
  else{
    $('#menuButton').hide()
    $('#menu').hide()
    //Please result or redirect to an error page
  }

  // Do exactly as we had before -- increment the loaded count and if all are
  // loaded, call the allImagesLoaded() function.
  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded == totalImages) {
      allImagesLoaded();
    }
  }

  function allImagesLoaded() {
    console.log('ALL IMAGES LOADED');
    $(".loading").hide();
  }
});
