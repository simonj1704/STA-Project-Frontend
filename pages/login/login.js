let isLoggedIn = false;

export function initLogin() {
  if (!isLoggedIn) {
    document.getElementById("menu").style.display = "none";
  }
  document.getElementById("submit-btn").onclick = performLogin;
  document.getElementById("log-out").onclick = logOut;
}

async function performLogin() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let errorMessage = document.getElementById("error-message");

  try {
    const response = await fetch("http://localhost:8080/api/auth/adminPortal-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      document.getElementById("menu").style.display = "block";
      console.log("Success");
      const data = await response.json();
      localStorage.setItem("token", data.token);
      isLoggedIn = true;
      console.log(data);
      document.getElementById("logged-in-as").innerText = "Logged in as " + data.username;
      document.getElementById("login-div").style.display = "none";
      document.getElementById("log-out").style.display = "block";
    } else {
      console.error("Error logging in: " + response.status);
      errorMessage.innerText = "Error logging in. Please check your credentials.";
      errorMessage.style.display = "block";
      throw new Error();
    }
  } catch (error) {
    console.log("Error fetching: " + error.message);
  }
}

async function logOut() {
  localStorage.removeItem("token");
  document.getElementById("logged-in-as").innerText = "";
  document.getElementById("login-div").style.display = "block";
  document.getElementById("log-out").style.display = "none";
  document.getElementById("menu").style.display = "none";
}
