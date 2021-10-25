// Api query
const url = 'https://api.openweathermap.org/data/2.5/weather?APPID=fdfa77a9b309bc404762508bba17ecc7&units=metric&lang=ua'
// Block for query city image 
const mainBlock = document.getElementById( 'main-block' );
// Get field from page
const queryField = document.getElementById( 'search-forecast' );
const form = document.forms.namedItem( 'search-form' );
// Main field
const mainTemp = document.getElementById( 'main-temp' )
const userLocation = document.getElementById( 'user-location' )
const mainDate = document.getElementById( 'main-date' )
const mainIcon = document.getElementById( 'main-icon' )
const mainCondition = document.getElementById( 'main-condition' )
const mainDawn = document.getElementById( 'main-dawn' )
const mainSunset = document.getElementById( 'main-sunset' )
// Error field
const errorField = document.getElementById( 'error-field' )
// Last query block
const lastCityContainer = document.getElementById( 'last-city' )
const lastQueryBlock = document.getElementById( 'last-city-block' )
// Detail field
const detailTemp = document.getElementById( 'detail-temp' )
const detailFeel = document.getElementById( 'detail-feel' )
const detailCloud = document.getElementById( 'detail-cloud' )
const detailHumidity = document.getElementById( 'detail-humidity' )
const detailWind = document.getElementById( 'detail-wind' )
const detailRain = document.getElementById( 'detail-rain' )
const detailPressure = document.getElementById( 'detail-pressure' )

// Capitalize first letter
const upperFirstLetter = function ( word ) {
    word = word.charAt( 0 ).toUpperCase() + word.slice( 1 );
    return word;
}

// Date
const dateConstructor = function () {
    let now = new Date()
    // For correct showing day of week 
    let options = {
        weekday: 'long'
    };
    let dayOfWeek = new Intl.DateTimeFormat( 'ru-RU', options ).format( now );
    // Split date to arr
    let dateArr = now.toString().split( ' ' );
    // Parse to correct string
    let dateString = `${dateArr[4].slice(0, 5)} - ${upperFirstLetter(dayOfWeek)}<br> ${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`
    return document.getElementById( 'main-date' ).innerHTML = dateString;
}
dateConstructor()
setInterval( dateConstructor, 5000 );

const msToTime = function ( millisecond ) {
    let time = new Date( millisecond * 1000 ).toString( 'h-mm' );
    let split = time.split( ' ' );
    let splitItem = split[ 4 ];
    return splitItem.slice( 0, 5 );
}
// Get user geolocation
window.onload = getMyLocation;
localStorage.clear()
function renderLastOnLoad() {
    if ( localStorage[ 0 ] == null ) {
        return
    } else {
        // console.log(localStorage[ 0 ] );
        if ( localStorage[ 0 ] != undefined && localStorage[ 0 ] != null ) {
            console.log( 'annewga' );
            lastQueryBlock.innerHTML = '';
            lastCityContainer.style.display = 'block'
            let array = Array.from( localStorage )
            array.forEach( element => {
                lastQueryBlock.insertAdjacentHTML( 'afterbegin', localStorageConstructor( element ) )
            } );
        }
    }
}

