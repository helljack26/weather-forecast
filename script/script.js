// Get user geolocation
window.onload = getMyLocation;

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        alert("Определение местоположения не поддерживается");
    }
}
let latitude 
let longitude
const displayLocation = (position)=> {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en'&'key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4';
    var GEOCODING = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4`;
    console.log(GEOCODING);
            $.getJSON(GEOCODING).done(function(location) {
                console.log(location)
            })
    
return latitude, longitude



 console.log(latitude, longitude);
return console.log(latitude, longitude);
}
// displayLocation()
// Api query
const url = 'https://pro.openweathermap.org/data/2.5/forecast/climate?appid={fdfa77a9b309bc404762508bba17ecc7}&cnt=1&units=metric&lang=ua,uk'

// Get field from page
const queryField = document.getElementById( 'search-forecast' )
const form = document.forms.namedItem( 'search-form' )
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
    fetch( url + `lat={${latitude}}&lon={${longitude}}` ).then( response1 => {
        return response1.json()
    } ).then( response2 => {
        const contentObject = response2.hits
    } )
}

// initial load of page
window.addEventListener( 'load', sendRequest( true ) )