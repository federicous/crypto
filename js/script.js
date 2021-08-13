/* El siguiente programa simula una inversión en criptomonedas comenzando con una cantidad
de dinero en dolares a invertir y un valor inicial de la criptomoneda
Una vez ingresados los valores anteriores se va a solicitar la actualización del valor
de la criptomoneda en dolares, dependiendo de la variación del precio de la criptomoneda se realiza
la finalización de la operación ya sea porque sobrepasó el limite de ganancia (take profit)
o porque descendió por debajo del limite de pérdida (stop loss), estos limites estan previamente
fijados como valores constantes
*/

class Crypto {
	constructor(nombre,precio){
		this.nombre=nombre;
		this.cantidad=0;
		this.precio=[parseInt(precio)];
	}
	// permite actualizar el precio de la crypto
	actualizar(precioNuevo){
		this.precio.push(parseInt(precioNuevo));
	}
	// devuelve el ultimo precio actualizado
	precioActual(){
		return this.precio[precio.length-1];
	}
	// devuelve el precio inicial
	precioInicial(){
		return this.precio[0];
	}
	// retorna el dinero en dolares de la venta del total de las crypto
	vender(){
		return this.precio[precio.length-1]*this.cantidad;
	}
	// agrega más cantidad de crypto por medio de ingresar la cantidad dinero a comprar
	comprar(masDinero){
		this.cantidad=this.cantidad+(parseInt(masDinero)/this.precio[this.precio.length-1])
	}
	// muestra en consola los valores que fue teniendo la crypto
	historial(){
		console.log(this.precio);
	}
	// muestra la cantidad de crypto en consola
	verCantidad(){
		console.log(this.cantidad);
	}
	porcentajeCambio(precioAnterior, precioNuevo) {
		return Math.abs(((this.precio[precio.length-1] * 100) / this.precio[0]) - 100);
	}
}

class Inversion {
	constructor(dineroInvertido,takeProfit,stopLoss,fechaHora,crypto) {
		this.dineroInvertido= parseInt(dineroInvertido);
		this.takeProfit= parseInt(takeProfit);
		this.stopLoss= parseInt(stopLoss);
		this.fechaHora= fechaHora;
		this.nombre=crypto.nombre;
		this.precioInicial=crypto.precioActual();
		this.dineroTotal=parseInt(dineroInvertido);
		this.finalizada= false;
	}
	// finalizar la inversión
	finalizar(){
		this.dineroTotal= crypto.vender();
		this.finalizada= true;
	}

	// finalizar(cantidadCryto,precioCrypto){
	// 	this.dineroTotal=cantidadCryto*precioCrypto;
	// }
	// precio(precioNuevo){
	// 	this.precio=precioNuevo;
	// }
	// resultado(){
	// 	this.dineroTotal=this.precio;
	// }
}

/* ################### Ingreso de Datos ###################### */

// let billetera = parseInt(prompt("Ingrese la cantidad de criptomonedas disponible en su billetera"));
let cryptoName = prompt("ingrese el nombre de la Criptomoneda a operar");
let dineroInvertido = parseInt(prompt("Ingrese la cantidad de dinero en dolares a invertir"));
let precioInicial = parseInt(prompt("ingrese el precio actual en dolares de la criptomoneda"));

// Porcentaje de aumento de precio para realizar una venta y obtener ganancia
let takeProfit =  parseInt(prompt("Ingrese el porcentaje de ganancia en el que finaliza la operación"));
// Porcentaje de baja de precio para realizar una venta y dejar de perder dinero
let stopLoss =  parseInt(prompt("Ingrese el porcentaje de pérdida en el que finaliza la operación"));

/* ################### Fin Ingreso de Datos ###################### */

/* ################### Bloque del programa ###################### */

const criptomoneda= new Crypto(cryptoName,precioInicial);
criptomoneda.comprar(dineroInvertido);

alert("Datos de la operación:\nCriptomoneda:" + cryptoName + " (" + criptomoneda.cantidad + ")" + "\nDinero invertido:"+ dineroInvertido + "\nPrecio inicial:" + precioInicial + "\nTake Profit= " + takeProfit + "% \nStop Loss= " + stopLoss + "%")

const operacion= new Inversion(dineroInvertido,takeProfit,stopLoss,Date.now,criptomoneda);


/* function comprar(dinero, precio) {
	let resultado = dinero / precio;
	return resultado;
}

function vender(crypto, precio) {
	let resultado = crypto * precio;
	return resultado;
}
 */
/* function porcentajeCambio(precioAnterior, precioNuevo) {
	return Math.abs(((precioNuevo * 100) / precioAnterior) - 100);
}

let criptoComprada = comprar(dineroInvertido, precioInicial);
// billetera = billetera + criptoComprada;
let dineroTotal = 0;
// Loop para actualizar el precio de la criptomoneda
while (true) {
	let precioActualizado = prompt("ingrese el nuevo precio, o bien ESC para finalizar la operación");
	if (precioActualizado == "ESC") {
		break;
	} else {
		let precioNuevo = parseInt(precioActualizado);
		let cambioPrecio = porcentajeCambio(precioInicial, precioNuevo);
		if (((precioNuevo > precioInicial) && (cambioPrecio >= takeProfit)) || ((precioNuevo < precioInicial) && (cambioPrecio >= stopLoss))) {
			dineroTotal = vender(criptoComprada, precioNuevo);
			break;
		}
	}
}
if (dineroTotal < dineroInvertido) {
	alert("La operación finalizó por alcanzar el Stop Loss \n Dinero disponible en dolares: " + dineroTotal);
} else if (dineroTotal>dineroInvertido){
	alert("La operación finalizó por alcanzar el Take Profit \n Dinero disponible en dolares: " + dineroTotal);
}else {
	alert("La operación fue cancelada  \n Dinero disponible en dolares: " + dineroTotal);
} */