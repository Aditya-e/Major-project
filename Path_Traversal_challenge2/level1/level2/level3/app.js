const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Base directory where files are stored (same folder as app.js)
const basePath = __dirname; // Same directory as app.js

// Redirect root to the view endpoint, encoding the file name in the URL
app.get("/", (req, res) => {
  res.redirect("/view?file=entry.txt"); // Normal access, no path traversal
});

// Path traversal vulnerability in the file parameter
app.get("/view", (req, res) => {
  let fileName = req.query.file;
  console.log(fileName);

  if (!fileName) {
    return res.send("Please provide a file parameter!");
  }

  // URL decode the file name parameter (this is where encoding comes into play)
  const decodedFileName = decodeURIComponent(fileName);

  // Check if the decoded file name contains the encoded traversal sequence '%2E%2E%2F' (encoded ../)
  if (fileName.includes("%2E%2E%2F")) {
    // Allow traversal if the encoded path contains '../' (i.e., %2E%2E%2F)
    console.log("Path traversal allowed with encoded '%2E%2E%2F'!");
  } else if (fileName.includes("../")) {
    return res.send("Path traversal detected! Access denied.");
  }
  console.log(decodedFileName);
  // Create the file path directly from the decoded file name
  let filePath = path.join(basePath, decodedFileName);

  // Ensure the file is still within the basePath (i.e., no directory traversal allowed)
  //   if (!filePath.startsWith(basePath)) {
  //     return res.send("Access denied: Invalid file path.");
  //   }

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
