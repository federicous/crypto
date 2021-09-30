
let cuentas;

$(function () {
	$.get("./data/cuentas.json", function (respuesta, estado) {
		if (estado === "success") {
			localStorage.setItem("cuentas", JSON.stringify(respuesta));

		}

	});
	cuentas = JSON.parse(localStorage.getItem("cuentas"));
	console.log(cuentas);
});