// Get informations from API
async function getItems() {
	try {
		let response = await fetch("http://localhost:3000/api/products");
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}