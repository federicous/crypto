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
		this.dineroTotal = Number((this.crypto.vender()).toFixed(7));
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
		this.dineroTotal = Number((this.crypto.vender()).toFixed(7));
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
let dineroResultante;
let historialInversiones;
let valoresNumericos;

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
			historialInversiones = JSON.parse(localStorage.getItem("historial"));
			if (historialInversiones != null) {
				aviso(`Operación en curso Nº ${historialInversiones.length+1}`);
			} else {
				aviso(`Operación en curso Nº 1`);
			}
			visualizarDatos("Compra realizada:", `${Number(criptomoneda.cantidad).toFixed(7)} ${cryptoName}`);
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
				break;
			}
		}
		$("#zonaAvisos").hide();
		aviso(`Dinero disponible: ${dineroDisponible} USD`);
		$("#zonaAvisos").fadeIn(1000);
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

	function validacionNumerico() {
		cryptoName = $("#cryptoSelect");
		dineroInvertido = $("#dineroInput");
		takeProfit = $("#takeProfitInput");
		stopLoss = $("#stopLossInput");
		precioInicial = $("#precioInput");
		valoresNumericos = [precioInicial, dineroInvertido, takeProfit, stopLoss];
		quitarAviso();

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
		if (parseFloat(dineroInvertido.val()) > parseFloat(dineroDisponible)) {
			aviso(`El dinero a invertir debe ser menor a ${dineroDisponible} USD`, "alert");
			return false
		}
		if (parseFloat(dineroInvertido.val()) < 10) {
			aviso(`El dinero a invertir debe ser mayor a 10 USD`, "alert");
			return false
		}
		return true;
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

			dineroResultante = Number(dineroDisponible - dineroInvertido + operacion.dineroTotal).toFixed(2);
			ganancias = Number(operacion.dineroTotal - dineroInvertido).toFixed(2);

			for (let i = 0; i < cuentas.length; i++) {
				if (cuentas[i].usuario == usuarioActivo) {
					cuentas[i].historial.push(operacion);
					cuentas[i].dolares = dineroResultante;
					break;
				}
			}
			localStorage.setItem("cuentas", JSON.stringify(cuentas));

			// Reporto el resultado
			if (operacion.dineroTotal < operacion.dineroInvertido && operacion.estado != "Cancelado") {
				aviso("Operacion Finalizada!!!");
				visualizarDatos("Alcanzó el Stop Loss", `Ganancias: ${ganancias} USD \n
				Dinero total: $${dineroResultante} USD`);
			} else if (operacion.dineroTotal > operacion.dineroInvertido && operacion.estado != "Cancelado") {
				aviso("Operacion Finalizada!!!");
				visualizarDatos("Alcanzó el Take Profit", `Ganancias: ${ganancias} USD \n
				Dinero total: $${dineroResultante} USD`);
			} else {
				aviso("Operacion Cancelada!!!", "alert");
				visualizarDatos("La operación fue cancelada", `Ganancias: ${ganancias} USD \n 
				Dinero total: $${dineroResultante} USD`);
			}

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
			$("#zonaAvisos").hide();
			$("#zonaAvisos").append(`
		<div class="avisos alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3" role="alert">
 	 		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
 	  	 		<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
 	 		</svg>
		  	<div>
		   	 ${mensaje}
		  	</div>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
		`);
			$("#zonaAvisos").fadeIn(1000);
		} else {
			$("#zonaAvisos").append(`
		<div class="avisos alert alert-primary d-flex align-items-center mt-3" role="alert">
 	 		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
 	  	 		<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
 	 		</svg>
		  	<div>
		   	 ${mensaje}
		  	</div>
		</div>
		`);
		}
	}

	function quitarAviso() {
		$(".avisos").remove();
	}

	function visualizarDatos(titulo, datos) {
		$(".datos").remove();
		$("#zonaDatos").hide();
		$("#zonaDatos").append(`<div class="datos card text-dark bg-light my-3 w-100">
						<div class="card-header">${titulo}</div>
						<div class="card-body">
							<p class="card-text">${datos}
							</p>
						</div>
 					</div>`)
		$("#zonaDatos").fadeIn(1000);
	}

	function ocultarDatos() {
		$(".datos").remove();
	}

});