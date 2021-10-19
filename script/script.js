// Get user geolocation
window.onload = getMyLocation;

function getMyLocation() {
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition( displayLocation );
    } else {
        alert( "Определение местоположения не поддерживается" );
    }
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
// Detail field
let query = ''
let extQuery1 = ''

form.addEventListener( 'submit', e => {
    e.preventDefault()
} )

queryField.oninput = ( e ) => {
    query = e.target.value
}

form.onsubmit = () => sendRequest( '', false )

// Request to openweathermap.org
function sendRequest( initialLoad ) {
    // storing last query in Local Storage
    if ( initialLoad == false ) localStorage.setItem( 'lastRequest', query )
    fetch( url + `&lat={${latitude}}&lon={${longitude}}` ).then( response1 => {
        return response1.json()
    } ).then( response2 => {
        console.log( response2 );
        const contentObject = response2.hits
    } )
}

// initial load of page
window.addEventListener( 'load', sendRequest( true ) )