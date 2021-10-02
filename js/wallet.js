/* #################### Genero una tabla con las cantidades de criptomonedas del usuario actual ####################### */
let historialInversiones;
let usuarioActivo;
let dineroDisponible;
/* Lectura de los datos de las cuentas */
cuentas = JSON.parse(localStorage.getItem("cuentas"));

/* Cargo el usuario activo */
usuarioActivo = JSON.parse(localStorage.getItem("usuario"))

let precioMoneda;
let tabla = document.getElementById("tableBody");

for (let i = 0; i < cuentas.length; i++) {
	if (cuentas[i].usuario == usuarioActivo) {
		dineroDisponible=cuentas[i].dolares;
		for (const moneda in cuentas[i].wallet) {
			URLGET = `https://api.coinbase.com/v2/prices/${moneda}-USD/buy`
			$.get(URLGET, function (respuesta, estado) {
				if (estado === "success") {
					precioMoneda = parseFloat(respuesta.data.amount);
					let nuevaFila = document.createElement("tr");
					nuevaFila.innerHTML = `
							<td>${moneda}</td>
							<td>${cuentas[i].wallet[moneda]}</td>
							<td>$${parseFloat(cuentas[i].wallet[moneda])*precioMoneda}</td>`;
					tabla.appendChild(nuevaFila);
				}
			});

		}
	}

}
$("#disponible").attr("value", dineroDisponible);