/* #################### Genero una tabla con los datos de las inversiones ####################### */
let historialInversiones;
let usuarioActivo;
/* Lectura de los datos de las cuentas */
cuentas = JSON.parse(localStorage.getItem("cuentas"));
	
/* Cargo el usuario activo */
usuarioActivo = JSON.parse(localStorage.getItem("usuario"));

for (let i = 0; i < cuentas.length; i++) {
	if (cuentas[i].usuario == usuarioActivo) {
		historialInversiones= cuentas[i].historial;
		break;
	}
}

let tabla = document.getElementById("tableBody");

for (let op = 0; op < historialInversiones.length; op++) {
	let nuevaFila = document.createElement("tr");
	nuevaFila.innerHTML = `<td>${op+1}</td>
			<td>${historialInversiones[op].fechaHora}</td>
			<td>${historialInversiones[op].nombre}</td>
			<td>$${historialInversiones[op].dineroInvertido}</td>
			<td>${historialInversiones[op].saldoPorcentaje}%</td>
			<td>${historialInversiones[op].estado}</td>`;
	tabla.appendChild(nuevaFila);
}