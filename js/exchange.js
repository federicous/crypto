$(function () {

	/* ################ Lista de criptomonedas disponibles en la wallet ################# */
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

	/* ###################### Lista de criptomonedas posibles de intercambio ##################### */

	let currencies;
	let currenciesList2 = [];
	const URLGETCUR = "https://api.pro.coinbase.com/currencies"
	$.get(URLGETCUR, function (respuesta, estado) {
		if (estado === "success") {
			currencies = respuesta;
			for (const moneda of currencies) {
				if (moneda.details.type == "crypto") {
					currenciesList2.push(moneda.id);
				}
			}
			currenciesList2.sort();
			let seleccion = document.getElementById("cryptoSelect2");

			for (let coin of currenciesList2) {
				let opcion = document.createElement("option");
				opcion.value = coin;
				opcion.text = coin;
				seleccion.appendChild(opcion);
			}
			$("#cryptoSelect option[value='BTC']").attr("selected", "selected");
			$("#cryptoSelect2").trigger("change");
		};
	});

	let cryptoNameOrigen;
	let cryptoNameDestino;
	let URLGETORIGEN;
	let URLGETDESTINO;
	/* ################### Eventos de seleccion de criptomonedas a intercambiar ################# */
	$("#cryptoSelect").change(() => {
		cryptoNameOrigen = $("#cryptoSelect").val();
		$(".unidadOrigen").text(cryptoNameOrigen);
		URLGETORIGEN = `https://api.coinbase.com/v2/prices/${cryptoNameOrigen}-USD/buy`

		$.get("./data/cuentas.json", function (respuesta, estado) {
			if (estado === "success") {
				for (const user of respuesta) {
					if (user.usuario == usuarioActivo) {
						console.log(user.usuario);console.log("pepe");
						for (const moneda in user.wallet) {
							if (moneda == cryptoNameOrigen) {console.log("pepe2");
								console.log(user.wallet[moneda]);
								localStorage.setItem("cryptoOrigenCantidad", JSON.stringify(user.wallet[moneda]));
								console.log(respuesta.data.amount);
								coinbaseOrigen = JSON.parse(localStorage.getItem("cryptoOrigenCantidad"));
								console.log(coinbaseOrigen);
							}
	
						}
					}
	
				}
			}
	
		});
	});

	$("#cryptoSelect2").change(() => {
		cryptoNameDestino = $("#cryptoSelect2").val();
		$(".unidadDestino").text(cryptoNameDestino);
		URLGETDESTINO = `https://api.coinbase.com/v2/prices/${cryptoNameDestino}-USD/buy`
	});

	/* ##################### Actualizacion de precios en dolares ######################### */
	let coinbaseOrigen;
	let coinbaseDestino;
	setInterval(() => {
		$.get(URLGETORIGEN, function (respuesta, estado) {
			if (estado === "success") {
	coinbaseOrigen = JSON.parse(localStorage.getItem("cryptoOrigenCantidad"));
				$("#origenInput").attr("value", `${coinbaseOrigen} (${coinbaseOrigen*respuesta.data.amount} USD)`);
				$("#origenInput").trigger("change");
			}
		});
		$.get(URLGETDESTINO, function (respuesta, estado) {
			if (estado === "success") {
				$("#destinoInput").attr("value", respuesta.data.amount);
				$("#destinoInput").trigger("change");
				// console.log(respuesta.data.amount);
				localStorage.setItem("cryptoOrigen", JSON.stringify(respuesta.data.amount));
			}
		});

	}, 5000);
	// coinbaseOrigen = JSON.parse(localStorage.getItem("cryptoOrigen"));
	// console.log(coinbaseOrigen);

	// $.get("./data/cuentas.json", function (respuesta, estado) {
	// 	if (estado === "success") {
	// 		console.log(respuesta[1].usuario);
	// 	}
	// });

	console.log("pepe");



});