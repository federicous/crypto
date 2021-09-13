$(function () {
	$(".logoPrincipal").fadeIn(1500, function () {
		$(".ojos").fadeIn(1000);
	});
	$(".logoTexto").fadeIn(1500);
	$(".botonInicio").fadeIn().click(function () {
		$(".botonInicio").hide(1000);
		$(".credenciales").slideDown();
		$(".accesoPrueba").fadeIn();
	});

});