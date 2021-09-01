/* El siguiente programa simula una inversión en criptomonedas comenzando con una cantidad
de dinero en dolares a invertir y un valor inicial de la criptomoneda
Una vez ingresados los valores anteriores se va a solicitar la actualización del valor
de la criptomoneda en dolares, dependiendo de la variación del precio de la criptomoneda se realiza
la finalización de la operación ya sea porque sobrepasó el limite de ganancia (take profit)
o porque descendió por debajo del limite de pérdida (stop loss)
*/

/* ################### Definición de los Clases ###################### */
class Crypto {
	constructor(nombre, precio) {
		this.nombre = nombre;
		this.cantidad = 0;
		this.precio = [parseInt(precio)];
	}
	// permite actualizar el precio de la crypto
	actualizar(precioNuevo) {
		this.precio.push(parseInt(precioNuevo));
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
		return this.precio[this.precio.length - 1] * this.cantidad;
	}
	// agrega más cantidad de crypto por medio de ingresar la cantidad dinero a comprar
	comprar(masDinero) {
		this.cantidad = this.cantidad + (parseInt(masDinero) / this.precio[this.precio.length - 1])
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
		this.dineroInvertido = parseInt(dineroInvertido);
		this.takeProfit = parseInt(takeProfit);
		this.stopLoss = parseInt(stopLoss);
		this.fechaHora = `${fechaHora.toDateString()} - ${(fechaHora.getHours() < 10 ? '0' : '') + fechaHora.getHours()}:${(fechaHora.getMinutes() < 10 ? '0' : '') + fechaHora.getMinutes()}:${(fechaHora.getSeconds() < 10 ? '0' : '') + fechaHora.getSeconds()}`;
		this.fechaHoraFin = "";
		this.crypto = crypto;
		this.nombre = crypto.nombre;
		this.precioInicial = crypto.precioActual();
		this.dineroTotal = parseInt(dineroInvertido);
		this.finalizada = false;
		this.saldoPorcentaje = 0;
		this.saldoPositivo = false;
		this.estado = "Indefinido"
	}
	// finalizar la inversión
	finalizar() {
		this.dineroTotal = this.crypto.vender();
		this.finalizada = true;
		this.saldoPorcentaje = ((this.dineroTotal - this.dineroInvertido) * 100) / this.dineroInvertido;
		if (this.dineroTotal > this.dineroInvertido) {
			this.saldoPositivo = true;
		}
		let final = new Date();
		this.fechaHoraFin = `${final.toDateString()} - ${(final.getHours() < 10 ? '0' : '') + final.getHours()}:${(final.getMinutes() < 10 ? '0' : '') + final.getMinutes()}:${(final.getSeconds() < 10 ? '0' : '') + final.getSeconds()}`;
		this.estado = "Finalizado";
	}
	cancelar() {
		this.dineroTotal = this.crypto.vender();
		this.finalizada = true;
		this.saldoPorcentaje = ((this.dineroTotal - this.dineroInvertido) * 100) / this.dineroInvertido;
		if (this.dineroTotal > this.dineroInvertido) {
			this.saldoPositivo = true;
		}
		let final = new Date();
		this.fechaHoraFin = `${final.toDateString()} - ${(final.getHours() < 10 ? '0' : '') + final.getHours()}:${(final.getMinutes() < 10 ? '0' : '') + final.getMinutes()}:${(final.getSeconds() < 10 ? '0' : '') + final.getSeconds()}`;
		this.estado = "Cancelado";
	}

}

/* ################### Bloque del programa ###################### */

const listaOperaciones = [];
let precioActualizado = 0;
let cryptoName;
let dineroInvertido;
let takeProfit;
let stopLoss;
let precioInicial;
let criptomoneda;
let fechaHora;
let operacion;
bloquearBoton("botonActualizaInput");
bloquearBoton("botonCancelar");
bloquearBoton("precioActual");

/* ################### Boton Invertir ###################### */
let bontonInvertir = document.getElementById("botonInvertir");
bontonInvertir.addEventListener("click", invertir);

function invertir() {
	quitarAviso();
	datosOperacion();
	precioActualizado = precioInicial;
	aviso("Operación en curso")
	visualizarDatos("Compra:", `${criptomoneda.cantidad} ${cryptoName}`);
	operar();
	guardar();
	bontonInvertir.disabled = true;
	desbloquearBoton("botonActualizaInput");
	desbloquearBoton("botonCancelar");
	desbloquearBoton("precioActual");
}
/* ################### Fin Boton Invertir ###################### */

/* ################### Boton Actualizar ###################### */
let botonActualizaInput = document.getElementById("botonActualizaInput");
botonActualizaInput.addEventListener("click", actualizar);

function actualizar() {
	if (operacion.finalizada == false) {
		let precioActual = document.getElementById("precioActual");
		precioActualizado = precioActual.value;
		operar();
		guardar();
	}
}
/* ################### Fin Boton Actualizar ###################### */

/* ################### Boton Cancelar ###################### */
let botonCancelar = document.getElementById("botonCancelar");
botonCancelar.addEventListener("click", cancelar);

function cancelar() {
	if (operacion.finalizada == false) {
		operacion.cancelar();
		aviso("Operacion Cancelada!!!","alert");
		guardar();
		reiniciarForm();
	}
}
/* ################### Fin Boton Cancelar ###################### */

