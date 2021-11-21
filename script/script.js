// Block for query city image 
const mainBlock = document.getElementById( 'main-block' );
// Get field from page
const queryField = document.getElementById( 'search-forecast' );
const form = document.forms.namedItem( 'search-form' );
// Main field
const mainTemp = document.getElementById( 'main-temp' )
const userLocation = document.getElementById( 'user-location' );

const mainDate = document.getElementById( 'main-date' )
const mainIcon = document.getElementById( 'main-icon' )
const mainCondition = document.getElementById( 'main-condition' )
const mainDawn = document.getElementById( 'main-dawn' )
const mainSunset = document.getElementById( 'main-sunset' )
// Error field
const errorField = document.getElementById( 'error-field' )
// Last query block
const favoriteCityContainer = document.getElementById( 'favorite-city' );
const favoriteQueryBlock = document.getElementById( 'favorite-city-block' );
const clearFavorite = document.getElementById( 'clear-localstorage' );
// Detail field
const detailTemp = document.getElementById( 'detail-temp' )
const detailFeel = document.getElementById( 'detail-feel' )
const detailCloud = document.getElementById( 'detail-cloud' )
const detailHumidity = document.getElementById( 'detail-humidity' )
const detailWind = document.getElementById( 'detail-wind' )
const detailRain = document.getElementById( 'detail-rain' )
const detailPressure = document.getElementById( 'detail-pressure' )
const card1 = document.getElementById( 'card1' );
const card2 = document.getElementById( 'card2' );

