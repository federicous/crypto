/* El siguiente programa simula una inversión en criptomonedas
dependiendo de la variación del precio de la criptomoneda se realiza
la finalización de la operación ya sea porque sobrepasó el limite de ganancia
o porque descendió por debajo del limite de pérdida
*/

// let billetera = parseInt(prompt("Ingrese la cantidad de criptomonedas disponible en su billetera"));
let dineroInvertido = parseInt(prompt("Ingrese la cantidad de dinero en dolares a invertir"));
let precioInicial = parseInt(prompt("ingrese el precio actual en dolares de la criptomoneda"));

// Porcentaje de aumento de precio para realizar una venta y obtener ganancia
let takeProfit = 30;
// Porcentaje de baja de precio para realizar una venta y dejar de perder dinero
let stopLoss = 5;

function compra(dinero, precio) {
	let resultado = dinero / precio;
	return resultado;
}

/* function vender(dinero, precio, billetera) {
	let resultado = dinero/precio;
	return billetera-resultado;	
}
 */
function porcentajeCambio(precioAnterior, precioNuevo) {
	return (precioNuevo * 100) / precioAnterior;
}

let criptoComprada = compra(dineroInvertido, precioInicial);
// billetera = billetera + criptoComprada;
let dineroTotal=0;
// Loop para actualizar el precio de la criptomoneda
while (true) {
	let precioActualizado = prompt("ingrese el nuevo precio, o bien ESC para finalizar la operación");
	if (precioActualizado == "ESC") {
		break;
	} else {
		let precioNuevo = parseInt(precioActualizado);
		let cambioPrecio = porcentajeCambio(precioInicial, precioNuevo);
		if (((precioNuevo > precioInicial) && (cambioPrecio >= takeProfit)) || ((precioNuevo < precioInicial) && (cambioPrecio >= stopLoss))) {
			dineroTotal = compra(criptoComprada, precioNuevo);
			break;
		} 
	}
}
prompt("Dinero disponible en dolares: " + dineroTotal)