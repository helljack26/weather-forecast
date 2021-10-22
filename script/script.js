// Api query
const url = 'https://api.openweathermap.org/data/2.5/weather?APPID=fdfa77a9b309bc404762508bba17ecc7&units=metric&lang=ua'

// Get field from page
const queryField = document.getElementById('search-forecast');
const form = document.forms.namedItem('search-form');
// Main field
const mainTemp = document.getElementById('main-temp')
const userLocation = document.getElementById('user-location')
const mainDate = document.getElementById('main-date')
const mainIcon = document.getElementById('main-icon')
const mainCondition = document.getElementById('main-condition')
const mainDawn = document.getElementById('main-dawn')
const mainSunset = document.getElementById('main-sunset')
// Error field
const errorField = document.getElementById('error-field')
// Last query block
const lastQueryBlock = document.getElementById('last-query')
// Detail field
const detailTemp = document.getElementById('detail-temp')
const detailFeel = document.getElementById('detail-feel')
const detailCloud = document.getElementById('detail-cloud')
const detailHumidity = document.getElementById('detail-humidity')
const detailWind = document.getElementById('detail-wind')
const detailRain = document.getElementById('detail-rain')
const detailPressure = document.getElementById('detail-pressure')

// Capitalize first letter
const upperFirstLetter = function (word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word;
}

// Date
let now = new Date()
const dateConstructor = function () {
    // For correct showing day of week 
    let options = {
        weekday: 'long'
    };
    let dayOfWeek = new Intl.DateTimeFormat('ru-RU', options).format(now);
    // Split date to arr
    let dateArr = now.toString().split(' ');
    // Parse to correct string
    let dateString = `${dateArr[4].slice(0, 5)} - ${upperFirstLetter(dayOfWeek)}, ${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`
    return dateString;
}

// Get user geolocation
window.onload = getMyLocation;

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        alert("Определение местоположения не поддерживается");
    }
}
// Get latitude, longitude and city name from Google Api 
const displayLocation = (position) => {

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    // Get user city
    var geocoding = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4`;
    $.getJSON(geocoding).done(function (location) {
        let compoundCode = location.plus_code.compound_code.split(' ');
        console.log(compoundCode);
        userLocation.innerText = compoundCode[1].slice(0, -1);
    })
    return sendRequest(true, latitude, longitude);
}

// Query 
let query = ''
let queryArr = [];
let extQuery1 = ''

form.addEventListener('submit', e => {
    e.preventDefault()
    queryField.value = '';
})

queryField.oninput = (e) => {
    query = e.target.value;
}

form.onsubmit = () => sendRequest('', undefined, undefined);
let init = 1;

const localStorageFunction = () => {
    let lastQueryFromLocal = localStorage.getItem('lastQuery');
    let lastArrFromLocal = lastQueryFromLocal.split(',');
    let out = ''
    lastArrFromLocal.forEach((item) => {
        out += `<p class="light-text suggestion">${item}</p>`
    })
    lastQueryBlock.innerHTML = out;
    return
}
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes ;
  }

// storing last query in Local Storage
function localStoragePush(initialLoad, city) {
    // Local storage render 

    if(lastQueryFromLocal = null){
        return
    }

    if (initialLoad == false && init <= 10 && init != 10) {
        init++;
        queryArr.push(city);
        localStorage.setItem('lastQuery', queryArr)
        // lastQueryBlock.innerHTML = '';
    } else if (init > 10) {
        lastArrFromLocal.pop();
    } else {
        return;
    }
}
// Request to openweathermap.org
function sendRequest(initialLoad, lat, lon) {
    let urlQuery = '';
    if(lat == undefined && lon == undefined){
        urlQuery = url + `&q=${query}`;
        userLocation.innerText = upperFirstLetter(query);
    }  else if (lat != undefined && lon != undefined){
        urlQuery = url + `&lat=${lat}&lon=${lon}`;
    }  else {
        return errorField.innerText = 'Ничего не найдено'
    }
    localStoragePush(initialLoad)
    fetch(urlQuery)
    .then(response1 => {
        return response1.json()
    }).then(response2 => {
        console.log(response2);
        if (response2.cod == '404'){
            return errorField.innerText = 'Неправильно введен город.'
        }
        errorField.innerText = '';
        // Main 
        mainTemp.innerHTML = Math.trunc(response2.main.temp) + '&#176;';
        mainDate.innerText = dateConstructor();
        mainCondition.innerText = upperFirstLetter(response2.weather[0].description);
        mainIcon.innerHTML = animationIcon(response2.weather[0].icon);
        // Detail   
        detailTemp.innerHTML = Math.trunc(response2.main.temp) + '&#176;';
        detailFeel.innerHTML = Math.round(response2.main.feels_like) + '&#176;';
        detailCloud.innerHTML = Math.round(response2.clouds.all) + '%';
        detailHumidity.innerHTML = Math.round(response2.main.humidity) + '%';
        detailWind.innerHTML = Math.round(response2.wind.speed) + ' m/s';
        detailPressure.innerHTML = Math.round(response2.main.pressure) + ' mm';
        // dawn 
        let msDawn = response2.sys.sunrise;
        let msSunset = response2.sys.sunset;
        mainDawn.innerHTML = msToTime(msDawn);
        mainSunset.innerHTML = msToTime(msSunset);
    })
}