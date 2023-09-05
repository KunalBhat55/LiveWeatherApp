const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/weatherApi.html");
});


app.post("/", async (req, res) => {
  const city = req.body.cityName;
  const appId = process.env.API_ID;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=metric`;

  https.get(url, (httpRes) => {
    // response from our server

    console.log(httpRes.statusCode);
    if (httpRes.statusCode == 404) {
      res.status(404).sendFile(__dirname + "/error.html");
      
    } 
    else {
      try {
        httpRes.on("data", (data) => {
          // event triggered when data received

          const weatherData = JSON.parse(data); // stringyfy

          const temp = weatherData.main.temp;
          const weatherDescription = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const image = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          res.setHeader("Content-Type", "text/html utf-8"); // for html-res
          res.write('<meta charset="UTF-8">');
          res.write(`<body style="background-image: url('/images/img4.jpg');background-size: cover;
                     background-position: center;
                     display:flex;
                     flex-direction:column;
                     justify-content:center;
                     align-items:center;
                     font-family: 'Trebuchet MS', sans-serif;
                     font-weight: bolder;"></body>`);

          res.write(
            `<center><h2>The Temperature in ${weatherData.name} is </h2></center>`
          );
          res.write(`<center><h1>${temp} °C</h1></center>`);
          res.write(
            `<center><h4>The Weather is currently ${weatherDescription}</h4></center>`
          );
          res.write(`<center><img src = "${image}"></center>`);

          res.send();
        }); // httpsResEnds
      } catch (err) {
        console.log(err);
        res.json({ error: err });
      }
    }

  }); // httpsEnds
}); //postEnds8

app.listen(3000, () => {
  console.log("Server is running on port http://127.0.0.1:3000/");
});
