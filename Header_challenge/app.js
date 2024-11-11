const express = require("express");
const app = express();
const PORT = 9003;

// Middleware to simulate the access control based on the custom header
app.use((req, res, next) => {
  const customHost = req.headers["x-custom-id"];
  if (customHost === "admin.revengg.com") {
    console.log("Access granted to admin area");
    res.send(
      "<h1>Admin Area</h1><p>Here is your flag: revengg{m1nd_cu5t0m_h3@d3rs}</p>"
    );
  } else {
    next(); // Allow normal user flow if the custom header isn't set correctly
  }
});

// Root route with form to trigger admin access
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Header Challenge</title>
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
          'X-Custom-ID': 'user.revengg.com', // Default header value
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

// Admin route where the custom header is checked
app.post("/admin", (req, res) => {
  const customHost = req.headers["x-custom-id"];

  if (customHost === "admin.revengg.com") {
    res.send(
      "<h1>Admin Area</h1><p>Here is your flag: CTF{admin_header_access}</p>"
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
