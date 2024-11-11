const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const app = express();
const PORT = 9002;

// Generate MD5 hash
function md5Hash(text) {
  return crypto.createHash("md5").update(text).digest("hex");
}

// Dummy identifiers for users
const userHash = md5Hash("user123"); // Non-admin hash
const adminHash = md5Hash("admin123"); // Admin hash (hidden from participants)

// Middleware to parse cookies
app.use(cookieParser());

// Root route to set the user cookie with hash
app.get("/", (req, res) => {
  if (!req.cookies.userId) {
    res.cookie("userId", userHash, { httpOnly: true });
  }

  res.send(`
    <p>Welcome! Try to access your profile at <a href="/profile">/profile</a></p>
  `);
});

app.get("/robots.txt", (req, res) => {
  res.send("just change user to admin");
});
// Profile route to check the hashed userId
app.get("/profile", (req, res) => {
  const userIdHash = req.cookies.userId;

  if (userIdHash === userHash) {
    res.send(`
      <h1>User Profile</h1>
      <p>Welcome, standard user! Access is restricted.</p>
      <p>Hint: Administrators have access to something more...</p>
    `);
  } else if (userIdHash === adminHash) {
    res.send(`
      <h1>Admin Profile</h1>
      <p>Welcome, Admin! Here is your flag: revengg{h@sh_@nd_1d0r}</p>
    `);
  } else {
    res.send(`
      <h1>User Profile</h1>
      <p>Invalid access detected. Try again.</p>
    `);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`IDOR Hash Challenge running at http://localhost:${PORT}`);
});
