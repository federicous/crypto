/* ################## Genero la lista de criptomonedas para seleccionar ##################### */
$(function () {

	let currencies;
	let currenciesList = [];
	const URLGETCUR = "https://api.pro.coinbase.com/currencies"
	$.get(URLGETCUR, function (respuesta, estado) {
		if (estado === "success") {
			currencies = respuesta;
			console.log(typeof (respuesta));
			console.log(typeof (currencies));
			console.log("uno");
			for (const moneda of currencies) {
				if (moneda.details.type == "crypto") {
					currenciesList.push(moneda.id);
					console.log(moneda);
				}
			}
			currenciesList.sort();
			let seleccion = document.getElementById("cryptoSelect");

			for (let coin of currenciesList) {
				let opcion = document.createElement("option");
				opcion.value = coin;
				opcion.text = coin;
				seleccion.appendChild(opcion);
			}
			$("option[value='BTC']").attr("selected", "selected");
			$("#cryptoSelect").attr('value','BTC');
			console.log($("#cryptoSelect").val());
		};
		console.log("dos");
		console.log(currencies);
	});
	/* 		console.log("tres");
			console.log(typeof(currencies));

	for (const moneda of currencies) {
		console.log(moneda.id);
	}

	console.log(currencies);

	let listaCryptos = ["BTC", "ETH", "ADA", "LTC", "DOT", "MATIC", "NEO", "ATOM", "VET", "ICX"];
	let seleccion = document.getElementById("cryptoSelect");

	for (let coin of listaCryptos) {
		let opcion = document.createElement("option");
		opcion.value = coin;
		opcion.text = coin;
		seleccion.appendChild(opcion);
	} */
});