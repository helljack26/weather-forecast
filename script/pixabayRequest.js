const urlPixabay = 'https://pixabay.com/api/?key=23641816-dcf4d4f9c34852472448f65fc&page=1&per_page=1&orientation=horizontal&category=places&image_type=photo';
let count = 0;
let backgroundsArray
// Request to Pixabay
function pixabayRequest( queryCity ) {
	fetch( urlPixabay + `&q=${queryCity}&per_page=5` )
		.then( ( response1 ) => {
			return response1.json();
		} )
		.then( ( response2 ) => {
			backgroundsArray = response2.hits;
			let outUrl = backgroundsArray[count].largeImageURL;
			console.log(queryCity);
			mainBlock.style.backgroundImage = `url(${outUrl})`;
		} );
}