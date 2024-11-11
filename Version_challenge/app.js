const express = require("express");
const bodyParser = require("body-parser");
const bodyParserXml = require("body-parser-xml");
const app = express();
const PORT = 3000;

// Simulated database with user IDs and passwords
const users = {
  1: { password: "user1password" },
  2: { password: "admincool123" },
  3: { password: "let me give a dog" },
  4: { password: "Nope, not here" },
  5: { password: "Almost there.." },
  6: { password: "revengg{n1c3_try_f0rm@t}" },
};

// Initialize body-parser-xml with express
bodyParserXml(bodyParser); // Extend body-parser to handle XML parsing

// Use JSON and XML parsing middleware
app.use(bodyParser.json()); // To parse application/json requests
app.use(bodyParser.xml()); // To parse application/xml requests

// /v1/password allows IDOR with XML format but restricts to user_id 1 in JSON
app.get("/v1/password", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>v1 Password Request</title>
    </head>
    <body>
      <h1>Request Password (v1)</h1>
      <form action="/v1/password" method="POST" id="v1Form">
        <label for="user_id">Enter User ID:</label>
        <input type="number" id="user_id" name="user_id" value="1" required>
        <button type="submit">Submit</button>
      </form>
    </body>
    <script>
      document.getElementById('v1Form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        let userId = document.getElementById('user_id').value;

        // Send the request as JSON by default
        fetch('/v1/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        })
        .then(response => response.json())
        .then(data => alert('Password: ' + data.password))
        .catch(error => alert('Error: ' + error));
      });
    </script>
    </html>
  `);
});

app.post("/v1/password", (req, res) => {
  const contentType = req.headers["content-type"];
  const userId = parseInt(req.body.user_id); // Extract user_id from parsed XML or JSON

  if (contentType === "application/json" && userId !== 1) {
    return res
      .status(403)
      .send("Forbidden: Only user_id 1 is accessible with JSON format.");
  } else if (contentType === "application/xml" && users[userId]) {
    return res.send({
      message: "Password retrieved successfully (XML format)",
      password: users[userId].password,
    });
  } else if (users[userId]) {
    return res.send({
      message: "Password retrieved successfully (JSON format)",
      password: users[userId].password,
    });
  } else {
    res.status(404).send("User not found");
  }
});

// /v2/password denies access to any user_id other than 1 in both JSON and XML
app.get("/v2/password", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>v2 Password Request</title>
    </head>
    <body>
      <h1>Request Password (v2)</h1>
      <form action="/v2/password" method="POST" id="v2Form">
        <label for="user_id">Enter User ID:</label>
        <input type="number" id="user_id" name="user_id" value="1" required>
        <button type="submit">Submit</button>
      </form>
    </body>
    <script>
      document.getElementById('v2Form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        let userId = document.getElementById('user_id').value;

        fetch('/v2/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        })
        .then(response => response.json())
        .then(data => alert('Password: ' + data.password))
        .catch(error => alert('Error: ' + error));
      });
    </script>
    </html>
  `);
});

app.post("/v2/password", (req, res) => {
  const userId = parseInt(req.body.user_id);

  if (userId !== 1) {
    return res
      .status(403)
      .send("Forbidden: Access to other user passwords is denied.");
  }

  // If user_id is 1, return password
  res.send({
    message: "Password retrieved successfully",
    password: users[userId].password,
  });
});

// Root route redirects to /v2/password
app.get("/", (req, res) => {
  res.redirect("/v2/password");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
