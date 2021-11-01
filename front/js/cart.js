//Obtiens l'id a partir du localStorrage
async function getInfoWithId(i) {
	let idColorStr = localStorage.key(i);
	let idColorArray = idColorStr.split(",");
	let itemId = idColorArray[0];
	try {
		let response = await fetch(`http://localhost:3000/api/products/${itemId}`);
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}
// Verifie si le panier est vide
function checkIfCartEmpty() {
	if (localStorage.length == 0) {
		document.getElementById("cart__items").innerHTML = "<p >Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction 🛋️</a>.</p>";
	}
}
// Affiche les donnée dans l'html
(async function renderEachItem() {
	let htmlRender = "";
	const itemContainer = document.getElementById("cart__items");
	// 1) on verifie si le panier est vide
	checkIfCartEmpty();
	// 2) on commence la boucle
	for (let i = 0; i < localStorage.length; i++) {
		let item = await getInfoWithId(i);
		let htmlContent = `
		<article class="cart__item" data-id="${item._id}" data-color="${localStorage.key(i).split(",")[1]}" data-price="${item.price}">
			<div class="cart__item__img">
				<img src="${item.imageUrl}" alt="${item.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${item.name}</h2>
					<p>${item.price} €</p>
					<p>Coloris : ${localStorage.key(i).split(",")[1]}</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Qté : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorage.getItem(localStorage.key(i))}">
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem">Supprimer</p>
					</div>
				</div>
			</div>
		</article>
		`;
		htmlRender += htmlContent;
	}
	itemContainer.innerHTML += htmlRender;

	// Active la fonction d'effacement de l'article
	deleteItem();
	// Active la fonction de modification de quantité de l'article
	itemQuantityRefresh();
	// Active la fonction du montant de l'article
	totalItemInCartRefresh();
	// Active la fonction du montant total  des articles
	totalPriceRefresh();
})();

// Actualise le montant total du panier
function totalPriceRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	let totalCartPrice = 0;
	for (let i = 0; i < quantitySelector.length; i++) {
		let articleDOM = quantitySelector[i].closest("article");
		let individualPrice = articleDOM.dataset.price;
		totalCartPrice += parseInt(quantitySelector[i].value) * individualPrice;
	}
	let totalPriceDisplay = document.getElementById("totalPrice");
	totalPriceDisplay.innerHTML = totalCartPrice;
}
// Actualise le montant total d'un article dans le panier
function totalItemInCartRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	let itemAmount = 0;
	for (let i = 0; i < quantitySelector.length; i++) {
		itemAmount += parseInt(quantitySelector[i].value);
	}
	const totalQuantityDisplay = document.getElementById("totalQuantity");
	totalQuantityDisplay.innerHTML = itemAmount;

// Appel le nouveau prix du montant du panier
	totalPriceRefresh();
// Vérifie si il n'y a pas deja un article
	checkIfCartEmpty();
}
// Efface l'article dans les données du localStorrage
function deleteItem() {
	let deleteItemBtns = document.querySelectorAll(".deleteItem");
	for (let i = 0; i < deleteItemBtns.length; i++) {
		deleteItemBtns[i].addEventListener("click", (e) => {
			e.preventDefault();

			let articleDOM = deleteItemBtns[i].closest("article");
			let itemId = articleDOM.dataset.id;
			let itemColor = articleDOM.dataset.color;
			let itemQuantity = localStorage.getItem(localStorage.key(i));
			let localStorageKey = [itemId, itemColor];
		
			localStorage.removeItem(localStorageKey, itemQuantity);
			articleDOM.remove();

			// Actualise le montant total du panier
			totalItemInCartRefresh();
		});
	}
}