function datosOperacion() {

	/* ################### Lectura de Datos ###################### */
	cryptoName = document.getElementById("cryptoSelect").value;
	dineroInvertido = document.getElementById("dineroInput").value;
	takeProfit = document.getElementById("takeProfitInput").value;
	stopLoss = document.getElementById("stopLossInput").value;
	precioInicial = document.getElementById("precioInput").value;
	/* ################### Fin Lectura de Datos ###################### */

	let valoresNumericos = [dineroInvertido, takeProfit, stopLoss, precioInicial];

	for (const x of valoresNumericos) {
		let text;
		if (isNaN(x) || x < 1 || x > 10) {
			text = "Input not valid";
		} else {
			text = "Input OK";
		}
	}
	criptomoneda = new Crypto(cryptoName, precioInicial);
	criptomoneda.comprar(dineroInvertido);

	fechaHora = new Date();
	operacion = new Inversion(dineroInvertido, takeProfit, stopLoss, fechaHora, criptomoneda);
}

function operar() {
	if (precioActualizado == "ESC") {
		operacion.cancelar();
		alert("operacion cancelada");
	} else {
		let precioNuevo = parseInt(precioActualizado);
		criptomoneda.actualizar(precioNuevo);
		let cambioPrecio = criptomoneda.porcentajeCambio();
		if (((precioNuevo > precioInicial) && (cambioPrecio >= takeProfit)) || ((precioNuevo < precioInicial) && (cambioPrecio >= stopLoss))) {
			operacion.finalizar();
			reiniciarForm();
		}
	}
}

function guardar() {

	if (operacion.finalizada == true) {

		// Agrego la operación al historial
		listaOperaciones.push(operacion);

		// Reporto el resultado
		if (operacion.dineroTotal < operacion.dineroInvertido && operacion.estado != "Cancelado") {
			visualizarDatos("Alcanzó el Stop Loss", `Dinero total: $${operacion.dineroTotal}`);
		} else if (operacion.dineroTotal > operacion.dineroInvertido && operacion.estado != "Cancelado") {
			visualizarDatos("Alcanzó el Take Profit", `Dinero total: $${operacion.dineroTotal}`);
		} else {
			visualizarDatos("La operación fue cancelada", `Dinero total: $${operacion.dineroTotal}`);
		}

		// Muestro en consola las operaciones realizadas
		console.log("Operaciones realizadas en la presente sesión:");
		for (const elemento of listaOperaciones) {
			console.log(elemento);
		}

		// Ordeno de mayor a menor segun el porcentaje de ganancias
		let listaOrdenada = listaOperaciones.sort((a, b) => b.saldoPorcentaje - a.saldoPorcentaje);

		// Muestro en consola las operaciones Ordenadas
		console.log("Operaciones realizadas en la presente sesión ordenadas segun porcentaje de ganancias:");
		for (const elemento of listaOperaciones) {
			console.log(elemento);
		}

		// Almaceno la lista de operaciones, concatenandola en caso de que ya haya sido creada anteriormente
		if (localStorage.getItem("historial") === null) {
			localStorage.setItem("historial", JSON.stringify(listaOperaciones));
		} else {
			const listaOld = JSON.parse(localStorage.getItem("historial"));
			localStorage.setItem("historial", JSON.stringify(listaOld.concat(listaOperaciones)));
		}

		/* ################### Muestro por consola el historial de operaciones ordenado de mayor a menor segun el porcentaje de ganancias ###################### */
		const listaOperacionesHistorica = JSON.parse(localStorage.getItem("historial"));
		const listaHistoricaOrdenada = listaOperacionesHistorica.sort((a, b) => b.saldoPorcentaje - a.saldoPorcentaje);
		console.log("Lista historica Ordenada de mayor a menor segun el porcentaje de ganancias");
		for (const item of listaHistoricaOrdenada) {
			console.log("Porcentaje de ganancia: " + item.saldoPorcentaje + " | Fecha y hora de operacion: " + item.fechaHora);
			console.log(item);
		}
	}
};

function bloquearBoton(botonId) {
	document.getElementById(botonId).disabled = true;
}

function desbloquearBoton(botonId) {
	document.getElementById(botonId).disabled = false;
}

function reiniciarForm() {
	document.getElementById("formulario").reset();
	document.getElementById("botonInvertir").disabled = false;
	document.getElementById("botonCancelar").disabled = true;
	document.getElementById("botonActualizaInput").disabled = true;
	document.getElementById("precioActual").disabled = true;
	quitarAviso();
}

function aviso(mensaje, tipo) {
	if (tipo == "alert") {
		$("#formulario").append(`
		<div id="aviso" class="alert alert-danger d-flex align-items-center mt-3" role="alert">
 	 		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
 	  	 		<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
 	 		</svg>
		  	<div>
		   	 ${mensaje}
		  	</div>
		</div>
		`)
	} else {
		$("#formulario").append(`
		<div id="aviso" class="alert alert-primary d-flex align-items-center mt-3" role="alert">
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
	$("#aviso").remove();
}

function visualizarDatos(titulo, datos) {
	$("#datos").remove();
	$("#formulario").append(`<div id="datos" class="card text-dark bg-light my-3 w-100">
	<div class="card-header">${titulo}</div>
	<div class="card-body">
	  <p class="card-text">${datos}
		</p>
	</div>
      </div>`)
}