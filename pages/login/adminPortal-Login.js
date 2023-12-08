import { API_URL } from "../../settings.js";

initLogin()

function initLogin() {
  console.log("init")
  document.getElementById("loginForm").style.display = "block";

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    login();
  });
}

async function login() {
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch(
        API_URL + "/auth/adminPortal-login",
        makeOptions("POST", { username, password }, false)
      );
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const loggedInUser = data.username;
        loggedInMessage.textContent = `Logged in as ${loggedInUser}`;
        console.log(data.token);
        const roles = data.roles;
  
        // Store the token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("username", loggedInUser);
        localStorage.setItem("roles", roles);

        window.location.href = "/";
      } else {
        loggedInMessage.textContent =
          "Login failed. Please check your credentials.";
      }
    } catch (error) {
      console.error("Error:", error);
      loggedInMessage.textContent = "An error occurred during login.";
    }
  }

  function makeOptions(method, body, addToken) {
    const opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
     if (addToken && localStorage.getItem("token")) {
      opts.headers.Authorization = "Bearer " + localStorage.getItem("token")
    }
    return opts;
  }