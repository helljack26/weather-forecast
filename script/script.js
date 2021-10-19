// Get user geolocation
window.onload = getMyLocation;

function getMyLocation() {
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition( displayLocation );
    } else {
        alert( "Определение местоположения не поддерживается" );
    }
    localStorageFunction()
}
let latitude
let longitude
const displayLocation = ( position ) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    return latitude, longitude
}

// Api query
const url = 'https://pro.openweathermap.org/data/2.5/forecast/climate?appid=fdfa77a9b309bc404762508bba17ecc7'

// Get field from page
const queryField = document.getElementById( 'search-forecast' );
const form = document.forms.namedItem( 'search-form' );
// Main field
const mainTemp = document.getElementById( 'main-temp ' )
const userLocation = document.getElementById( 'user-location ' )
const mainDate = document.getElementById( 'main-date ' )
const mainIcon = document.getElementById( 'main-icon ' )
const mainCondition = document.getElementById( 'main-condition ' )
// Last query
const lastQueryBlock = document.getElementById( 'last-query' )
// Detail field
const detailTemp = document.getElementById( 'detail-temp' )
const detailFeel = document.getElementById( 'detail-feel' )
const detailCloud = document.getElementById( 'detail-cloud' )
const detailHumidity = document.getElementById( 'detail-humidity' )
const detailWind = document.getElementById( 'detail-wind' )
const detailRain = document.getElementById( 'detail-rain' )
const detailPressure = document.getElementById( 'detail-pressure' )


// Query 
let query = ''
let queryArr = [];
let extQuery1 = ''

form.addEventListener( 'submit', e => {
    e.preventDefault()
    queryField.value = '';
} )

queryField.oninput = ( e ) => {
    query = e.target.value;
}

form.onsubmit = () => sendRequest( '', false )
let init = 1;

// Local storage render 
let lastQueryFromLocal = localStorage.getItem( 'lastQuery' );
let lastArrFromLocal = lastQueryFromLocal.split( ',' )
const localStorageFunction = () => {
    let out = ''
    lastArrFromLocal.forEach( ( item ) => {
        
        out += `<p class="light-text suggestion">${item}</p>`
    } )
    lastQueryBlock.innerHTML = out
}
// Request to openweathermap.org
function sendRequest( initialLoad ) {
    // storing last query in Local Storage
    function localStoragePush() {
        if ( initialLoad == false && init <= 10 && init != 10 ) {
            init++;
            queryArr.push( query );
            localStorage.setItem( 'lastQuery', queryArr )
            // lastQueryBlock.innerHTML = '';
            localStorageFunction()
        } else if ( init > 10 ) {
            lastArrFromLocal.pop()
        } else {
            // console.log();
        }

    }
    localStoragePush()
    fetch( url + `&lat={${latitude}}&lon={${longitude}}` ).then( response1 => {
        return response1.json()
    } ).then( response2 => {
        // console.log( response2 );
        const contentObject = response2.hits
    } )
}

// initial load of page
window.addEventListener( 'load', sendRequest( true ) )