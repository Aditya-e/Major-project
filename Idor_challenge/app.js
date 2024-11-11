const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 9001;

// Use middleware to parse cookies
app.use(cookieParser());

// Route to set the default user cookie
app.get("/", (req, res) => {
  if (!req.cookies.userId) {
    // Set a default user cookie (non-privileged user)
    res.cookie("userId", "1", { httpOnly: true });
  }

  res.send(`
    <h1>IDOR Challenge</h1>
    <p>Welcome! Try to access your account details at <a href="/profile">/profile</a></p>
  `);
});

// Route to display user profile based on userId cookie
app.get("/profile", (req, res) => {
  const userId = req.cookies.userId;

  // Check the userId in the cookie and return different content
  if (userId === "1") {
    res.send(`
      <h1>User Profile</h1>
      <p>Welcome, User 1! Seems like you are looking for something.</p>
      <p>(It is not for you though)</p>
    `);
  } else if (userId === "2") {
    res.send(`
      <h1>Admin Profile</h1>
      <p>Welcome, Admin! Here is your flag: revengg{1d0R_iN_c00ki3}</p>
    `);
  } else {
    res.send(`
      <h1>User Profile</h1>
      <p>Invalid user ID.</p>
    `);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`IDOR Challenge running at http://localhost:${PORT}`);
});
