/* #################### Genero una tabla con las cantidades de criptomonedas del usuario actual ####################### */
let historialInversiones;
let usuarioActivo;
/* Lectura de los datos de las cuentas */
cuentas = JSON.parse(localStorage.getItem("cuentas"));

/* Cargo el usuario activo */
usuarioActivo = JSON.parse(localStorage.getItem("usuario"))

let precioMoneda;
let tabla = document.getElementById("tableBody");

for (const user of cuentas) {
	if (user.usuario == usuarioActivo) {
		console.log(user);
		for (const moneda in user.wallet) {
			URLGET = `https://api.coinbase.com/v2/prices/${moneda}-USD/buy`
			$.get(URLGET, function (respuesta, estado) {
				if (estado === "success") {
					precioMoneda = parseFloat(respuesta.data.amount);
					let nuevaFila = document.createElement("tr");
					nuevaFila.innerHTML = `
							<td>${moneda}</td>
							<td>${user.wallet[moneda]}</td>
							<td>$${parseFloat(user.wallet[moneda])*precioMoneda}</td>`;
					tabla.appendChild(nuevaFila);
				}
			});

		}
	}

}