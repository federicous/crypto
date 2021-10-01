let usuarioIngresado;
let claveIngresada;
let listaUsuarios;
let encontrado = false;

$("#usuario").change(() => {
	$(".avisos").remove();
});
$("#clave").change(() => {
	$(".avisos").remove();
})
$("#accesoDemo").click(() => {
	localStorage.setItem("usuario", JSON.stringify("demo"));
})

$(".botonIngreso").click(() => {
	usuarioIngresado = $("#usuario").val();
	claveIngresada = $("#clave").val();
	$(".avisos").remove();
	$.get("./data/cuentas.json", function (respuesta, estado) {
		if (estado === "success") {
			listaUsuarios = respuesta;
			for (const user of listaUsuarios) {
				if (user.usuario == usuarioIngresado && user.clave == claveIngresada) {

					/* Guardo en localStorage los datos de las cuentas */
					$.get("./data/cuentas.json", function (respuesta, estado) {
						if (estado === "success") {
							localStorage.setItem("cuentas", JSON.stringify(respuesta));
						}

					});
					window.location.href = "./trading.html"
					encontrado = true;

					/* Guardo el nombre del usuario activo */
					localStorage.setItem("usuario", JSON.stringify(usuarioIngresado));
				}
			}
			if (encontrado != true) {
				$("#formulario").append(`
				<div class="avisos alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3" role="alert">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
						<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
					</svg>
					<div>
					Usuario y/o Clave incorrectas
					</div>
					<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>
				`)
			}
		}
	});

});