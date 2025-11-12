const url = 'https://api.openweathermap.org/data/2.5/weather?lat=41.1391&lon=-112.0505&units=imperial&appid=b16b5d69f3e3b4d14be463994094ce8c'
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=41.1391&lon=-112.0505&units=imperial&appid=b16b5d69f3e3b4d14be463994094ce8c';

async function getWeather() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayWeather(data);
    } catch (error) {
        console.log('Error', error);
    }
}

function displayWeather(data) {
    const temp = data.main.temp;
    const description = data.weather[0].description;

    // Target weather section 
    const weatherSection = document.querySelector('.weather');

    //Add the Info
    weatherSection.innerHTML = `
    <h2>Weather</h2>
    <p>Temperature: ${temp}°F</p>
    <p>Conditions: ${description}</p> `
        ;
}

async function getForecast() {
    const response = await fetch(forecastUrl);
    const data = await response.json();

    //data.list has forecast entries
    // filter to get one per day (around noon)
    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
    ).slice(0, 3); // Get first 3 days

    displayForecast(dailyForecasts);
}

//display the forecast
function displayForecast(forecasts) {
    const forecastSection = document.querySelector('.forecast');

    let forecastHTML = '<h2> 3-Day Forecast</h2>';

    forecasts.forEach(day => {
        const date = new Date(day.dt_txt)
        const temp = day.main.temp;
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        forecastHTML += `
        <div>
           <p>${dayName}: ${temp}°F</p>
        </div>
        `;
    });
    forecastSection.innerHTML = forecastHTML;
}

getWeather();
getForecast();

//Spotlight code

//Spotlight code

//fetch the members data
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        console.log(data); //check what you get
        displaySpotlights(data.companies);
    } catch (error) {
        console.log('Error fetching members:', error);
    }
}

function getRandomMembers(members, count) {
    //shuffle the array
    const shuffled = members.sort(() => 0.5 - Math.random());

    //Get first 'count' items (2 or 3)
    return shuffled.slice(0, count);
}

//Display the Spotlights
function displaySpotlights(companies) {
    //filter for gold and silver
    const qualifiedMembers = companies.filter(company =>
        company.membershipLevel === 2 || company.membershipLevel === 3
    );

    //get 2-3 random members
    const spotlights = getRandomMembers(qualifiedMembers, 3);

    //get the spotlight section
    const spotlightSection = document.querySelector('.spotlight');

    //clear existing content
    spotlightSection.innerHTML = '<h2>Spotlights</h2>';

    //create cards for each spotlight
    spotlights.forEach(member => {
        const membershipName = member.membershipLevel == 3 ? 'Gold' : 'Silver';

        const card = `
        <div class ="spotlight-card">
        <img src="${member.image}" alt="${member.name} logo">
        <h3>${member.name}</h3>
        <p><strong>Membership:</strong> ${membershipName}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Visit Site</a></p>
        </div>
        `;

        spotlightSection.innerHTML += card;
    });
}

getWeather();
getForecast();
getMembers();