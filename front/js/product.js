// Check if the id parameter exist
function idVerification() {
	let url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);

	if (searchParams.has("id")) {
		let id = searchParams.get("id");
		return id;
	} else {
		console.log("Error, they'r is no id match.");
	}
}
