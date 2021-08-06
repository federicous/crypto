/* El siguiente programa simula una inversión en criptomonedas comenzando con una cantidad
de dinero en dolares a invertir y un valor inicial de la criptomoneda
Una vez ingresados los valores anteriores se va a solicitar la actualización del valor
de la criptomoneda en dolares, dependiendo de la variación del precio de la criptomoneda se realiza
la finalización de la operación ya sea porque sobrepasó el limite de ganancia (take profit)
o porque descendió por debajo del limite de pérdida (stop loss), estos limites estan previamente
fijados como valores constantes
*/

// let billetera = parseInt(prompt("Ingrese la cantidad de criptomonedas disponible en su billetera"));
let dineroInvertido = parseInt(prompt("Ingrese la cantidad de dinero en dolares a invertir"));
let precioInicial = parseInt(prompt("ingrese el precio actual en dolares de la criptomoneda"));

// Porcentaje de aumento de precio para realizar una venta y obtener ganancia
let takeProfit = 30;
// Porcentaje de baja de precio para realizar una venta y dejar de perder dinero
let stopLoss = 5;

alert("Los limites que finalizan la operación son los siguientes: \n Take Profit= " + takeProfit + "% \n Stop Loss= " + stopLoss + "%")

function comprar(dinero, precio) {
	let resultado = dinero / precio;
	return resultado;
}

function vender(crypto, precio) {
	let resultado = crypto * precio;
	return resultado;
}

function porcentajeCambio(precioAnterior, precioNuevo) {
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
}