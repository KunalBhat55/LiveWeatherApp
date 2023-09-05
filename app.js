
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

  res.sendFile(__dirname + "/weatherApi.html");

});

app.post("/", async (req, res) => {

  const city = req.body.cityName;
  const appId =  "6cef7429e966d71f34a9ef707b28e8f8";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=metric`;

  https.get(url, (httpRes) => {   // response from our server

    console.log(httpRes.statusCode);
    try{

      httpRes.on("data", (data) => {  // event triggered when data received

      const weatherData = JSON.parse(data); // stringyfy
      
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const image = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      res.setHeader("Content-Type", "text/html"); // for html-res
      res.write(`<body style="margin-top:70px; background: radial-gradient(
          circle,
          rgb(211, 141, 171) 0%,
          rgba(148, 187, 233, 1) 100%
        ); font-family:cambria"></body>`)
        
      res.write(`<center><h2>The Temperature in ${weatherData.name} is ${temp} degrees celsius </h2></center>`);
      res.write(`<center><h4>The Weather is currently ${weatherDescription}</h4></center>`); 
      res.write(`<center><img src = "${image}"></center>`);
      res.send();

    }); // httpsResEnds
      
    }
    catch(err){
      console.log(err);
      res.send("City Not Found");

    }

  }); // httpsEnds

}); //postEnds8



app.listen(3000, () => {
  console.log("Server is running on port http://127.0.0.1:3000/");
});
