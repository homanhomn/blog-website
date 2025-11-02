let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// ======= HOME PAGE =======
if (document.title === "My Blog") {
  const postsDiv = document.getElementById("posts");

  function renderPosts(list = posts) {
    postsDiv.innerHTML = "";
    if (list.length === 0) {
      postsDiv.innerHTML = "<p>No posts yet.</p>";
      return;
    }
    list.forEach((post, i) => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h3>${post.title}</h3>
        <p class="category">Category: ${post.category}</p>
        <p>${post.content.substring(0,120)}...</p>
        <div class="post-actions">
          <button onclick="viewPost(${i})">View</button>
          <button onclick="editPost(${i})">Edit</button>
          <button onclick="deletePost(${i})">Delete</button>
        </div>
      `;
      postsDiv.appendChild(div);
    });
  }

  window.addPost = function() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const category = document.getElementById("category").value;
    if (!title || !content || !category) return alert("Fill all fields!");

    posts.push({ title, content, category, comments: [] });
    savePosts();
    renderPosts();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("category").value = "";
  };

  window.deletePost = function(i) {
    if (confirm("Delete this post?")) {
      posts.splice(i, 1);
      savePosts();
      renderPosts();
    }
  };

  window.editPost = function(i) {
    const newTitle = prompt("Edit title:", posts[i].title);
    const newContent = prompt("Edit content:", posts[i].content);
    if (newTitle && newContent) {
      posts[i].title = newTitle;
      posts[i].content = newContent;
      savePosts();
      renderPosts();
    }
  };

  window.viewPost = function(i) {
    localStorage.setItem("currentPost", i);
    window.location.href = "post.html";
  };

  window.filterPosts = function() {
    const selected = document.getElementById("filter").value;
    if (selected === "All") {
      renderPosts(posts);
    } else {
      const filtered = posts.filter(p => p.category === selected);
      renderPosts(filtered);
    }
  };

  renderPosts();
}

// ======= POST PAGE =======
if (document.title === "Blog Post") {
  const index = localStorage.getItem("currentPost");
  const post = posts[index];
  const postDiv = document.getElementById("postContent");
  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");

  if (!post) {
    postDiv.innerHTML = "<p>Post not found.</p>";
  } else {
    postDiv.innerHTML = `
      <h2>${post.title}</h2>
      <p class="category">Category: ${post.category}</p>
      <p>${post.content}</p>
    `;
  }

  function renderComments() {
    commentList.innerHTML = "";
    post.comments.forEach(c => {
      const li = document.createElement("li");
      li.className = "comment";
      li.textContent = c;
      commentList.appendChild(li);
    });
  }

  window.addComment = function() {
    const text = commentInput.value.trim();
    if (!text) return;
    post.comments.push(text);
    commentInput.value = "";
    savePosts();
    renderComments();
  };

  if (post) renderComments();
}
