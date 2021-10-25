const urlPixabay = 'https://pixabay.com/api/?key=23641816-dcf4d4f9c34852472448f65fc&page=1&per_page=1&orientation=horizontal&category=places&image_type=photo';
let backgroundsArray
// Request to Pixabay
function pixabayRequest( queryCity ) {
	fetch( urlPixabay + `&q=${queryCity}&per_page=5` )
		.then( ( response1 ) => {
			return response1.json();
		} )
		.then( ( response2 ) => {
			backgroundsArray = response2.hits;
			if (backgroundsArray[0] == undefined){
				mainBlock.style.backgroundImage = `url()`;
				return
			}else{
				let outUrl = backgroundsArray[0].largeImageURL;
				mainBlock.style.backgroundImage = `url(${outUrl})`;
			}
			
		} );
}