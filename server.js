const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 3000;
const projectData = {};

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + "/website"));

// Controllers
app.get("/entry", function (req, res) {
  res.send(projectData);
});
app.post("/entry", function (req, res) {
  const { temp, date, feelings } = req.body;
  if (temp && date && feelings) {
    projectData["temp"] = temp;
    projectData["date"] = date;
    projectData["feelings"] = feelings;
    res.send(projectData);
  } else {
    res
      .status(422)
      .send(
        "Missing parameters: Please provide both zip code and your feeling!"
      );
  }
});

// Server
app.listen(port, function () {
  console.log(`Weather app is listening on port ${port}!`);
});
