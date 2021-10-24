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







			// for ( let i = 0; i <= backgroundsArray.length-1; i++ ) {
			// 	console.log(i);
			// 	let interval = setInterval( function () {
			// 		if ( i == backgroundsArray.length-1 ) {
			// 			clearInterval( interval )
			// 		} else {
			// 			outUrl = `url(${backgroundsArray[i].webformatURL})`
			// 		}
			// 		// console.log( backgroundsArray[ i ].webformatURL );
			// 	}, 3000 )
			// }
		} );
}
// у меня есть массив с урлами, нужно каждые 4 секунды доставать из массива урл и сетить в бекграунд 