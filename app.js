const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  flag = "revengg{trial_challenge}";
  res.set({
    "Content-Type": "text/html",
    "Custom-header": "fuck you",
  });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>
<body>
    <h1>Hello ${flag}</h1>
</body>
</html>`;
  res.status(200).send(html);
});

app.get("/reflected-xss", (req, res) => {
  const name =
    req.query.name.replaceAll("<", "").replaceAll(">", "") || "Taylor Swift";
  console.log(name);
  res.set({
    "Content-Type": "text/html",
    "Custom-header": "fuck you",
  });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>
<body>
    <h1>Hello ${name}</h1>
</body>
</html>`;
  res.status(200).send(html);
});

app.get("/reflected-xss-2", (req, res) => {
  const url =
    req.query.url.replaceAll("<", "").replaceAll(">", "") ||
    "https://www.evil.com";
  console.log(url);
  res.set({
    "Content-Type": "text/html",
    "Custom-header": "fuck you",
  });
  html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>const
        <a href="https://${url}">Click to go to the website</a>
    </body>
    </html>`;
  res.status(200).send(html);
});

const port = process.env.PORT || 8180;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
