var loader = document.getElementById("scroll-loader");
var postsContainer = document.getElementById("all-posts-container");
var postsList = null;
var loading = false;

loadPostsList();

function setupInfiniteScroll() {
  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadNextPost();
    }
  };
}

function loadPostsList() {
  var xhttp = new XMLHttpRequest();
  loading = true;
  xhttp.onreadystatechange = function () {
    loading = false;
    if (this.readyState == 4 && this.status == 200) {
      setupInfiniteScroll();
      postsList = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", "all_posts.json", true);
  xhttp.send();
}

function loadNextPost() {
  var lastLoadedPost = document.querySelector(
    "#all-posts-container .post:last-child a.post-link"
  ).href;

  lastLoadedPost = "/" + lastLoadedPost.split("/").pop();

  var nextPost = null;
  Array.from(postsList.posts).forEach(function (post, index, arr) {
    if (post == lastLoadedPost) {
      nextPost = index + 1 in arr ? arr[index + 1] : false;
    }
  });

  if (nextPost) {
    ajaxLoadPost(nextPost);
  } else {
    loader.style.display = "none";
  }
}
function ajaxLoadPost(url) {
  var xhttp = new XMLHttpRequest();
  loading = true;
  xhttp.onreadystatechange = function () {
    loading = false;
    if (this.readyState == 4 && this.status == 200) {
      var element = document.createElement("div");
      element.innerHTML = this.responseText;
      addNewPostToDom(element, url);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function addNewPostToDom(element, url) {
  var title = element.querySelector(".post-header h1").innerHTML;
  var meta = element.querySelector(".post-header .post-meta").innerHTML;
  var content = element.querySelector(".post-content").innerHTML;

  var html =
    `
      <p class="post-meta">
      ` +
    meta +
    `
      </p>
      <a href="` +
    url +
    `" class="post-link">
        <h3 class="h1 post-title">` +
    title +
    `</h3>
      </a>
      <article class="post-content">
      ` +
    content +
    `
      </article>`;
  newNode = document.createElement("div");
  newNode.className = "post py3";
  newNode.innerHTML = html;
  document.querySelector("#all-posts-container").append(newNode);
}
