let historialInversiones = JSON.parse(localStorage.getItem("historial"));
let datos = [];
let labels = [];
let positivo = 0;
let negativo = 0;
let cancelado = 0;

$(document).ready(function () {

	/* ########### Evolucion de porcentaje de ganancia ########## */
	for (const operacion of historialInversiones) {
		datos.push(operacion.saldoPorcentaje);
		labels.push(operacion.fechaHora);
	}
	const data = {
		labels: labels,
		datasets: [{
			label: 'Porcentaje de ganancia',
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


	/* ########### Grafico Doughnut ########## */

	for (const operacion of historialInversiones) {
		if (operacion.estado !== "Cancelado") {
			if (operacion.saldoPorcentaje > 0) {
				positivo += 1;
			}
			if (operacion.saldoPorcentaje < 0) {
				negativo += 1;
			}
		} else {
			cancelado += 1;
		}
	}

	const data2 = {
		labels: [
			'Positivo',
			'Negativo',
			'Cancelado'
		],
		datasets: [{
			label: 'My First Dataset',
			data: [positivo, negativo, cancelado],
			backgroundColor: [
				'rgb(54, 162, 235)',
				'rgb(255, 205, 86)',
				'rgb(255, 99, 132)'
			],
			hoverOffset: 4
		}]
	};

	var ctx = $('#myChart2');
	var myChart2 = new Chart(ctx, {
		type: 'doughnut',
		data: data2,

	});


});