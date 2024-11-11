const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Base directory where files are stored (same folder as app.js)
const basePath = __dirname; // Same directory as app.js

// Redirect root to the view endpoint
app.get("/", (req, res) => {
  res.redirect("/view?file=entry.txt");
});

// Path traversal vulnerability in the file parameter
app.get("/view", (req, res) => {
  const fileName = req.query.file;

  if (!fileName) {
    return res.send("Please provide a file parameter!");
  }

  // Create the full path from the base path and file name (without any validation)
  const filePath = path.join(basePath, fileName);

  // Read the contents of the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.send("File not found!");
    }

    // Return the contents of the file
    res.send(`<pre>${data}</pre>`);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
