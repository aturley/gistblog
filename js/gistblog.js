var getGists = function(username) {
    $.getScript("https://api.github.com/users/" + username + "/gists?callback=handleGists");
};

var renderPostBody = function(gistGUID, bodyText) {
    $("#" + gistGUID).html(bodyText);
};

var handleGists = function(retVal) {
    var gists = retVal.data;
    var gistposts = $.grep(gists, function(element, index) {
                              console.log("checking gist \"" + element.description.slice(0, 8) + "\"");
                               return (element.description.slice(0, 8) === "BLOGPOST");
                           });
    var blogposts = $.map(gistposts, function(element, index) {
                              console.log("found post \"" + element.description + "\"");
                              var blogpost = new Object();
                              blogpost.title = element.description;
                              blogpost.date = element.created_at;
                              blogpost.bodyFile = element.files["gistfile1.txt"].raw_url;
                              blogpost.id = element.id;
                              blogpost.render = function() {
                                  var script = document.createElement( 'script' );
                                  script.type = 'text/javascript';
                                  var url = "https://gist.github.com/" + element.id + ".js";
                                  script.src = url;
                                  console.log("getting body for script " + script.src);
                                  $.getScript(url, function(d) {console.log("done"); console.log(d)});
                              };
                              return blogpost;
                          });

    console.log("found " + blogposts.length + " blogposts");

    renderBlogposts(blogposts);
};

var renderBlogposts = function(blogposts) {
    $.each(blogposts, function(index, element) {
               console.log("rendering " + element.id);
               var newPostDiv = $('<div class="post" id="' + element.id + '"/>');
               $("#posts").append(newPostDiv);
               element.render();
           });
};

$(document).ready(function(){
                      getGists("aturley");
                  });