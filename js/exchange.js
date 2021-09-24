$(function () {

	let currenciesList = [];
	let usuarioActivo = JSON.parse(localStorage.getItem("usuario"));
	let precioMoneda;
	$.get("./data/cuentas.json", function (respuesta, estado) {
		if (estado === "success") {
			for (const user of respuesta) {
				if (user.usuario == usuarioActivo) {
					for (const moneda in user.wallet) {
						currenciesList.push(moneda);

					}
					currenciesList.sort();
					let seleccion = document.getElementById("cryptoSelect");
					for (let coin of currenciesList) {
						let opcion = document.createElement("option");
						opcion.value = coin;
						opcion.text = coin;
						seleccion.appendChild(opcion);
					}
					$("#cryptoSelect option[value='BTC']").attr("selected", "selected");
					$("#cryptoSelect").trigger("change")
				}
			}
		}

	});





	/* 	let currencies;
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
				$("#cryptoSelect option[value='BTC']").attr("selected", "selected");
				$("#cryptoSelect").trigger("change");
			};
		}); */
});