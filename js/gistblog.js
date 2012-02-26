var getGists = function(username) {
    $.getScript("https://api.github.com/users/" + username + "/gists?callback=handleGists");
};

var renderPostBody = function(gistGUID, dateText, timeText, titleText, bodyText) {
    $("#" + gistGUID + "-date").html(dateText);
    $("#" + gistGUID + "-time").html(timeText);
    $("#" + gistGUID + "-title").html(titleText);
    $("#" + gistGUID + "-body").html(bodyText);
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
                              blogpost.title = element.description.slice(8);
                              blogpost.date = new Date(element.created_at).toLocaleDateString();
                              blogpost.time = new Date(element.created_at).toLocaleTimeString();
                              blogpost.bodyFile = element.files["gistfile1.txt"].raw_url;
                              blogpost.id = element.id;
                              blogpost.render = function() {
                                  var url = "https://api.github.com/gists/" + element.id + "/comments?callback=?";
                                  console.log("getting body for script " + url);
                                  $.getJSON(url, function(d) {
                                                if (d.data.length > 0) {
                                                    var body = d.data[0].body;
                                                    renderPostBody(element.id, blogpost.date, blogpost.time, blogpost.title, body);
                                                }
                                            });
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

               var newPostDateDiv = $('<div class="postdate" id="' + element.id + '-date"/>');
               var newPostTimeDiv = $('<div class="posttime" id="' + element.id + '-time"/>');
               var newPostTitleDiv = $('<div class="posttitle" id="' + element.id + '-title"/>');
               var newPostBodyDiv = $('<div class="postbody" id="' + element.id + '-body"/>');

               $(newPostDiv).append(newPostDateDiv, newPostTimeDiv, newPostTitleDiv, newPostBodyDiv);

               // $(newPostDiv).append(newPostDateDiv);
               // $(newPostDiv).append(newPostTitleDiv);
               // $(newPostDiv).append(newPostBodyDiv);

               element.render();
           });
};

$(document).ready(function(){
                      getGists("aturley");
                  });