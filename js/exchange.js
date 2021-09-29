let coinbaseOrigen;
let coinbaseDestino;
let cryptoNameOrigen;
let cryptoNameDestino;
let URLGETORIGEN;
let URLGETDESTINO;
let cuentas;
let resultadoOrigen;
let resultadoDestino;
let cantidadOrigen;
let cantidadDestino;
let cantidadConvertir;
let cantidadConvertirName;
let cryptoOrigenUSD;
let cryptoDestinoUSD;
let cryptoDestinoCotizacion;
let cryptoOrigenCotizacion;
let monedaPresente = false;
let currenciesList = [];
let usuarioActivo = JSON.parse(localStorage.getItem("usuario"));

$(function () {
	$.get("./data/cuentas.json", function (respuesta, estado) {
		if (estado === "success") {
			localStorage.setItem("cuentas", JSON.stringify(respuesta));

		}

	});
	cuentas = JSON.parse(localStorage.getItem("cuentas"));
	console.log(cuentas);

	/* ################### Eventos de seleccion de criptomonedas a intercambiar ################# */
	$("#cryptoSelect").change(() => {
		cryptoNameOrigen = $("#cryptoSelect").val();
		$(".unidadOrigen").text(cryptoNameOrigen);
		URLGETORIGEN = `https://api.coinbase.com/v2/prices/${cryptoNameOrigen}-USD/buy`
		console.log(URLGETORIGEN);


		for (const user of cuentas) {
			if (user.usuario == usuarioActivo) {
				for (const moneda in user.wallet) {
					if (moneda == cryptoNameOrigen) {
						localStorage.setItem("cryptoOrigenCantidad", JSON.stringify(user.wallet[moneda]));
						coinbaseOrigen = JSON.parse(localStorage.getItem("cryptoOrigenCantidad"));
					}

				}
			}

		}

	});

	$("#cryptoSelect2").change(() => {
		cryptoNameDestino = $("#cryptoSelect2").val();
		$(".unidadDestino").text(cryptoNameDestino);
		URLGETDESTINO = `https://api.coinbase.com/v2/prices/${cryptoNameDestino}-USD/buy`

		for (const user of cuentas) {
			if (user.usuario == usuarioActivo) {
				for (const moneda in user.wallet) {
					// console.log(moneda);
					if (moneda == cryptoNameDestino) {
						localStorage.setItem("cryptoDestinoCantidad", JSON.stringify(user.wallet[moneda]));
						coinbaseDestino = JSON.parse(localStorage.getItem("cryptoDestinoCantidad"));
						monedaPresente = true;
					}

				}
				/* Si la moneda no esta presente en la cartera aparece con cantidad "0" */
				if (monedaPresente == false) {
					localStorage.setItem("cryptoDestinoCantidad", JSON.stringify("0"));
					console.log(cryptoNameDestino);
					coinbaseDestino = JSON.parse(localStorage.getItem("cryptoDestinoCantidad"));

				}
			}

		}

	});



	/* ################ Lista de criptomonedas disponibles en la wallet ################# */


	listaCryptoWallet();

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


	/* ##################### Actualizacion de precios en dolares ######################### */
	setInterval(() => {
		$.get(URLGETORIGEN, function (respuesta, estado) {
			if (estado === "success") {
				coinbaseOrigen = JSON.parse(localStorage.getItem("cryptoOrigenCantidad"));
				$("#origenInput").attr("value", `${coinbaseOrigen}`);
				$("#origenInputUSD").attr("value", `${coinbaseOrigen*respuesta.data.amount}`);
				$("#origenInput").trigger("change");
				localStorage.setItem("cryptoOrigenUSD", JSON.stringify(`${coinbaseOrigen*respuesta.data.amount}`));
				localStorage.setItem("cryptoOrigenCotizacion", JSON.stringify(`${respuesta.data.amount}`));
			}
		});
		$.get(URLGETDESTINO, function (respuesta, estado) {
			if (estado === "success") {
				coinbaseDestino = JSON.parse(localStorage.getItem("cryptoDestinoCantidad"));
				$("#destinoInput").attr("value", `${coinbaseDestino}`);
				$("#destinoInputUSD").attr("value", `${coinbaseDestino*respuesta.data.amount}`);
				$("#destinoInput").trigger("change");
				// console.log(respuesta.data.amount);
				localStorage.setItem("cryptoDestinoUSD", JSON.stringify(`${coinbaseDestino*respuesta.data.amount}`));
				localStorage.setItem("cryptoDestinoCotizacion", JSON.stringify(`${respuesta.data.amount}`));
			}
		});

	}, 5000);

	/* ################# Evento Boton Convertir ################ */

	$("#botonConvertir").click(() => {
		quitarAviso();
		cantidadConvertir = $("#dineroInput").val();
		cantidadConvertirName = $("#dineroInput").attr("name");
		if (isNaN(cantidadConvertir) || (cantidadConvertir < 0) || cantidadConvertir == "") {
			aviso(`${cantidadConvertirName} No válido!!`, "alert");
		} else {
			cantidadDestino = JSON.parse(localStorage.getItem("cryptoDestinoCantidad"));
			cantidadOrigen = JSON.parse(localStorage.getItem("cryptoOrigenCantidad"));
			cryptoOrigenUSD = JSON.parse(localStorage.getItem("cryptoOrigenUSD"));
			cryptoDestinoUSD = JSON.parse(localStorage.getItem("cryptoDestinoUSD"));
			cryptoDestinoCotizacion = JSON.parse(localStorage.getItem("cryptoDestinoCotizacion"));
			cryptoOrigenCotizacion = JSON.parse(localStorage.getItem("cryptoOrigenCotizacion"));

			if (cantidadOrigen == "0") {
				aviso(`No hay fondos suficientes`, "alert");
				return;
			}
			if (parseFloat(cantidadOrigen) < parseFloat(cantidadConvertir)) {
				aviso(`El monto debe ser menor a ${cantidadOrigen}`, "alert");
				return;
			}

			/* Si no existe en la wallet la agrego con valor "0" */
			console.log(currenciesList.indexOf(cryptoNameDestino));
			if (currenciesList.indexOf(cryptoNameDestino) == "-1") {
				for (let i = 0; i < cuentas.length; i++) {
					if (cuentas[i].usuario == usuarioActivo) {
						cuentas[i].wallet[cryptoNameDestino] = "0";
						console.log(cuentas);
						break;
					}
				}
			}

			/* Realizo los calculos de la conversión */
			console.log(cryptoOrigenUSD);
			console.log(cryptoDestinoUSD);
			resultadoOrigen = cantidadOrigen - cantidadConvertir;
			let dolaresEnviar = (cantidadConvertir * cryptoOrigenCotizacion);
			let dolaresTotal = parseFloat(cryptoDestinoUSD) + parseFloat(dolaresEnviar);
			resultadoDestino = (dolaresTotal / cryptoDestinoCotizacion);
			console.log(resultadoOrigen);
			console.log(resultadoDestino);


			/* Guardo los valores en LocalStorage */
			console.log(cuentas);
			for (let i = 0; i < cuentas.length; i++) {
				if (cuentas[i].usuario == usuarioActivo) {
					cuentas[i].wallet[cryptoNameDestino] = `${resultadoDestino}`;
					cuentas[i].wallet[cryptoNameOrigen] = `${resultadoOrigen}`;
					break;
				}
			}
			localStorage.setItem("cuentas", JSON.stringify(cuentas));

			/* Aplico los valores en pantalla */
			$("#cryptoSelect2").trigger("change");
			$("#cryptoSelect").trigger("change");

		}
		// Actualizo la lista de criptomonedas disponibles
		listaCryptoWallet();
	});

});

