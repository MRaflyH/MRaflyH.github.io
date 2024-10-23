var UserDemo = "Demo Account"

function getUserName(){
  document.getElementById("user-id").innerHTML = UserDemo;
}

document.addEventListener("DOMContentLoaded", () => {
  getUserName();
});