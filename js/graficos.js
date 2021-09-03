let historialInversiones = JSON.parse(localStorage.getItem("historial"));
let datos = [];
let labels = [];
for (const operacion of historialInversiones) {
	datos.push(operacion.saldoPorcentaje);
	labels.push(operacion.fechaHora);
}
const data = {
	labels: labels,
	datasets: [{
		label: 'My First Dataset',
		data: datos,
		fill: false,
		borderColor: 'rgb(75, 192, 192)',
		tension: 0.1
	}]
};

var ctx = $('#myChart');
var myChart = new Chart(ctx, {
	type: 'line',
	data: data,
	options: {
		scales: {
			y: {
				stacked: true
			}
		}
	}

});