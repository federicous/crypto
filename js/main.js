/* El siguiente programa simula una inversión en criptomonedas comenzando con una cantidad
de dinero en dolares a invertir, un valor inicial de la criptomoneda, el Stop Loss y el Take Profit
Una vez ingresados los valores anteriores se va a ir actualizando periodicamente del valor
de la criptomoneda en dolares de forma automática, y dependiendo de la variación del precio de 
la criptomoneda se realiza la finalización de la operación ya sea porque sobrepasó el limite 
de ganancia (take profit) o porque descendió por debajo del limite de pérdida (stop loss)
*/

/* ################### Definición de los Clases ###################### */
class Crypto {
	constructor(nombre, precio) {
		this.nombre = nombre;
		this.cantidad = 0;
		this.precio = [parseFloat(precio)];
	}
	// permite actualizar el precio de la crypto
	actualizar(precioNuevo) {
		this.precio.push(parseFloat(precioNuevo));
	}
	// devuelve el ultimo precio actualizado
	precioActual() {
		return this.precio[this.precio.length - 1];
	}
	// devuelve el precio inicial
	precioInicial() {
		return this.precio[0];
	}
	// retorna el dinero en dolares de la venta del total de las crypto
	vender() {
		return (this.precio[this.precio.length - 1] * this.cantidad);
	}
	// agrega más cantidad de crypto por medio de ingresar la cantidad dinero a comprar
	comprar(masDinero) {
		this.cantidad = this.cantidad + (parseFloat(masDinero) / this.precio[this.precio.length - 1])
	}
	// muestra en consola los valores que fue teniendo la crypto
	historial() {
		console.log(this.precio);
	}
	// muestra la cantidad de crypto en consola
	verCantidad() {
		console.log(this.cantidad);
	}
	porcentajeCambio() {
		return Math.abs(((this.precio[this.precio.length - 1] * 100) / this.precio[0]) - 100);
	}
}

class Inversion {
	constructor(dineroInvertido, takeProfit, stopLoss, fechaHora, crypto) {
		this.dineroInvertido = parseFloat(dineroInvertido);
		this.takeProfit = parseFloat(takeProfit);
		this.stopLoss = parseFloat(stopLoss);
		this.fechaHora = `${fechaHora.toDateString()} - ${(fechaHora.getHours() < 10 ? '0' : '') + fechaHora.getHours()}:${(fechaHora.getMinutes() < 10 ? '0' : '') + fechaHora.getMinutes()}:${(fechaHora.getSeconds() < 10 ? '0' : '') + fechaHora.getSeconds()}`;
		this.fechaHoraFin = "";
		this.crypto = crypto;
		this.nombre = crypto.nombre;
		this.precioInicial = crypto.precioActual();
		this.dineroTotal = parseFloat(dineroInvertido);
		this.finalizada = false;
		this.saldoPorcentaje = 0;
		this.saldoPositivo = false;
		this.estado = "Indefinido"
	}
	// finalizar la inversión
	finalizar() {
		this.dineroTotal = Number((this.crypto.vender()).toFixed(2));
		this.finalizada = true;
		this.saldoPorcentaje = Number((((this.dineroTotal - this.dineroInvertido) * 100) / this.dineroInvertido).toFixed(4));
		if (this.dineroTotal > this.dineroInvertido) {
			this.saldoPositivo = true;
		}
		let final = new Date();
		this.fechaHoraFin = `${final.toDateString()} - ${(final.getHours() < 10 ? '0' : '') + final.getHours()}:${(final.getMinutes() < 10 ? '0' : '') + final.getMinutes()}:${(final.getSeconds() < 10 ? '0' : '') + final.getSeconds()}`;
		this.estado = "Finalizado";
	}
	cancelar() {
		this.dineroTotal = Number((this.crypto.vender()).toFixed(2));
		this.finalizada = true;
		this.saldoPorcentaje = Number((((this.dineroTotal - this.dineroInvertido) * 100) / this.dineroInvertido).toFixed(4));
		if (this.dineroTotal > this.dineroInvertido) {
			this.saldoPositivo = true;
		}
		let final = new Date();
		this.fechaHoraFin = `${final.toDateString()} - ${(final.getHours() < 10 ? '0' : '') + final.getHours()}:${(final.getMinutes() < 10 ? '0' : '') + final.getMinutes()}:${(final.getSeconds() < 10 ? '0' : '') + final.getSeconds()}`;
		this.estado = "Cancelado";
	}
	enCurso() {
		this.estado = "enCurso";
	}

}

