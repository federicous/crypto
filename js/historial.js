/* #################### Genero una tabla con los datos de las inversiones ####################### */

let historialInversiones = JSON.parse(localStorage.getItem("historial"));
let tabla = document.getElementById("tableBody");

for (let op = 0; op < historialInversiones.length; op++) {
	let nuevaFila = document.createElement("tr");
	nuevaFila.innerHTML = `<td>${op+1}</td>
			<td>${historialInversiones[op].fechaHora}</td>
			<td>${historialInversiones[op].nombre}</td>
			<td>${historialInversiones[op].dineroInvertido}</td>
			<td>${historialInversiones[op].saldoPorcentaje}%</td>
			<td>${historialInversiones[op].estado}</td>`;
	tabla.appendChild(nuevaFila);
}

/* ############### Ordenar tabla ##################### */
$('th').click(function(){
	var table = $(this).parents('table').eq(0)
	var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
	this.asc = !this.asc
	if (!this.asc){rows = rows.reverse()}
	for (var i = 0; i < rows.length; i++){table.append(rows[i])}
    })
    function comparer(index) {
	return function(a, b) {
	    var valA = getCellValue(a, index), valB = getCellValue(b, index)
	    return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
	}
    }
    function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

$("th").css("cursor","pointer");