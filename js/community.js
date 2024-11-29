document.addEventListener("DOMContentLoaded", function () {
  const authItem = document.getElementById("auth-item");
  const postForm = document.getElementById("post-form");
  let loggedInUserId = null; // 로그인된 사용자의 ID를 저장할 변수

  fetch("/auth/status")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        loggedInUserId = data.userId; // 로그인된 사용자의 ID 저장
        authItem.innerHTML = `
          <span>${data.username}</span>
          <button id="logout-button">로그아웃</button>
        `;

        document
          .getElementById("logout-button")
          .addEventListener("click", function () {
            fetch("/logout", { method: "POST" }).then(() => {
              location.reload();
            });
          });

        postForm.addEventListener("submit", function (e) {
          e.preventDefault();

          const title = document.getElementById("post-title").value;
          const content = document.getElementById("post-content").value;

          fetch("/community/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
          })
            .then((response) => response.json())
            .then((post) => {
              addPostToDOM(post, data.username); // 작성한 게시물을 DOM에 추가
              document.getElementById("post-title").value = "";
              document.getElementById("post-content").value = "";
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      } else {
        authItem.innerHTML = `<a href="/login">Login</a>`;
        postForm.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  function addPostToDOM(post, username) {
    console.log("로그인된 사용자 ID:", loggedInUserId); // 디버깅용
    console.log("게시글 작성자 ID:", post.userId); // 디버깅용

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p>작성자: ${username}</p>
    `;

    if (post.userId === loggedInUserId) {
      // 작성자와 로그인된 사용자를 비교
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.setAttribute("data-id", post.id);
      deleteButton.textContent = "삭제";
      deleteButton.addEventListener("click", function () {
        const postId = this.getAttribute("data-id");

        fetch(`/community/posts/${postId}`, {
          method: "DELETE",
        })
          .then(() => {
            postElement.remove();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
      postElement.appendChild(deleteButton);
    }

    document.getElementById("community-window").appendChild(postElement);
  }

  function loadPosts() {
    fetch("/community/posts")
      .then((response) => response.json())
      .then((posts) => {
        const communityWindow = document.getElementById("community-window");
        communityWindow.innerHTML = ""; // 기존 게시물 초기화
        posts.forEach((post) => {
          addPostToDOM(post, post.User.username);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  loadPosts();
});