let clickCityFromSendRequest
let time, initial = false;
// Weather Forecast Class
// localStorage.clear()
class WeatherForecast {
    // Capitalize first letter
    upperFirstLetter( word ) {
        if ( word == undefined ) {
            return
        } else {
            word = word.charAt( 0 ).toUpperCase() + word.slice( 1 );
            return word;
        }
    }
    // Get location
    getMyLocation() {
        if ( navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition( this.displayUserLocation );
        } else {
            alert( "Определение местоположения не поддерживается" );
        }
        return
    }
    // Get latitude, longitude and city name from Google Api 
    displayUserLocation( position ) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        // Get user city
        var geocoding = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ru&key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4`;
        fetch( geocoding )
            .then( ( response1 ) => {
                return response1.json();
            } )
            .then( ( response2 ) => {
                let compoundCodePixabay = response2.plus_code.compound_code.split( ' ' );
                let city = response2.results[ 6 ].address_components[ 1 ].long_name;
                userLocation.innerText = city;
                queryField.setAttribute( 'placeholder', `${city}` );
                weather.pixabayRequest( compoundCodePixabay[ 1 ].slice( 0, -1 ) );
                weather.sendRequest( true, latitude, longitude, false );
                weather.currentDate( 'now' )
            } );
        return
    }
    // Geocoder by query
    geocodingFromQuery( city, reloadData ) {
        var geocoding = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&language=ru&key=AIzaSyBOGWIxyJbW7yq0oLxjmJBsycB0INmt0A4`;
        fetch( geocoding )
            .then( ( response1 ) => {
                return response1.json();
            } )
            .then( ( response2 ) => {
                if ( response2.cod == '404' ) {
                    this.spinner( true )
                    queryField.setAttribute( 'placeholder', "Такого города не существует" )
                    queryField.classList.add( 'placeholderred' );
                    return
                } else {
                    let latitude = response2.results[ 0 ].geometry.location.lat;
                    let longitude = response2.results[ 0 ].geometry.location.lng;
                    query = response2.results[ 0 ].address_components[ 0 ].long_name;
                    weather.sendRequest( false, latitude, longitude, false, reloadData );
                }
            } );
        return

    }
    // Current date
    currentDate() {
        let now = new Date()
        // For correct showing day of week 
        let options = {
            weekday: 'long'
        };
        let optionsMonth = {
            month: 'long'
        };
        let dayOfWeek = new Intl.DateTimeFormat( 'ru-RU', options ).format( now );
        let month = new Intl.DateTimeFormat( 'ru-RU', optionsMonth ).format( now );
        // Split date to arr
        let dateArr = now.toString().split( ' ' );
        if ( initial == true ) {
            time = dateArr[ 4 ].slice( 0, 5 )
        }
        // Parse to correct string
        let dateString = `${time} ${weather.upperFirstLetter(dayOfWeek)}<br> ${dateArr[2]} ${weather.upperFirstLetter(month)} ${dateArr[3]}`;
        return mainDate.innerHTML = dateString;
    }
    // For convert UTC millisecond
    msToTime( millisecond ) {
        let time = new Date( millisecond * 1000 ).toString( 'h-mm' );
        let split = time.split( ' ' );
        let splitItem = split[ 4 ];
        return splitItem.slice( 0, 5 );
    }
    // Render city from localStorage
    renderFavoriteOnLoad() {
        if ( localStorage[ 0 ] == null ) {
            return
        } else
        if ( localStorage[ 0 ] != undefined && localStorage[ 0 ] != null ) {
            favoriteQueryBlock.innerHTML = '';
            favoriteCityContainer.style.display = 'block'

            let array = Array.from( localStorage )

            function uniq( a ) {
                return a.sort().filter( function ( item, pos, ary ) {
                    return !pos || item != ary[ pos - 1 ];
                } );
            }
            let cleanArray = uniq( array );
            cleanArray.forEach( element => {
                favoriteQueryBlock.insertAdjacentHTML( 'afterbegin', this.localStorageConstructor( element ) )
            } );
        }
    }
    // Clear button
    clearLatestQuery() {
        clearFavorite.addEventListener( 'click', () => {
            localStorage.clear()
            favoriteCityContainer.style.display = 'none';
            favoriteQueryBlock.innerHTML = '';
        } )
    }
    //LocalStorage 
    localStorageRender( cityObj ) {
        let localStorageItem = JSON.stringify( cityObj );
        // Push to localStorage
        let length = localStorage.length;
        if ( clickCityFromSendRequest != userLocation.textContent ) {
            favoriteCityContainer.style.display = 'block';
            localStorage.setItem( `${length}`, localStorageItem );
            favoriteQueryBlock.insertAdjacentHTML( 'afterbegin', weather.localStorageConstructor( localStorageItem ) );
            weather.renderFavoriteOnLoad()
        } else {
            return
        }
        return
    }
    // Constructor for localStorage
    localStorageConstructor( string ) {
        let obj = JSON.parse( string );
        let htmlItem = `
    <div class="favorite-city_item" onclick='weather.sendRequest("", undefined, undefined, "${obj.city}")'>
        <div class="favorite-city_row">
            <!-- LocalStorage Item -->
            <div class="d-flex justify-content-center align-items-center ">
                <h1 class="local-temp mr-1">${Math.trunc(obj.temp)}&#176;</h1>
                <h2 class="local-city mt-2 mb-0 mr-4">${obj.city}</h2>
            </div>
            <!-- Animation icon -->
            <div class="favorite-city_row-icon d-flex align-items-center text-center mt-1">
                <div class="animation-icon">${obj.icon}</div>
                <p>${obj.condition}</p>
            </div>
        </div>
    </div>
    `;
        return htmlItem;
    }
    // Spinner
    spinner( stop = false ) {
        // Spinner
        const contentWrapper = document.getElementById( 'content_wrapper' );
        const spinner = document.createElement( 'div' );
        const logoBg = new Image();
        const spinnerItem = document.createElement( 'div' );
        const spinnerBlock = document.createElement( 'div' );
        // Spinner stoper 
        if ( stop == true ) {
            contentWrapper.classList.remove( 'content_wrapper' )
            contentWrapper.innerHTML = ''
            spinnerBlock.remove();
            return
        } else {
            spinner.classList.add( 'loader' );
            spinnerItem.classList.add( 'loader-item' );
            // Logo
            logoBg.src = './img/logo_v2_1.svg'
            logoBg.classList.add( 'loader-item_bg' )
            spinnerBlock.classList.add( 'loader-block' );
            // Append spinner
            spinnerItem.appendChild( spinner );
            spinnerItem.appendChild( logoBg );
            spinnerBlock.appendChild( spinnerItem );
            contentWrapper.appendChild( spinnerBlock );
            return
        }
    }
    // Double request to Pixabay
    pixabayRequest( queryCity, count = 0 ) {
        let url
        const urlPixabay = 'https://pixabay.com/api/?key=23641816-dcf4d4f9c34852472448f65fc&page=1&orientation=horizontal&category=places&image_type=photo';
        const urlPixabaySecondChance = 'https://pixabay.com/api/?key=23641816-dcf4d4f9c34852472448f65fc&page=1&orientation=horizontal&image_type=photo';
        if ( count == 0 ) {
            url = urlPixabay + `&q=${queryCity}`;
        } else if ( count == 1 ) {
            url = urlPixabaySecondChance + `&q=${queryCity}`
        }
        fetch( url )
            .then( ( response1 ) => {
                return response1.json();
            } )
            .then( ( response2 ) => {
                let backgroundsArray
                backgroundsArray = response2.hits;
                if ( backgroundsArray[ 0 ] == undefined ) {
                    if ( count == 0 ) {
                        return this.pixabayRequest( queryCity, 1 )
                    } else if ( count == 1 ) {
                        count = 0;
                        document.body.style.backgroundImage = `url()`;
                        return this.spinner( true );
                    }
                } else {
                    let outUrl = backgroundsArray[ 0 ].largeImageURL;
                    document.body.style.backgroundImage = `url(${outUrl})`;
                    let img = new Image()
                    img.src = outUrl
                    // Spinner stop when load background image
                    img.addEventListener( 'load', () => {
                        this.spinner( true );
                    } )
                }
            } );
    }
    // Radio button forecast handler 
    forecastHandler() {
        const st = {};
        st.flap = document.querySelector( '#flap' );
        st.toggle = document.getElementById( 'toggle' );
        st.choice1 = document.querySelector( '#choice1' );
        st.choice2 = document.querySelector( '#choice2' );

        st.flap.addEventListener( 'transitionend', () => {
            if ( st.choice1.checked ) {
                st.toggle.style.transform = 'rotateY(-15deg)';
                setTimeout( () => st.toggle.style.transform = '', 400 );
            } else {
                st.toggle.style.transform = 'rotateY(15deg)';
                setTimeout( () => st.toggle.style.transform = '', 400 );
            }
        } )
        st.clickHandler = ( e ) => {
            if ( e.target.tagName == 'LABEL' ) {
                setTimeout( () => {
                    st.flap.children[ 0 ].textContent = e.target.textContent;
                }, 250 );
            }
        }

        document.addEventListener( 'DOMContentLoaded', () => {
            st.flap.children[ 0 ].textContent = st.choice2.nextElementSibling.textContent;
        } );
        document.addEventListener( 'click', ( e ) => st.clickHandler( e ) );

    }
    // Current and Hourly
    currentForecast( initialLoad, response2, clickCity, reloadData ) {
        card1.addEventListener( 'wheel', ( e ) => {
            e.preventDefault()
            card1.scrollLeft += e.deltaY;
        } )
        // Query city time
        this.currentDate( '', 10 );
        if ( initialLoad == false ) {
            // Render location   
            userLocation.innerText = weather.upperFirstLetter( query );
            queryField.setAttribute( 'placeholder', `${weather.upperFirstLetter( userLocation.innerText)}` );
            // Set query date
            let queryDate = new Date().toLocaleString( 'ru-RU', {
                timeZone: `${response2.timezone}`
            } );
            time = queryDate.slice( -8, -3 )
            weather.currentDate()
            // Create object for localStorage
            let localStorageCity = {
                temp: response2.current.temp,
                city: weather.upperFirstLetter( query ),
                icon: animationIcon( response2.current.weather[ 0 ].icon ),
                condition: weather.upperFirstLetter( response2.current.weather[ 0 ].description )
            }
            weather.localStorageRender( localStorageCity );
            // Request to Pixabay for setting background    
            if ( clickCity != undefined && reloadData == undefined ) {
                weather.pixabayRequest( query );
            } else if ( reloadData == undefined ) {
                console.log( query );
                weather.pixabayRequest( query );
                weather.localStorageRender( localStorageCity );
            }
            weather.localStorageRender( localStorageCity );
        }
        // Main 
        mainTemp.innerHTML = Math.trunc( response2.current.temp ) + '&#176;';
        mainCondition.innerText = weather.upperFirstLetter( response2.current.weather[ 0 ].description );
        mainIcon.innerHTML = animationIcon( response2.current.weather[ 0 ].icon );
        // sunrise, sunset 
        mainDawn.innerHTML = '';
        mainSunset.innerHTML = '';
        if ( response2.current.sunrise != undefined ) {
            mainDawn.innerHTML = `Рассвет ${this.msToTime( response2.current.sunrise )}`;
            mainSunset.innerHTML = `Закат ${this.msToTime( response2.current.sunset )}`;
        }
        // Detail info
        console.log(response2);

        // Render hourly forecast
        let hourlyArray = response2.hourly
        card1.innerHTML = ''
        for ( let i = 0; i <= 23; i++ ) {
            const item = document.createElement( 'div' )
            item.classList.add( 'card1-item' )
            item.innerHTML = `
                <p class='item-day'>${weather.msToTime(hourlyArray[i].dt)}</p>
                <h1 class=" item-temp">${Math.trunc(hourlyArray[i].temp)}&#176;</h1>
                <div class="animation-icon item-icon">${animationIcon( hourlyArray[i].weather[ 0 ].icon) }</div>
                <p>${hourlyArray[i].weather[ 0 ].description}</p>
            `
            card1.appendChild( item );
        }
        return weather.sevenDayForecast(response2.daily)
    }
    // Radio button forecast handler 
    sevenDayForecast( response2 ) {
        card2.addEventListener( 'wheel', ( e ) => {
            e.preventDefault()
            card2.scrollLeft += e.deltaY;
        } )
        // For correct render day of week 
        function weekDay(millisecond){
            let now = new Date(millisecond * 1000);
            let options = {
                weekday: 'long'
            };
            let optionsMonth = {
                month: 'long'
            };
            let dayOfWeek = new Intl.DateTimeFormat( 'ru-RU', options ).format( now );
            let month = new Intl.DateTimeFormat( 'ru-RU', optionsMonth ).format( now );
            // Split date to arr
            let dateArr = now.toString().split( ' ' );
            let out = `<p>${weather.upperFirstLetter(dayOfWeek)}</p> <div class='item-day_date'><p class='mr-1'>${dateArr[2]}</p> <p>${weather.upperFirstLetter(month)}</p></div>`
            return out; 
        }
        // Render hourly forecast
        card2.innerHTML=''
        let dailyArray = response2;
        for ( let i = 1; i <= 7; i++ ) {
            const item = document.createElement( 'div' )
            item.classList.add( 'card2-item' )
            item.innerHTML = `
                <div class='item-day'>${weekDay(dailyArray[i].dt)}</div>
                    <div>
                        <div class="animation-icon item-icon">${animationIcon( dailyArray[i].weather[ 0 ].icon) }</div>
                        <p class='item-condition'>${dailyArray[i].weather[ 0 ].description}</p>
                    </div>
                <div class='item-row'>
                    <div class='mr-5'>
                        <p>мин.</p>
                        <p class="item-temp">${Math.trunc(dailyArray[i].temp.min)}&#176;</p>
                    </div>
                    <div>
                        <p>макс.</p>
                        <p class="item-temp">${Math.trunc(dailyArray[i].temp.max)}&#176;</p>
                    </div>
                    </div>
                `
            card2.appendChild( item );
        }
    }
    // Request to openweathermap.org
    sendRequest( initialLoad, lat, lon, clickCity, reloadData ) {
        const url = 'https://api.openweathermap.org/data/2.5/onecall?APPID=fdfa77a9b309bc404762508bba17ecc7&units=metric&lang=ua';
        // new
        // const url = 'https://api.openweathermap.org/data/2.5/onecall?APPID=37344949b6ea7dd2ab2e55c1b6dee80d&units=metric&lang=ua';
        clickCityFromSendRequest = clickCity;
        initial = initialLoad;
        let toogle = document.getElementById('toggle');
        let content = document.querySelector('.content');
        // To default state radio button
        if(content.textContent == 'На неделю'){
            card2.style.display = 'none'
            card1.style.display = 'flex'
            toogle.innerHTML = ''
            let defaultStr = `<input type="radio" class="radio active" id="choice1" name="choice" value="На неделю">
            <label for="choice1">На неделю</label>
            <input type="radio" class='radio' id="choice2" name="choice" value="Сегодня">
            <label for="choice2">Сегодня</label>
            <div id="flap"><span class="content">Сегодня</span></div>`
            toogle.innerHTML = defaultStr;
            weather.forecastHandler()
        }
        // Set placeholder for input
        queryField.classList.remove( 'placeholderred' );
        let urlQuery = '';
        // If have latitude and longtitude
        if ( lat != undefined && lon != undefined ) {
            urlQuery = url + `&lat=${lat}&lon=${lon}`;
        } else if ( clickCity != false && clickCity != userLocation.textContent ) {
            return weather.geocodingFromQuery( clickCity )
        } else {
            return
        }
        // Query to openweathermap api
        fetch( urlQuery )
            .then( response1 => {
                return response1.json()
            } ).then( response2 => {
                if ( response2.cod == '404' ) {
                    weather.spinner( true )
                    queryField.setAttribute( 'placeholder', "Такого города не существует" )
                    queryField.classList.add( 'placeholderred' );
                    return
                } else {
                    // Render last query city from localStorage
                    if ( reloadData == undefined ) {
                        // weather.spinner()
                        this.renderFavoriteOnLoad()
                    }
                    // Spinner while query loading
                        weather.currentForecast( initialLoad, response2, clickCity, reloadData )
                    // Forecast handler
                    document.addEventListener( 'click', ( e ) => {
                        if ( e.target.tagName == 'LABEL' ) {
                            if ( e.target.textContent == 'На неделю' ) {
                                card2.style.display = 'grid'
                                card1.style.display = 'none'
                                return 
                            } else {
                                card2.style.display = 'none'
                                card1.style.display = 'flex'
                                return 
                            }
                        }
                    } )
                }
            } )
    }
    // Init chain
    init() {
        // Spinner
        // this.spinner()
        // Control
        weather.forecastHandler()
        // Get user geolocation
        window.onload = this.getMyLocation();
        // Clear latest query block
        this.clearLatestQuery()
        // Interval for time
        setInterval( this.currentDate, 5000 );
        // setInterval( () => {
        //     weather.geocodingFromQuery( userLocation.innerText, true )
        // }, 5000 );

    }
}
// Create new class
const weather = new WeatherForecast()
weather.init()

