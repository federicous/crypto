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
	}

}

/* ################### Bloque del programa ###################### */

const listaOperaciones = [];

let bontonInvertir = document.getElementById("botonInvertir");

bontonInvertir.addEventListener("click", function () {

	/* ################### Lectura de Datos ###################### */
	let cryptoName = document.getElementById("cryptoSelect").value;
	let dineroInvertido = document.getElementById("dineroInput").value;
	let takeProfit = document.getElementById("takeProfitInput").value;
	let stopLoss = document.getElementById("stopLossInput").value;
	let precioInicial = document.getElementById("precioInput").value;
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

	/* ################### Escuchar finalización ###################### */
	// let botonFinalizar = document.getElementById("botonFinalizar");
	// botonFinalizar.onclick = () => {
	// 	return break
	// };
	/* ################### Fin Escuchar finalización ###################### */


	const criptomoneda = new Crypto(cryptoName, precioInicial);
	criptomoneda.comprar(dineroInvertido);

	alert("Datos de la operación:\nCriptomoneda:" + cryptoName + " (" + criptomoneda.cantidad + ")" + "\nDinero invertido:" + dineroInvertido + "\nPrecio inicial:" + precioInicial + "\nTake Profit= " + takeProfit + "% \nStop Loss= " + stopLoss + "%")
	const fechaHora = new Date();
	const operacion = new Inversion(dineroInvertido, takeProfit, stopLoss, fechaHora, criptomoneda);

	/* ################### Bucle de actualización de precio ###################### */
	
	while (true) {
		let precioActualizado = prompt("ingrese el nuevo precio, o bien ESC para finalizar la operación");
		if (precioActualizado == "ESC") {
			break;
		} else {
			let precioNuevo = parseInt(precioActualizado);
			criptomoneda.actualizar(precioNuevo);
			let cambioPrecio = criptomoneda.porcentajeCambio();
			if (((precioNuevo > precioInicial) && (cambioPrecio >= takeProfit)) || ((precioNuevo < precioInicial) && (cambioPrecio >= stopLoss))) {
				operacion.finalizar();
				break;
			}
		}

	}
	/* ################### Fin Bucle de actualización de precio ###################### */

	// Agrego la operación al historial
	listaOperaciones.push(operacion);

	// Reporto el resultado
	if (operacion.dineroTotal < operacion.dineroInvertido) {
		alert("La operación finalizó por alcanzar el Stop Loss \n Dinero disponible en dolares: " + operacion.dineroTotal);
	} else if (operacion.dineroTotal > operacion.dineroInvertido) {
		alert("La operación finalizó por alcanzar el Take Profit \n Dinero disponible en dolares: " + operacion.dineroTotal);
	} else {
		alert("La operación fue cancelada  \n Dinero disponible en dolares: " + operacion.dineroTotal);
	}

	// Presento la opción de seguir operando o de finalizar
	// let continuar = prompt("Nueva operación, ingrese ESC para cancelar o click en aceptar para seguir");
	// let continuar = document.getElementById("boton");
	// if (continuar == "ESC") {
	// 	break;
	// }

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

	/* ################### Muestro historial de operaciones ordenado de mayor a menor segun el porcentaje de ganancias ###################### */
	const listaOperacionesHistorica = JSON.parse(localStorage.getItem("historial"));
	const listaHistoricaOrdenada = listaOperacionesHistorica.sort((a, b) => b.saldoPorcentaje - a.saldoPorcentaje);
	console.log("Lista historica Ordenada de mayor a menor segun el porcentaje de ganancias");
	for (const item of listaHistoricaOrdenada) {
		console.log("Porcentaje de ganancia: " + item.saldoPorcentaje + " | Fecha y hora de operacion: " + item.fechaHora);
		console.log(item);
	}

});