// Modifie la quantité d'article dans le localStorrage
function itemQuantityRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	for (let i = 0; i < quantitySelector.length; i++) {
		quantitySelector[i].addEventListener("change", (e) => {
			e.preventDefault();

			let articleDOM = quantitySelector[i].closest("article");
			let itemId = articleDOM.dataset.id;
			let itemColor = articleDOM.dataset.color;
			let localStorageKey = [itemId, itemColor];
			let itemQuantity = e.target.value;
			if (itemQuantity == 0) {
				alert("Il faut au moins ajouter un Kanap");
			}
			localStorage.setItem(localStorageKey, itemQuantity);

		// Actualising the total amount of item in the cart
			totalItemInCartRefresh();
		});
	}
}
// Construction de l'objet pour le formulaire de commande
class Form {
	constructor() {
		this.firstName = document.getElementById("firstName").value;
		this.lastName = document.getElementById("lastName").value;
		this.adress = document.getElementById("address").value;
		this.city = document.getElementById("city").value;
		this.email = document.getElementById("email").value;
	}
}
// Analyse les input user avec une regex
function userInputVerification() {
	const userForm = new Form();
	// Prenom
	function firstNameValid() {
		const userFirstName = userForm.firstName;
		const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
		if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(userFirstName)) {
			firstNameErrorMsg.innerText = "";
			return true;
		} else {
			firstNameErrorMsg.innerText = "Votre prénom ne peut contenir que des lettres, de 3 à 20 caractères.";
		}
	}
	// Nom
	function lastNameValid() {
		const userLastName = userForm.lastName;
		const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
		if (/^[A-Za-z]{2,20}$/.test(userLastName)) {
			lastNameErrorMsg.innerText = "";
			return true;
		} else {
			lastNameErrorMsg.innerText = "Votre nom ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// Adresse
	function adressValid() {
		const userAdress = userForm.adress;
		const addressErrorMsg = document.getElementById("addressErrorMsg");
		if (/[^§]{5,50}$/.test(userAdress)) {
			addressErrorMsg.innerText = "";
			return true;
		} else {
			addressErrorMsg.innerText = "L'adresse semble incorrect.";
		}
	}
	// Ville
	function cityValid() {
		const userCity = userForm.city;
		const cityErrorMsg = document.getElementById("cityErrorMsg");
		if (/^(.){4,128}$/.test(userCity)) {
			cityErrorMsg.innerText = "";
			return true;
		} else {
			cityErrorMsg.innerText = "La ville ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// Email
	function emailValid() {
		const userEmail = userForm.email;
		const emailErrorMsg = document.getElementById("emailErrorMsg");
		if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
			emailErrorMsg.innerText = "";
			return true;
		} else {
			emailErrorMsg.innerText = "Il faut renseigner une adresse email valide.";
		}
	}

	if (firstNameValid() && lastNameValid() && adressValid() && cityValid() && emailValid()) {
		return true;
	} else {
		console.log("Unvalid form input.");
	}
}

	// Envoi l'id de larticle dans le panier dans un tableau
	function productToSend() {
		let userBasket = [];
		for (let i = 0; i < localStorage.length; i++) {
			let idColor = localStorage.key(i);
			let idColorArray = idColor.split(",");
			let id = idColorArray[0];
			userBasket.push(id);
		}
		return userBasket;
	}
	// Envoi l'information de l'api si elle est valide par numéro de commande
	let userFormSubmit = document.getElementById("order");
	userFormSubmit.addEventListener("click", (e) => {
		e.preventDefault();

		if (userInputVerification()) {
			const products = productToSend();
			const toSend = {
				contact: {
					firstName: firstName.value,
					lastName: lastName.value,
					address: address.value,
					city: city.value,
					email: email.value,
				},
				products,
			};
			// envoyer l'information a l'api
			fetch("http://localhost:3000/api/products/order", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(toSend),
			})
			// Sauvegarder le numero de commande dans l'url
				.then((response) => response.json())
				.then((value) => {
					localStorage.clear();
					document.location.href = `./confirmation.html?id=${value.orderId}`;
				})
				.catch((error) => {
					console.log("Error: " + error);
				});
		}
	});