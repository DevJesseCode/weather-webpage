const bodyElement = document.querySelector("body");
const bodyStyle = bodyElement.style;
const cityInputElement = document.getElementById("city-input");
const cityNameElement = document.getElementById("city-name");
const countryNameElement = document.getElementById("country-name");
const cardContainer = document.getElementById("card-container");

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
	"https://api.weatherapi.com/v1/forecast.json?key=a9801a7b792142839c1164254231905&q=Lagos&days=6&aqi=yes&alerts=no";
let city = "Lagos";
let weatherData;
let currentWeather;
let weatherCards;

fetch("https://api.geoapify.com/v1/ipinfo?apiKey=baff5b020c2b45ec9cddb5a829ae0a01")
	.then((x) => x.json())
	.then(function (y) {
		cityInputElement.setAttribute("placeholder", y.state.name);
		getWeatherData(y.state.name);
	})
	.catch((error) => console.error(`Error fetching IP information: ${error}`));

function getWeatherData(input) {
	document.querySelector(".loading").style.display = "flex";
	weatherRequestURL = weatherRequestURL.replace(city, input);
	city = input;
	fetch(weatherRequestURL)
		.then((x) => x.json())
		.then((y) => {
			weatherData = y;
			replaceLocation(y.location);
			document.querySelector(".weather-card") !== undefined ? (cardContainer.innerHTML = "") : null;
			createWeatherCards();
		})
		.catch((error) => console.error(`Error fetching weather data: ${error}`))
		.finally(() => (document.querySelector(".loading").style.display = "none"));
}

function replaceLocation(location) {
	cityNameElement.textContent = location.name;
	countryNameElement.textContent = location.country;
}

document.querySelector("#search-icon").addEventListener("click", function () {
	getWeatherData(cityInputElement.value);
});

document.querySelector("#search-icon").addEventListener("keydown", function (e) {
	if (e.key === 'Enter') getWeatherData(cityInputElement.value);
});

const createWeatherCards = () => {
	for (let i = 0; i < weatherData.forecast.forecastday.length; i++) {
		const weatherCard = document.createElement("div");
		weatherCard.classList.add("weather-card");

		const dayOfWeek = document.createElement("h2");
		dayOfWeek.classList.add("day-of-week");

		const date = new Date();
		const nextDayIndex = (date.getDay() + i) % 7;
		dayOfWeek.textContent = days.get(nextDayIndex);

		const conditionIconContainer = document.createElement("div");
		conditionIconContainer.setAttribute("class", "condition-icon-container");

		const conditionIcon = document.createElement("img");
		conditionIcon.setAttribute("src", weatherData.forecast.forecastday[i].day.condition.icon);
		conditionIcon.setAttribute("title", weatherData.forecast.forecastday[i].day.condition.text);
		conditionIcon.setAttribute("type", "image/png");
		conditionIcon.classList.add("condition-icon");
		weatherCard.appendChild(dayOfWeek);
		weatherCard.appendChild(conditionIconContainer);
		conditionIconContainer.appendChild(conditionIcon);
		cardContainer.appendChild(weatherCard);
	}

	if (document.querySelectorAll(".weather-card").length < 6) {
		document.querySelector("#card-container").style.width =
			200 + 230 * (document.querySelectorAll(".weather-card").length - 1) + "px";
		for (const element of document.querySelectorAll(".weather-card")) {
			element.style.width = "200px";
		}
	}
	createWeatherInfoIcons();
};

function createWeatherInfoIcons() {
	weatherCards = document.querySelectorAll(".weather-card");
	for (let i = 0; i < weatherCards.length; i++) {
		const icons = ["./img/thermometer.png", "./img/wind.png"];
		let weatherInfoContainer;
		for (entry of icons) {
			const image = document.createElement("img");
			const infoText = document.createElement("span");
			weatherInfoContainer = document.createElement("div");
			weatherInfoContainer.classList.add("weather-info-container");
			image.setAttribute("src", entry);
			image.setAttribute("type", "image/png");
			image.classList.add("info-icon");
			infoText.classList.add("weather-info");
			if (icons.indexOf(entry) === 0) {
				infoText.classList.add("temperature");
			} else {
				infoText.classList.add("wind-speed");
			}
			weatherInfoContainer.appendChild(image);
			weatherInfoContainer.appendChild(infoText);
			weatherCards[i].appendChild(weatherInfoContainer);
		}
		const dateElement = document.createElement("div");
		dateElement.classList.add("weather-date");
		dateElement.textContent = weatherData.forecast.forecastday[i].date;
		weatherCards[i].appendChild(dateElement);
	}
	let infoIcons = document.querySelectorAll(".info-icon");
	let infoIconsTitle = [];
	for (let i = 0; i < 6; i++) {
		infoIconsTitle.push("Average Temperature");
		infoIconsTitle.push("Max Wind Speed");
	}
	for (let i = 0; i < infoIcons.length; i++) {
		infoIcons[i].setAttribute("title", infoIconsTitle[i]);
	}
	fillWeatherInfo();
}

function fillWeatherInfo() {
	const weatherInfoElements = document.querySelectorAll(".weather-info");
	const dataArray = weatherData.forecast.forecastday;
	const data = [];
	for (let i = 0; i < dataArray.length; i++) {
		data.push(dataArray[i].day.avgtemp_c);
		data.push(dataArray[i].day.maxwind_kph);
	}
	for (let i = 0; i < weatherInfoElements.length; i++) {
		weatherInfoElements[i].textContent = data[i];
		if (weatherInfoElements[i].classList.contains("temperature")) {
			weatherInfoElements[i].textContent += "°C";
		} else {
			weatherInfoElements[i].textContent += " km/h";
		}
	}
}