function getMyLocation() {
    renderLastOnLoad()
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition( displayUserLocation );
    } else {
        alert( "Определение местоположения не поддерживается" );
    }
}
// Get latitude, longitude and city name from Google Api 
const displayUserLocation = ( position ) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    // Get user city
    var geocoding = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4`;
    $.getJSON( geocoding ).done( function ( location ) {
        let compoundCode = location.plus_code.compound_code.split( ' ' );
        userLocation.innerText = compoundCode[ 1 ].slice( 0, -1 );
        pixabayRequest( compoundCode[ 1 ].slice( 0, -1 ) )
    } )
    return sendRequest( true, latitude, longitude, undefined );
}
// Query 
let query = ''
let queryArr = [];
let extQuery1 = ''
form.addEventListener( 'submit', e => {
    e.preventDefault()
    queryField.value = '';
} )
// Listen event in input
queryField.oninput = ( e ) => {
    query = e.target.value;

}
// On submit
form.onsubmit = () => {
    sendRequest( '', undefined, undefined, undefined );
}

//LocalStorage 
const localStorageRender = ( cityObj ) => {
    let localStorageItem = JSON.stringify( cityObj );
    // Push to localStorage with unique index
    let length = localStorage.length;
    // Set 5 object to localStorage
    // If localStorage length biger than 4, first item remove
    if ( length < 5 ) {
        localStorage.setItem( `${length}`, localStorageItem );
        lastQueryBlock.insertAdjacentHTML( 'afterbegin', localStorageConstructor( localStorageItem ) )
    } else if ( length == 5 ) {
        lastQueryBlock.innerHTML = '';
        localStorage.removeItem( '0' )
        const rewriteBlock = () => {
            for ( let i = 0; i <= length; i++ ) {
                if ( i < 4 ) {
                    localStorage.setItem( `${i}`, `${localStorage.getItem(i+1)}` )
                    lastQueryBlock.insertAdjacentHTML( 'afterbegin', localStorageConstructor( localStorage.getItem( `${i}` ) ) );
                } else if ( i == 4 ) {
                    localStorage.setItem( `4`, localStorageItem );
                    lastQueryBlock.insertAdjacentHTML( 'afterbegin', localStorageConstructor( localStorage.getItem( '4' ) ) );
                } else {
                    return
                }
            }
        }
        rewriteBlock()
    } else {
        return
    }
    return
}
// Constructor for localStorage
const localStorageConstructor = ( string ) => {
    let obj = JSON.parse( string );
    let htmlItem = `
    <div class="last-city_item" onclick="sendRequest('', undefined, undefined, '${obj.city}')">
        <div class="last-city_row">
            <!-- LocalStorage Item -->
            <div class="d-flex justify-content-center mt-1">
                <h1 class="local-temp mr-1">${Math.trunc(obj.temp)}&#176;</h1>
                <h2 class="local-city mt-3 mb-0">${obj.city}</h2>
            </div>
            <!-- Animation icon -->
            <div class="d-flex flex-column align-items-center text-center">
                <div class="animation-icon">${obj.icon}</div>
                <p>${obj.condition}</p>
            </div>
         </div>
    </div>
    `;
    return htmlItem;
}

// Request to openweathermap.org
function sendRequest( initialLoad, lat, lon, clickCity ) {
    let urlQuery = '';
    // If have query city
    if ( lat == undefined && lon == undefined ) {
        if ( clickCity != undefined ) {
            query = clickCity
        }
        urlQuery = url + `&q=${query}`;
    }
    // If have latitude and longtitude
    else if ( lat != undefined && lon != undefined ) {
        urlQuery = url + `&lat=${lat}&lon=${lon}`;
    }
    // If nothingz
    else {
        errorField.innerHTML = "<p class='error-text'>Ничего не найдено</p>";
        mainBlock.style.backgroundColor = 'black';
        return
    }
    // Query to openweathermap api
    fetch( urlQuery )
        .then( response1 => {
            return response1.json()
        } ).then( response2 => {
            if ( response2.cod == '404' ) {
                return errorField.innerHTML = '<p class="error-text">Неправильно введен город.</p>'
            } else {
                renderLastOnLoad()
                if ( initialLoad == false ) {
                    // Render location   
                    userLocation.innerText = response2.name;
                    // Request to Pixabay for setting background    
                    // Create object for localStorage
                    let localStorageCity = {
                        temp: response2.main.temp,
                        city: response2.name,
                        icon: animationIcon( response2.weather[ 0 ].icon ),
                        condition: upperFirstLetter( response2.weather[ 0 ].description )
                    }
                    // If click on last query city
                    if ( clickCity != undefined ) {
                        pixabayRequest( query );
                    } else {
                        pixabayRequest( query );
                        localStorageRender( localStorageCity )
                    }
                }
                // Render last query city from localStorage
                renderLastOnLoad()
                // Remove errorField
                errorField.innerText = '';
                // Main 
                mainTemp.innerHTML = Math.trunc( response2.main.temp ) + '&#176;';
                // mainDate.innerHTML = dateConstructor();
                mainCondition.innerText = upperFirstLetter( response2.weather[ 0 ].description );
                mainIcon.innerHTML = animationIcon( response2.weather[ 0 ].icon );
                // Detail   
                detailTemp.innerHTML = Math.trunc( response2.main.temp ) + '&#176;';
                detailFeel.innerHTML = Math.round( response2.main.feels_like ) + '&#176;';
                detailCloud.innerHTML = Math.round( response2.clouds.all ) + '%';
                detailHumidity.innerHTML = Math.round( response2.main.humidity ) + '%';
                detailWind.innerHTML = Math.round( response2.wind.speed ) + ' m/s';
                detailPressure.innerHTML = Math.round( response2.main.pressure ) + ' mm';
                // sunrise, sunset 
                mainDawn.innerHTML = msToTime( response2.sys.sunrise );
                mainSunset.innerHTML = msToTime( response2.sys.sunset );
            }
        } )
}