/* ########################## Funciones ############################### */

// Funcion para crear lista de criptomonedas disponibles
function listaCryptoWallet() {
	currenciesList = [];
	for (const user of cuentas) {
		if (user.usuario == usuarioActivo) {
			for (const moneda in user.wallet) {
				currenciesList.push(moneda);

			}
			currenciesList.sort();
			let seleccion = $("#cryptoSelect");
			seleccion.empty();
			for (let coin of currenciesList) {
				let opcion = document.createElement("option");
				opcion.value = coin;
				opcion.text = coin;
				seleccion.append(opcion);
			}
			$("#cryptoSelect option[value='BTC']").attr("selected", "selected");
			$("#cryptoSelect").trigger("change");
		}
	}
}

// Funcion para crear aviso
function aviso(mensaje, tipo) {
	if (tipo == "alert") {
		$("#formulario").append(`
	<div class="avisos alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3" role="alert">
		  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
			    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
		  </svg>
		  <div>
		    ${mensaje}
		  </div>
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div>
	`)
	} else {
		$("#formulario").append(`
	<div class="avisos alert alert-primary d-flex align-items-center mt-3" role="alert">
		  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
			    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
		  </svg>
		  <div>
		    ${mensaje}
		  </div>
	</div>
	`)
	}
}

// Funcion para quitar avisos
function quitarAviso() {
	$(".avisos").remove();
}