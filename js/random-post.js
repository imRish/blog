var postsList = null;
getRandomPostUrl();

function getRandomPostUrl() {
  var xhttp = new XMLHttpRequest();
  loading = true;
  xhttp.onreadystatechange = function () {
    loading = false;
    if (this.readyState == 4 && this.status == 200) {
      postsList = JSON.parse(this.responseText);
      postsList = postsList.posts.filter(function (url) {
        var currentUrl = "/" + location.href.split("/").pop();
        return currentUrl != url;
      });
      var url = postsList[Math.floor(Math.random() * postsList.length)];
      document.querySelector(".pagination .random").setAttribute("href", url);
    }
  };
  xhttp.open("GET", "all_posts.json", true);
  xhttp.send();
}
