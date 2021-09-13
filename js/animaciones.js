$(function(){
$(".logoPrincipal").fadeIn(2000,function () {
	$(".ojos").fadeIn(1500);
});
$(".logoTexto").fadeIn(2000);
$(".botonInicio").fadeIn().click(function () {
	$(".botonInicio").hide(1000);
	$(".credenciales").slideDown();
	$(".accesoPrueba").fadeIn();
});
//   $("#cuerpo").fadeIn("slow");

});