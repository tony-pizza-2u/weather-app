/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

var apiKey = "0a42c217d6b17113f169cd07e7225d24";
var cityHistory = {};

function loadCity(city){

        document.getElementById("resultsArea").style.display = "block";

        //Find the city and convert to Lat/Lon
        var coordsURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

        fetch(coordsURL)
        .then((response) => response.json())
        .then((data) => {
    
            if(data.length == 0){
                console.log("City not found");
            } else {
    
                var latlon = {
                    lat: data[0].lat,
                    lon: data[0].lon
                };
    
                //Get the current weather and 5 day forcast
                var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=" + apiKey + "&units=imperial";                
    
                fetch(currentWeatherURL)
                .then((response) => response.json())
                .then((data) => {
    
                    //Display the current weather
                    var temp = data.main.temp;
                    var wind = data.wind.speed;
                    var humidity = data.main.humidity;
                    var icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
                    var date = new Date(data.dt * 1000).toLocaleDateString();
    
                    document.getElementById("currentCity").innerText = city;
                    document.getElementById("currentDate").innerText = "(" + date + ")";
                    document.getElementById("currentIcon").src = icon;
                    document.getElementById("currentTemp").innerText = "Temperature: " + temp + " °F";
                    document.getElementById("currentWind").innerText = "Wind Speed: " + wind + " MPH";
                    document.getElementById("currentHumidity").innerText = "Humidity: " + humidity + " %";
    
                    //Display the 5 day forecast
                    var fiveDayForcastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latlon.lat + "&lon=" + latlon.lon + "&appid=" + apiKey + "&units=imperial";

                    fetch(fiveDayForcastURL)
                    .then((response) => response.json())
                    .then((data) => {

                        var itemPosition = 0;

                        for(i = 0; i < data.list.length; i++){

                            var item = data.list[i];

                            var itemDate = new Date(item.dt_txt);

                            //Take only the weather reports from noon each day
                            if(itemDate.getHours() == 12){
                                
                                itemPosition++;

                                if(itemPosition < 6){

                                    //Fill out the corresponding day element

                                    var itemTemp = item.main.temp;
                                    var itemWind = item.wind.speed;
                                    var itemHumidity = item.main.humidity;
                                    var itemIcon = "https://openweathermap.org/img/wn/" + item.weather[0].icon + ".png";
                                    var itemDateLocal = itemDate.toLocaleDateString();
                    
                                    document.getElementById("day" + itemPosition + "Date").innerText = "(" + itemDateLocal + ")";
                                    document.getElementById("day" + itemPosition + "Icon").src = itemIcon;
                                    document.getElementById("day" + itemPosition + "Temp").innerText = "Temperature: " + itemTemp + " °F";
                                    document.getElementById("day" + itemPosition + "Wind").innerText = "Wind Speed: " + itemWind + " MPH";
                                    document.getElementById("day" + itemPosition + "Humidity").innerText = "Humidity: " + itemHumidity + " %";

                                }

                            }
                            
                        }


                    });


                    //Manage the history
                    addHistoryItem(city);
                    
                });            
    
                
            }
    
        });    

}

function addHistoryItem(city){

    //Check if item already exists in the history
    if(!cityHistory.hasOwnProperty(city)){

        document.getElementById("history").style.display = "block";

        //Add the city to the history
        cityHistory[city] = city;

        var li = document.createElement("li");

        var div = document.createElement("div");
        div.className = "btn btn-secondary historyItem";
        div.innerText = city;

        div.addEventListener("click", function() {
            loadCity(city);
         }, false);

        li.appendChild(div);

        document.querySelector("#history").appendChild(li);

    }
    
}

document.querySelector("#search").addEventListener("click",function(){

    var city = document.querySelector("#city").value;

    loadCity(city);

});

