const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 9004;

// Use middleware to parse cookies
app.use(cookieParser());

// Middleware to simulate the access control based on custom header and cookie
app.use((req, res, next) => {
  const customHost = req.headers["x-custom-host"];
  const adminPrivilegesCookie = req.cookies["admin-privileges"]; // Plain text cookie name

  // Triple base64 encode 'true' and 'false' values
  const requiredCookieValue = Buffer.from(
    Buffer.from(Buffer.from("true").toString("base64")).toString("base64")
  ).toString("base64");
  const defaultCookieValue = Buffer.from(
    Buffer.from(Buffer.from("false").toString("base64")).toString("base64")
  ).toString("base64");

  // If cookie does not exist, set it to default value (triple encoded 'false')
  if (!adminPrivilegesCookie) {
    res.cookie("admin-privileges", defaultCookieValue, { httpOnly: true });
  }

  // Check if both the custom header and the cookie are set correctly
  if (
    customHost === "admin.revengg.com" &&
    adminPrivilegesCookie === requiredCookieValue
  ) {
    console.log("Access granted to admin area");
    res.send(
      "<h1>Admin Area</h1><p>Here is your flag: revengg{m1nd_cu5t0m_h3@d3rs_and_c00ki3s}</p>"
    );
  } else {
    next(); // Allow normal user flow if access requirements are not met
  }
});

// Root route to introduce the challenge and set the default cookie
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Header & Cookie Challenge</title>
</head>
<body>
  <h1>Normal User Area</h1>
  <p>You are currently a normal user. Click the button to go to the admin panel.</p>
  <form id="adminForm">
    <button type="submit" id="adminBtn">Go to Admin Panel</button>
  </form>
  
  <script>
    // Intercept form submission to manually send the custom header with fetch
    document.getElementById('adminForm').addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent the default form submission
      
      // Set up the request to submit with a custom header
      fetch('/admin', {
        method: 'POST',
        headers: {
          'X-Custom-Host': 'normal-user.revengg.com', // Default header value
        },
        body: JSON.stringify({ action: 'go-to-admin' }), // Sending a body if needed
        credentials: 'same-origin', // Include cookies if necessary
      })
      .then(response => response.text())
      .then(text => {
        document.body.innerHTML = text; // Display response in the body
      })
      .catch(err => {
        console.error('Error:', err);
      });
    });
  </script>
</body>
</html>
  `);
});

// Admin route where the custom header and cookie value are checked
app.post("/admin", (req, res) => {
  const customHost = req.headers["x-custom-host"];
  const adminPrivilegesCookie = req.cookies["admin-privileges"]; // Plain text cookie name

  const requiredCookieValue = Buffer.from(
    Buffer.from(Buffer.from("true").toString("base64")).toString("base64")
  ).toString("base64");

  if (
    customHost === "admin.revengg.com" &&
    adminPrivilegesCookie === requiredCookieValue
  ) {
    res.send(
      "<h1>Admin Area</h1><p>Here is your flag: CTF{admin_header_and_cookie_access}</p>"
    );
  } else {
    res.send(
      "<h1>Access Denied</h1><p>You are not authorized to access the admin area.</p>"
    );
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
