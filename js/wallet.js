/* #################### Genero una tabla con los datos de las inversiones ####################### */

// let historialInversiones = JSON.parse(localStorage.getItem("cuenta"));
// let tabla = document.getElementById("tableBody");

// for (let op = 0; op < historialInversiones.length; op++) {
// 	let nuevaFila = document.createElement("tr");
// 	nuevaFila.innerHTML = `<td>${op+1}</td>
// 			<td>${historialInversiones[op].fechaHora}</td>
// 			<td>${historialInversiones[op].nombre}</td>
// 			<td>$${historialInversiones[op].dineroInvertido}</td>
// 			<td>${historialInversiones[op].saldoPorcentaje}%</td>
// 			<td>${historialInversiones[op].estado}</td>`;
// 	tabla.appendChild(nuevaFila);
// }
// $('.table').tablesorter();
console.log("hola");
let precioMoneda;
let tabla = document.getElementById("tableBody");
console.log(tabla);
$.get("./data/cuentas.json", function (respuesta, estado) {
	if (estado === "success") {
		for (const user of respuesta) {
			if (user.usuario == "admin") {
				console.log(user);
				for (const moneda in user.wallet) {
					console.log(user.wallet[moneda]);
					console.log(moneda);
					URLGET = `https://api.coinbase.com/v2/prices/${moneda}-USD/buy`
					$.get(URLGET, function (respuesta, estado) {
						if (estado === "success") {
							precioMoneda= parseFloat(respuesta.data.amount);
							let nuevaFila = document.createElement("tr");
							nuevaFila.innerHTML = `
							<td>${moneda}</td>
							<td>${user.wallet[moneda]}</td>
							<td>${parseFloat(user.wallet[moneda])*precioMoneda}</td>`;
							tabla.appendChild(nuevaFila);
						}
					});

				}
			}

		}
	}
	// console.log(respuesta);

});