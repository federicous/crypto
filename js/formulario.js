/* ################## Genero la lista de criptomonedas para seleccionar ##################### */
$(function () {

	let currencies;
	let currenciesList = [];
	const URLGETCUR = "https://api.pro.coinbase.com/currencies"
	$.get(URLGETCUR, function (respuesta, estado) {
		if (estado === "success") {
			currencies = respuesta;
			for (const moneda of currencies) {
				if (moneda.details.type == "crypto") {
					currenciesList.push(moneda.id);
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
			$("#cryptoSelect").trigger("change");
		};
	});
});