// Get informations from API
async function getItems() {
	try {
		let response = await fetch("http://localhost:3000/api/products");
		return await response.json();
	} catch (error) {
		console.log("Erreur : " + error);
	}
}

// Function of the render on Html
async function renderItems() {
	let items = await getItems();
	let htmlRender = "";
	items.forEach((item) => {
		let htmlContent = `
		<a href="./product.html?id=${item._id}">
			<article>
				<img src="${item.imageUrl}" alt="${item.altTxt}">
				<h3 class="productName">${item.name}</h3>
				<p class="productDescription">${item.description}</p>
			</article>
		</a>
		`;
		htmlRender += htmlContent;
	});
	let itemContainer = document.getElementById("items");
	itemContainer.innerHTML += htmlRender;
}

// Calling the function
renderItems();