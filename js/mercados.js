/* #################### Genero una grafica por cada criptomonedas que posee el usuario actual ####################### */

let usuarioActivo=JSON.parse(localStorage.getItem("usuario"));
let precioMoneda;
let tabla = document.getElementById("tableBody");
$.get("./data/cuentas.json", function (respuesta, estado) {
	if (estado === "success") {
		for (const user of respuesta) {
			if (user.usuario == usuarioActivo) {
				console.log(user);
				for (const moneda in user.wallet) {
					URLGET = `https://api.coinbase.com/v2/prices/${moneda}-USD/buy`
					$.get(URLGET, function (respuesta, estado) {
						if (estado === "success") {
							precioMoneda= parseFloat(respuesta.data.amount);
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
	}

});