// Query 
let query
let queryArr = [];
// Listen event in input
queryField.oninput = ( e ) => {
    query = e.target.value;
}
// On submit
form.addEventListener( 'submit', e => {
    e.preventDefault()
    queryField.value = '';
    if ( query != null ) {

        // weather.spinner()
        weather.geocodingFromQuery( query )
    }
} )




// Animation query icon
function animationIcon( iconId ) {
    let animatedIcon
    switch ( iconId ) {
        //Sun or Clear sky
        case '01d':
        case '01n':
            animatedIcon = `<div class="svg-contain">
            <svg
                version="1.1"
                class="clear-sky-svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 72.3 52.6"
                style="enable-background: new 0 0 72.3 52.6"
                xml:space="preserve"
            >
                <g>
                    <path
                        class="sun"
                        d="M50.8,25.7c0,7.9-6.4,14.4-14.4,14.4s-14.4-6.4-14.4-14.4s6.4-14.4,14.4-14.4S50.8,17.8,50.8,25.7z"
                    />
                    <path class="line big-path line-1" d="M54.5,25.8h6" />
                    <path class="line big-path line-2" d="M12.4,25.8h6" />
                    <path class="line big-path line-3" d="M36.5,44.3v6" />
                    <path class="line big-path line-4" d="M36.5,8.2v-6" />
                    <path class="line big-path line-5" d="M23,38.8l-4.8,4.8" />
                    <path class="line big-path line-6" d="M54.9,8.9L50,13.8" />
                    <path class="line big-path line-7" d="M50,38.8l4.4,4.4" />
                    <path class="line big-path line-8" d="M18.8,9.6l4.2,4.2" />
                </g>
            </svg>
        </div>`
            break;
            // Cloud
        case '02d':
        case '02n':
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            animatedIcon = `<div class="svg-contain">
                <svg
                    class="overcast-clouds"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 82.6 52.3"
                    style="enable-background: new 0 0 82.6 52.3"
                    xml:space="preserve"
                >
                    <g id="Layer_1">
                        <path
                            class="cloud-still"
                            d="M21.8,24.2c0.1,0,0.3-1.1,0.4-1.2c0.5-1.2,1.1-2.4,1.8-3.4c3.9-5.7,12.6-7.1,18.2-3.1c0,0,3.7-6,11-5.9
                  c0,0,5.6-0.6,10.3,4.9c0,0,2.8,3.3,2.9,7.4c0,0,3.2-0.5,5.4,1c0,0,6.2,2.6,5.9,10.8H56.3c0,0-2-3.5-7.3-3.6c0.2,0-0.5-2.2-0.6-2.4
                  c-1.4-4.4-5.5-6.9-9.9-7.4c-3.4-0.4-6.6,0.8-9,3.2c-0.1,0.1-1.2,1.3-1.2,1.3S25.3,23.6,21.8,24.2z"
                        />
                        <path
                            class="cloud-still"
                            d="M57.6,40.7c0-4.8-3.9-8.6-8.6-8.6c-0.2,0-0.4,0-0.6,0.1c-0.1-0.8-0.2-1.7-0.4-2.4c-0.3-1-0.8-2-1.4-2.9
                  c-2-2.9-5.3-4.8-9-4.8c-2.3,0-4.4,0.7-6.1,1.9c-0.6,0.4-1.1,0.8-1.6,1.3c-0.2,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.6,0.8
                  c-1.8-1.2-3.9-1.9-6.2-1.9c-5.5,0-10,4-10.8,9.3c-3.5,1-6.1,3.9-6.6,7.6h26.3h12.7h12.9h0.7C57.6,41.8,57.6,41.4,57.6,40.7z"
                        />
                    </g>
                    <g id="Layer_2"></g>
                </svg>
            </div>`
            break;
            // Rain
        case '09d':
        case '09n':
        case '10d':
        case '10n':
            animatedIcon = `<div class="svg-contain">
                <svg
                    class="hurricane-svg"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="-437 254.4 85 52.6"
                    style="enable-background: new -437 254.4 85 52.6"
                    xml:space="preserve"
                >
                    <path
                        class="cloud"
                        d="M-361.9,280.5c1.4,0,2.6,0.7,3.4,1.7h1.1c0.4-8.2-5.9-10.8-5.9-10.8c-2.2-1.5-5.4-1-5.4-1
              c-0.1-4.1-2.9-7.4-2.9-7.4c-4.7-5.5-10.3-4.9-10.3-4.9c-7.4-0.2-11,5.9-11,5.9c-5.6-4-14.3-2.6-18.2,3.1c-0.7,1.1-1.3,2.2-1.8,3.4
              c0,0.1-0.3,1.2-0.4,1.2c3.5-0.6,6.6,1.6,6.6,1.6s1.1-1.1,1.2-1.3c2.4-2.4,5.6-3.6,9-3.2c4.4,0.5,8.5,3,9.9,7.4
              c0.1,0.2,0.8,2.4,0.6,2.4c5.3,0.1,7.3,3.6,7.3,3.6h13.4C-364.5,281.2-363.3,280.5-361.9,280.5z"
                    />
                    <path
                        class="cloud"
                        d="M-386,279.6c-0.2,0-0.4,0-0.6,0.1c-0.1-0.8-0.2-1.7-0.4-2.4c-0.3-1-0.8-2-1.4-2.9c-2-2.9-5.3-4.8-9-4.8
              c-2.3,0-4.4,0.7-6.1,1.9c-0.6,0.4-1.1,0.8-1.6,1.3c-0.2,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.6,0.8c-1.8-1.2-3.9-1.9-6.2-1.9
              c-5.5,0-10,4-10.8,9.3c-3.5,1-6.1,3.9-6.6,7.6h26.3h12.7h2.3l4.7-6.2c0.6-0.8,1.7-0.9,2.5-0.3s0.9,1.7,0.3,2.5l-3.1,4h0.5h5.6h0.7
              c0.1,0,0.2-0.4,0.2-1.1C-377.4,283.5-381.3,279.6-386,279.6z"
                    />
                    <path class="line" d="M-426.9,294.4l-5.1,7.3" />
                    <path class="line" d="M-420.8,294.4l-5.1,7.3" />
                    <path class="line" d="M-415.4,294.4l-5.1,7.3" />
                    <path class="line" d="M-409.9,294.4l-5.1,7.3" />
                    <path class="line" d="M-404.5,294.4l-5.1,7.3" />
                    <path class="line" d="M-399.1,294.4l-5.1,7.3" />
                    <path class="line" d="M-393.7,294.4l-5.1,7.3" />
                    <path class="line" d="M-388.2,294.4l-5.1,7.3" />
                    <g>
                        <path class="little-path path-1" d="M-374.8,287.2h10.6" />
                        <path class="little-path path-2" d="M-373.8,289.3h10.9" />
                        <path
                            class="big-path"
                            d="M-376,288.3c0,0,14,0,14,0c1.7,0,3.1-1.4,3.3-3.1c0-0.5,0-1-0.3-1.4c-0.9-2.3-4.1-2.7-5.6-0.7
                  c-0.4,0.6-0.7,1.3-0.7,1.9"
                        />
                        <path
                            class="little-path path-3"
                            d="M-364.1,285c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2"
                        />
                    </g>
                </svg>
            </div>`
            break;
            // Storm
        case '11d':
        case '11n':
            animatedIcon = `<div class="svg-contain">
                <svg
                    class="hurricane-svg"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="-437 254.4 85 52.6"
                    style="enable-background: new -437 254.4 85 52.6"
                    xml:space="preserve"
                >
                    <path
                        class="cloud"
                        d="M-361.9,280.5c1.4,0,2.6,0.7,3.4,1.7h1.1c0.4-8.2-5.9-10.8-5.9-10.8c-2.2-1.5-5.4-1-5.4-1
              c-0.1-4.1-2.9-7.4-2.9-7.4c-4.7-5.5-10.3-4.9-10.3-4.9c-7.4-0.2-11,5.9-11,5.9c-5.6-4-14.3-2.6-18.2,3.1c-0.7,1.1-1.3,2.2-1.8,3.4
              c0,0.1-0.3,1.2-0.4,1.2c3.5-0.6,6.6,1.6,6.6,1.6s1.1-1.1,1.2-1.3c2.4-2.4,5.6-3.6,9-3.2c4.4,0.5,8.5,3,9.9,7.4
              c0.1,0.2,0.8,2.4,0.6,2.4c5.3,0.1,7.3,3.6,7.3,3.6h13.4C-364.5,281.2-363.3,280.5-361.9,280.5z"
                    />
                    <path
                        class="cloud"
                        d="M-386,279.6c-0.2,0-0.4,0-0.6,0.1c-0.1-0.8-0.2-1.7-0.4-2.4c-0.3-1-0.8-2-1.4-2.9c-2-2.9-5.3-4.8-9-4.8
              c-2.3,0-4.4,0.7-6.1,1.9c-0.6,0.4-1.1,0.8-1.6,1.3c-0.2,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.6,0.8c-1.8-1.2-3.9-1.9-6.2-1.9
              c-5.5,0-10,4-10.8,9.3c-3.5,1-6.1,3.9-6.6,7.6h26.3h12.7h2.3l4.7-6.2c0.6-0.8,1.7-0.9,2.5-0.3s0.9,1.7,0.3,2.5l-3.1,4h0.5h5.6h0.7
              c0.1,0,0.2-0.4,0.2-1.1C-377.4,283.5-381.3,279.6-386,279.6z"
                    />
                    <polyline
                        class="lightening"
                        points="-382.8,284.2 -387.9,290.9 -380.6,291.2 -387.9,302 "
                    />
                    <path class="line" d="M-426.9,294.4l-5.1,7.3" />
                    <path class="line" d="M-420.8,294.4l-5.1,7.3" />
                    <path class="line" d="M-415.4,294.4l-5.1,7.3" />
                    <path class="line" d="M-409.9,294.4l-5.1,7.3" />
                    <path class="line" d="M-404.5,294.4l-5.1,7.3" />
                    <path class="line" d="M-399.1,294.4l-5.1,7.3" />
                    <path class="line" d="M-393.7,294.4l-5.1,7.3" />
                    <path class="line" d="M-388.2,294.4l-5.1,7.3" />
                    <g>
                        <path class="little-path path-1" d="M-374.8,287.2h10.6" />
                        <path class="little-path path-2" d="M-373.8,289.3h10.9" />
                        <path
                            class="big-path"
                            d="M-376,288.3c0,0,14,0,14,0c1.7,0,3.1-1.4,3.3-3.1c0-0.5,0-1-0.3-1.4c-0.9-2.3-4.1-2.7-5.6-0.7
                  c-0.4,0.6-0.7,1.3-0.7,1.9"
                        />
                        <path
                            class="little-path path-3"
                            d="M-364.1,285c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2"
                        />
                    </g>
                </svg>
            </div>`
            break;
            // Snow
        case '13d':
        case '13n':
            animatedIcon = `<div class="svg-contain">
                <svg
                    version="1.1"
                    class="snow-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 70.3 52.6"
                    style="enable-background: new 0 0 70.3 52.6"
                    xml:space="preserve"
                >
                    <g id="Layer_1">
                        <path
                            class="cloud"
                            d="M63.9,30.9c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1
                  c-2.1-3.2-5.8-5.3-9.9-5.3c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9
                  c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9H63h0.8C63.9,32.1,63.9,31.7,63.9,30.9z"
                        />
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="10.3"
                                y1="37"
                                x2="10.3"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="13.5"
                                y1="40.3"
                                x2="7"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="12.6"
                                    y1="38"
                                    x2="8"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="12.6"
                                    y1="42.6"
                                    x2="8"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="22.7"
                                y1="37"
                                x2="22.7"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="25.9"
                                y1="40.3"
                                x2="19.4"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="25"
                                    y1="38"
                                    x2="20.4"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="25"
                                    y1="42.6"
                                    x2="20.4"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="35.2"
                                y1="37"
                                x2="35.2"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="38.4"
                                y1="40.3"
                                x2="31.9"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="37.5"
                                    y1="38"
                                    x2="32.9"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="37.5"
                                    y1="42.6"
                                    x2="32.9"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="48.3"
                                y1="37"
                                x2="48.3"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="51.6"
                                y1="40.3"
                                x2="45"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="50.6"
                                    y1="38"
                                    x2="46"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="50.6"
                                    y1="42.6"
                                    x2="46"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="60.5"
                                y1="37"
                                x2="60.5"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="63.7"
                                y1="40.3"
                                x2="57.2"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="62.8"
                                    y1="38"
                                    x2="58.2"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="62.8"
                                    y1="42.6"
                                    x2="58.2"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="10.3"
                                y1="37"
                                x2="10.3"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="13.5"
                                y1="40.3"
                                x2="7"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="12.6"
                                    y1="38"
                                    x2="8"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="12.6"
                                    y1="42.6"
                                    x2="8"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="22.7"
                                y1="37"
                                x2="22.7"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="25.9"
                                y1="40.3"
                                x2="19.4"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="25"
                                    y1="38"
                                    x2="20.4"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="25"
                                    y1="42.6"
                                    x2="20.4"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="35.2"
                                y1="37"
                                x2="35.2"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="38.4"
                                y1="40.3"
                                x2="31.9"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="37.5"
                                    y1="38"
                                    x2="32.9"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="37.5"
                                    y1="42.6"
                                    x2="32.9"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="48.3"
                                y1="37"
                                x2="48.3"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="51.6"
                                y1="40.3"
                                x2="45"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="50.6"
                                    y1="38"
                                    x2="46"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="50.6"
                                    y1="42.6"
                                    x2="46"
                                    y2="38"
                                />
                            </g>
                        </g>
                        <g class="snowflake">
                            <line
                                class="snowflake-path big-path"
                                x1="60.5"
                                y1="37"
                                x2="60.5"
                                y2="43.5"
                            />
                            <line
                                class="snowflake-path big-path"
                                x1="63.7"
                                y1="40.3"
                                x2="57.2"
                                y2="40.3"
                            />
                            <g>
                                <line
                                    class="snowflake-path big-path"
                                    x1="62.8"
                                    y1="38"
                                    x2="58.2"
                                    y2="42.6"
                                />
                                <line
                                    class="snowflake-path big-path"
                                    x1="62.8"
                                    y1="42.6"
                                    x2="58.2"
                                    y2="38"
                                />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>`
            break;
            // Mist
        case '50d':
        case '50n':
            animatedIcon = `<div class="svg-contain">
                <svg
                    class="fog-svg"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 68 52.6"
                    style="enable-background: new 0 0 68 52.6"
                    xml:space="preserve"
                >
                    <g id="Layer_1">
                        <g>
                            <path
                                class="cloud st3"
                                d="M62.8,29.3c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1
                  C48.6,11,44.9,9,40.8,9c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9
                  c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9h14.1h0.8C62.7,30.6,62.8,30.1,62.8,29.3z"
                            />
                            <path class="fog-line big-path" d="M7.3,28.8h12.4" />
                            <path class="fog-line big-path" d="M23.5,28.8h38.4" />
                            <path class="fog-line big-path" d="M57.3,32.6h5.2" />
                            <path class="fog-line big-path" d="M31.2,32.6h22.1" />
                            <path class="fog-line big-path" d="M6.2,32.6h21.1" />
                            <path class="fog-line big-path" d="M11.4,43.6H6.2" />
                            <path class="fog-line big-path" d="M37.5,43.6H15.4" />
                            <path class="fog-line big-path" d="M62.5,43.6H41.4" />
                            <path class="fog-line big-path" d="M6.2,36.4h2.1" />
                            <path class="fog-line big-path" d="M11.9,36.4h6" />
                            <path class="fog-line big-path" d="M21.8,36.4h20.4" />
                            <path class="fog-line big-path" d="M46.3,36.4h16.1" />
                            <path class="fog-line big-path" d="M55.2,40.2h7.3" />
                            <path class="fog-line big-path" d="M48.3,40.2h2.8" />
                            <path class="fog-line big-path" d="M37.3,40.2H44" />
                            <path class="fog-line big-path" d="M18.3,40.2h15.3" />
                            <path class="fog-line big-path" d="M6.2,40.2h8" />
                        </g>
                    </g>
                </svg>
            </div>`
            break;

        default:
            break;
    }
    return animatedIcon;
}