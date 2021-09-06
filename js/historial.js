/* #################### Genero una tabla con los datos de las inversiones ####################### */

let historialInversiones = JSON.parse(localStorage.getItem("historial"));
let tabla = document.getElementById("tableBody");

$(document).ready(function () {

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
});