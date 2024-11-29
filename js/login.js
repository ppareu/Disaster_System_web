document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const showSignupLink = document.getElementById("show-signup");
  const showLoginLink = document.getElementById("show-login");

  // 회원가입 링크 클릭 시 이벤트 핸들러
  showSignupLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  });

  // 로그인 링크 클릭 시 이벤트 핸들러
  showLoginLink.addEventListener("click", function (event) {
    event.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // 로그인 폼 제출 이벤트 핸들러
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/"; // 메인 페이지로 리다이렉트
        } else {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error:", error);
      });
  });

  // 회원가입 폼 제출 이벤트 핸들러
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const phone = document.getElementById("phone").value;
    const birthdate = document.getElementById("birthdate").value;
    const location = document.getElementById("location").value;

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, phone, birthdate, location }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        loginForm.style.display = "block";
        signupForm.style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