/* ######## Variables y valores por defecto ######## */
let precioActualizado = 0;
let cryptoName;
let dineroInvertido;
let takeProfit;
let stopLoss;
let precioInicial;
let criptomoneda;
let fechaHora;
let operacion;
let contadorActualizaciones;
let URLGET;
let cuentas;
let usuarioActivo;
let dineroDisponible;

/* ##################### BLOQUE DEL PROGRAMA ###################### */

/* Lectura de los datos de las cuentas */
cuentas = JSON.parse(localStorage.getItem("cuentas"));

/* Cargo el usuario activo */
usuarioActivo = JSON.parse(localStorage.getItem("usuario"));

$(document).ready(function () {

	bloquearBoton("#botonCancelar");
	mostrarDineroDisponible();

	/* ############## Obtener precio periodicamente con la API ################# */
	$("#cryptoSelect").change(() => {
		cryptoName = $("#cryptoSelect").val();
		$(".unidades").text(cryptoName);
		URLGET = `https://api.coinbase.com/v2/prices/${cryptoName}-USD/buy`
	});

	setInterval(() => {
		$.get(URLGET, function (respuesta, estado) {
			if (estado === "success") {
				$("#precioInput").attr("value", respuesta.data.amount);
				$("#precioInput").trigger("change");
			}
		});
	}, 5000);

	$("#precioInput").change(() => {
		if (((operacion != null) && operacion.finalizada == false) && (operacion.estado == "enCurso")) {
			quitarAviso();
			precioActualizado = parseFloat($("#precioInput").val());
			contadorActualizaciones += 1;
			aviso(`Actualización de precio - Nº ${contadorActualizaciones}`);
			operarNumerico();
			guardar();
		}
	});
	/* ############## Fin Obtener precio periodicamente con la API ################# */

	/* ################### Boton Invertir ###################### */
	$("#botonInvertir").click(function invertir() {
		quitarAviso();
		ocultarDatos();
		if (validacionNumerico()) {
			datosOperacion();
			precioActualizado = precioInicial;
			let historialInversiones = JSON.parse(localStorage.getItem("historial"));
			if (historialInversiones != null) {
				aviso(`Operación en curso Nº ${historialInversiones.length+1}`);
			} else {
				aviso(`Operación en curso Nº 1`);
			}
			visualizarDatos("Compra realizada:", `${criptomoneda.cantidad} ${cryptoName}`);
			operacion.enCurso();
			operarNumerico();
			guardar();
			$(this).attr("disabled", "true");
			desbloquearBoton("#botonCancelar");
			contadorActualizaciones = 0;
		}
	});
	/* ################### Fin Boton Invertir ###################### */

	/* ################### Boton Cancelar ###################### */
	$("#botonCancelar").click(function cancelar() {
		if (operacion.finalizada == false) {
			operacion.cancelar();
			reiniciarForm();
			guardar();
		}
	});
	/* ################### Fin Boton Cancelar ###################### */

	/* ################### FUNCIONES ###################### */

	/* ################### Muestro dinero disponible ###################### */
	function mostrarDineroDisponible() {
		quitarAviso();
		for (let i = 0; i < cuentas.length; i++) {
			if (cuentas[i].usuario == usuarioActivo) {
				dineroDisponible = cuentas[i].dolares;
				console.log(dineroDisponible);
				break;
			}
		}
		aviso(`Dinero disponible: ${dineroDisponible} USD`);
	}
	/* ################### Fin Muestro dinero disponible ###################### */

	function datosOperacion() {
		/* ################### Lectura de Datos ###################### */
		cryptoName = $("#cryptoSelect").val();
		dineroInvertido = parseFloat($("#dineroInput").val());
		takeProfit = parseFloat($("#takeProfitInput").val());
		stopLoss = parseFloat($("#stopLossInput").val());
		precioInicial = parseFloat($("#precioInput").val());
		/* ################### Fin Lectura de Datos ###################### */

		criptomoneda = new Crypto(cryptoName, precioInicial);
		criptomoneda.comprar(dineroInvertido);
		fechaHora = new Date();
		operacion = new Inversion(dineroInvertido, takeProfit, stopLoss, fechaHora, criptomoneda);
	}

	function validacion() {
		cryptoName = $("#cryptoSelect");
		dineroInvertido = $("#dineroInput");
		takeProfit = $("#takeProfitInput");
		stopLoss = $("#stopLossInput");
		precioInicial = $("#precioInput");
		let valoresNumericos = [precioInicial, dineroInvertido, takeProfit, stopLoss];
		quitarAviso();
		let contador = 0;
		for (const x of valoresNumericos) {
			if (isNaN(x.val()) || (x.val() < 0) || x.val() == "") {
				aviso(`${x.attr("name")} No válido!!`, "alert");
				contador += 1;
			}
		}
		if (contador != 0) {
			return false;
		}
		return true;
	}

	function validacionNumerico() {
		cryptoName = $("#cryptoSelect");
		dineroInvertido = $("#dineroInput");
		takeProfit = $("#takeProfitInput");
		stopLoss = $("#stopLossInput");
		precioInicial = $("#precioInput");
		let valoresNumericos = [precioInicial, dineroInvertido, takeProfit, stopLoss];
		quitarAviso();
		if (parseFloat(dineroInvertido.val()) > parseFloat()) {

		}
		let contador = 0;
		for (const x of valoresNumericos) {
			if (isNaN(x.val()) || (x.val() < 0) || x.val() == "") {
				aviso(`${x.attr("name")} No válido!!`, "alert");
				contador += 1;
			}
		}
		if (isFinite(parseFloat(takeProfit.val())) && (parseFloat(takeProfit.val()) <= parseFloat(precioInicial.val()))) {
			aviso(`Take Profit debe ser mayor al precio de compra (${precioInicial.val()})`, "alert");
			contador += 1;
		}
		if (isFinite(parseFloat(stopLoss.val())) && (parseFloat(stopLoss.val()) >= parseFloat(precioInicial.val()))) {
			aviso(`Stop Loss debe ser menor al precio de compra (${precioInicial.val()})`, "alert");
			contador += 1;
		}
		if (contador != 0) {
			return false;
		}
		return true;
	}

	function operar() {
		let precioNuevo = parseFloat(precioActualizado);
		criptomoneda.actualizar(precioNuevo);
		let cambioPrecio = criptomoneda.porcentajeCambio();
		if (((precioNuevo > precioInicial) && (cambioPrecio >= takeProfit)) || ((precioNuevo < precioInicial) && (cambioPrecio >= stopLoss))) {
			operacion.finalizar();
			reiniciarForm();
		}
	}

	function operarNumerico() {
		criptomoneda.actualizar(precioActualizado);
		if ((precioActualizado >= takeProfit) || (precioActualizado <= stopLoss)) {
			operacion.finalizar();
			reiniciarForm();
		}
	}

	function guardar() {

		if (operacion.finalizada == true) {

			// Reporto el resultado
			if (operacion.dineroTotal < operacion.dineroInvertido && operacion.estado != "Cancelado") {
				aviso("Operacion Finalizada!!!");
				visualizarDatos("Alcanzó el Stop Loss", `Dinero total: $${operacion.dineroTotal}`);
			} else if (operacion.dineroTotal > operacion.dineroInvertido && operacion.estado != "Cancelado") {
				aviso("Operacion Finalizada!!!");
				visualizarDatos("Alcanzó el Take Profit", `Dinero total: $${operacion.dineroTotal}`);
			} else {
				aviso("Operacion Cancelada!!!", "alert");
				visualizarDatos("La operación fue cancelada", `Dinero total: $${operacion.dineroTotal}`);
			}


			// Almaceno la lista de operaciones, concatenandola en caso de que ya haya sido creada anteriormente
			if (localStorage.getItem("historial") === null) {
				localStorage.setItem("historial", JSON.stringify([operacion]));
			} else {
				const listaOld = JSON.parse(localStorage.getItem("historial"));
				localStorage.setItem("historial", JSON.stringify(listaOld.concat([operacion])));
			}
			for (let i = 0; i < cuentas.length; i++) {
				if (cuentas[i].usuario == usuarioActivo) {
					cuentas[i].historial.push(operacion)
					break;
				}
			}
			localStorage.setItem("cuentas", JSON.stringify(cuentas));
			console.log(cuentas);
		}
	};

	function bloquearBoton(botonId) {
		$(botonId).attr("disabled", "true");
	}

	function desbloquearBoton(botonId) {
		$(botonId).removeAttr("disabled");
	}

	function reiniciarForm() {
		$("#formulario").trigger("reset");
		$("#botonInvertir").removeAttr("disabled");
		$("#botonCancelar").attr("disabled", "true");
		quitarAviso();
		$("#cryptoSelect").trigger("change");
	}

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

	function quitarAviso() {
		$(".avisos").remove();
	}

	function visualizarDatos(titulo, datos) {
		$(".datos").remove();
		$("#zonaDatos").append(`<div class="datos card text-dark bg-light my-3 w-100">
	<div class="card-header">${titulo}</div>
	<div class="card-body">
	  <p class="card-text">${datos}
		</p>
	</div>
      </div>`)
	}

	function ocultarDatos() {
		$(".datos").remove();
	}

});