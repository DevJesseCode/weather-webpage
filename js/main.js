const bodyElement = document.querySelector("body");
const bodyStyle = bodyElement.style;
const cityInputElement = document.getElementById("city-input");
const cityNameElement = document.getElementById("city-name");
const countryNameElement = document.getElementById("country-name");
const weatherCards = document.querySelectorAll(".weather-card");
const days = new Map([
	[0, "Sunday"],
	[1, "Monday"],
	[2, "Tuesday"],
	[3, "Wednesday"],
	[4, "Thursday"],
	[5, "Friday"],
	[6, "Saturday"],
]);
const months = new Map([
	[0, "January"],
	[1, "February"],
	[2, "March"],
	[3, "April"],
	[4, "May"],
	[5, "June"],
	[6, "July"],
	[7, "August"],
	[8, "September"],
	[9, "October"],
	[10, "November"],
	[11, "December"],
]);

let weatherRequestURL =
	"https://api.weatherapi.com/v1/forecast.json?key=a9801a7b792142839c1164254231905&q=Lagos&days=1&aqi=yes&alerts=no";
let city = "Lagos";
let weatherData;
let currentWeather;

fetch(
	"https://api.geoapify.com/v1/ipinfo?apiKey=baff5b020c2b45ec9cddb5a829ae0a01"
)
	.then((x) => x.json())
	.then(function (y) {
		cityInputElement.setAttribute("placeholder", y.state.name);
		getWeatherData(y.state.name);
	})
	.catch((error) => console.error(`Error: ${error}`));

function getWeatherData(input) {
	weatherRequestURL = weatherRequestURL.replace(city, input);
	city = input;
	fetch(weatherRequestURL)
		.then((x) => x.json())
		.then((y) => replaceLocation(y.location))
		.catch((error) => console.error(`Error: ${error}`));
}

function replaceLocation(location) {
	cityNameElement.textContent = location.name;
	countryNameElement.textContent = location.country;
}

document.querySelector("#search-icon").addEventListener("click", function () {
	getWeatherData(cityInputElement.value);
});

for (let i = 0; i < weatherCards.length; i++) {
	let dayOfWeek = document.createElement("h2");
	let date = new Date();
	dayOfWeek.setAttribute("class", "day-of-week");
	if (date.getDay() + i > 6) {
		dayOfWeek.textContent = days.get(date.getDay() + i - 7);
	} else {
		dayOfWeek.textContent = days.get(date.getDay() + i);
	}

	weatherCards[i].appendChild(dayOfWeek);
}
