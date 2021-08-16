/* El siguiente programa simula una inversión en criptomonedas comenzando con una cantidad
de dinero en dolares a invertir y un valor inicial de la criptomoneda
Una vez ingresados los valores anteriores se va a solicitar la actualización del valor
de la criptomoneda en dolares, dependiendo de la variación del precio de la criptomoneda se realiza
la finalización de la operación ya sea porque sobrepasó el limite de ganancia (take profit)
o porque descendió por debajo del limite de pérdida (stop loss), estos limites estan previamente
fijados como valores constantes
*/

/* ################### Definición de los Objetos ###################### */
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
		return this.precio[this.precio.length-1];
	}
	// devuelve el precio inicial
	precioInicial(){
		return this.precio[0];
	}
	// retorna el dinero en dolares de la venta del total de las crypto
	vender(){
		return this.precio[this.precio.length-1]*this.cantidad;
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
	porcentajeCambio() {
		return Math.abs(((this.precio[this.precio.length-1] * 100) / this.precio[0]) - 100);
	}
}

class Inversion {
	constructor(dineroInvertido,takeProfit,stopLoss,fechaHora,crypto) {
		this.dineroInvertido= parseInt(dineroInvertido);
		this.takeProfit= parseInt(takeProfit);
		this.stopLoss= parseInt(stopLoss);
		this.fechaHora= fechaHora;
		this.crypto=crypto;
		this.nombre=crypto.nombre;
		this.precioInicial=crypto.precioActual();
		this.dineroTotal=parseInt(dineroInvertido);
		this.finalizada= false;
	}
	// finalizar la inversión
	finalizar(){
		this.dineroTotal= this.crypto.vender();
		this.finalizada= true;
	}
}

/* ################### Bloque del programa ###################### */

const listaOperaciones= [];

/* ################### Ingreso de Datos ###################### */

let cryptoName = prompt("ingrese el nombre de la Criptomoneda a operar");
let dineroInvertido = parseInt(prompt("Ingrese la cantidad de dinero en dolares a invertir"));
let precioInicial = parseInt(prompt("ingrese el precio actual en dolares de la criptomoneda"));

// Porcentaje de aumento de precio para realizar una venta y obtener ganancia
let takeProfit =  parseInt(prompt("Ingrese el porcentaje de ganancia en el que finaliza la operación"));
// Porcentaje de baja de precio para realizar una venta y dejar de perder dinero
let stopLoss =  parseInt(prompt("Ingrese el porcentaje de pérdida en el que finaliza la operación"));

/* ################### Fin Ingreso de Datos ###################### */

const criptomoneda= new Crypto(cryptoName,precioInicial);
criptomoneda.comprar(dineroInvertido);

alert("Datos de la operación:\nCriptomoneda:" + cryptoName + " (" + criptomoneda.cantidad + ")" + "\nDinero invertido:"+ dineroInvertido + "\nPrecio inicial:" + precioInicial + "\nTake Profit= " + takeProfit + "% \nStop Loss= " + stopLoss + "%")

const operacion= new Inversion(dineroInvertido,takeProfit,stopLoss,Date.now(),criptomoneda);


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

listaOperaciones.push(operacion);
    
if (operacion.dineroTotal < operacion.dineroInvertido) {
	alert("La operación finalizó por alcanzar el Stop Loss \n Dinero disponible en dolares: " + operacion.dineroTotal);
} else if (operacion.dineroTotal>operacion.dineroInvertido){
	alert("La operación finalizó por alcanzar el Take Profit \n Dinero disponible en dolares: " + operacion.dineroTotal);
}else {
	alert("La operación fue cancelada  \n Dinero disponible en dolares: " + operacion.dineroTotal);
}




