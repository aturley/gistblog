var converter = new Showdown.converter();

var getGists = function(username) {
    $.getScript("https://api.github.com/users/" + username + "/gists?callback=handleGists");
};

var renderPostBody = function(gistGUID, dateText, timeText, titleText, gistURL, bodyText) {
    $("#" + gistGUID + "-date").html(dateText);
    $("#" + gistGUID + "-time").html(timeText);
    $("#" + gistGUID + "-title").html("<a href = \"#" + gistGUID+ "\">" + titleText + "</a>");
    $("#" + gistGUID + "-gist").html("<a href=\"" + gistURL + "\">gist</a>");
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
                              blogpost.gistURL = element.html_url;
                              blogpost.id = element.id;
                              blogpost.render = function() {
                                  var url = "https://api.github.com/gists/" + element.id + "?callback=?";
                                  console.log("getting body for script " + url);
                                  $.getJSON(url, function(d) {
                                                if (d.data.files["gistfile1.md"]) {
                                                    var body = converter.makeHtml(d.data.files["gistfile1.md"].content);
                                                    renderPostBody(element.id, blogpost.date, blogpost.time, blogpost.title, blogpost.gistURL, body);
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
               var newPostDiv = $("#postPrototype").clone(true, true);
               $("#posts").append(newPostDiv);
               newPostDiv.attr("id", element.id);
               newPostDiv.attr("class", "post");
               newPostDiv.children(".postTitle").attr("id", element.id + "-title");
               newPostDiv.children(".postDate").attr("id", element.id + "-date");
               newPostDiv.children(".postTime").attr("id", element.id + "-time");
               newPostDiv.children(".postGist").attr("id", element.id + "-gist");
               newPostDiv.children(".postBody").attr("id", element.id + "-body");

               // $(newPostDiv).append(newPostDateDiv, newPostTimeDiv, newPostTitleDiv, newPostGistDiv, newPostBodyDiv);

               // $(newPostDiv).append(newPostDateDiv);
               // $(newPostDiv).append(newPostTitleDiv);
               // $(newPostDiv).append(newPostBodyDiv);

               element.render();
           });
};

var getGist = function(gistId) {
    var url = "https://api.github.com/gists/" + gistId + "?callback=handleGist";
    console.log("getGist(" + gistId + "), url: " + url);
    $.getScript(url);
};

var handleGist = function(gist) {
    console.log("handleGist()");
    console.log("handling");
    console.log(gist);
    handleGists({data:[gist.data]});
};

$(document).ready(function(){
                      var href = window.location.href;
                      var host = window.location.host;
                      var username = host.substring(0, host.indexOf("\."));
                      console.log("window.location.pathname: " + window.location.href);
                      if (href.indexOf("#") < 0) {
                          console.log("get all posts");
                          getGists(username);
                      } else {
                          console.log("get one post");
                          var gistId = href.substr(href.indexOf("#") + 1);
                          console.log("get post " + gistId);
                          getGist(gistId);
                      }
                  });