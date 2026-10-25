const form = document.getElementById("login-form");
const error = document.getElementById("login-error");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Unlocking…";
  try {
    const response = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      credentials: "same-origin",
      body: JSON.stringify({password: document.getElementById("passcode").value.trim()})
    });
    if (!response.ok) throw new Error("That date doesn't seem right. Try again, my love. ♡");
    window.location.replace("/love.html");
  } catch (e) {
    error.textContent = e.message || "Couldn't unlock this page. Please try again.";
  } finally {
    button.disabled = false;
    button.innerHTML = 'Unlock our little world <span>→</span>';
  }
});
