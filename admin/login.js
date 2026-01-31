function adminLogin(e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // 🔐 CHANGE THESE
    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html";
    } else {
        document.getElementById("error").innerText = "Invalid credentials";
    }
}
