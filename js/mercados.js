let cryptoSeleccion;
let currencies;
let currenciesList = [];

/* ################## Genero la lista de criptomonedas para seleccionar ##################### */

$(function () {

	const URLGETCUR = "https://api.pro.coinbase.com/currencies"
	$.get(URLGETCUR, function (respuesta, estado) {
		if (estado === "success") {
			currencies = respuesta;
			for (const moneda of currencies) {
				if (moneda.details.type == "crypto") {
					currenciesList.push(moneda.id);
				}
			}
			currenciesList.sort();
			let seleccion = document.getElementById("cryptoSelect");

			for (let coin of currenciesList) {
				let opcion = document.createElement("option");
				opcion.value = coin;
				opcion.text = coin;
				seleccion.appendChild(opcion);
			}
			$("option[value='BTC']").attr("selected", "selected");
			$("#cryptoSelect").trigger("change");
		};
	});
});





$("#cryptoSelect").change(() => {
	cryptoSeleccion = $("#cryptoSelect").val();
	$("#tradingViewSection").append(`
	<!-- TradingView Widget BEGIN -->
	<div class="tradingview-widget-container">
	  <div id="tradingview_aff49" class="tradingViewGrafico"></div>
	  <div class="tradingview-widget-copyright"><a href="https://es.tradingview.com/symbols/${cryptoSeleccion}USD/?exchange=COINBASE" rel="noopener" target="_blank"><span class="blue-text">Gráfico</span></a> por TradingView</div>
	  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
	  <script type="text/javascript">
	  new TradingView.widget(
	  {
	  "autosize": true,
	  "symbol": "COINBASE:${cryptoSeleccion}USD",
	  "interval": "60",
	  "timezone": "Etc/UTC",
	  "theme": "light",
	  "style": "1",
	  "locale": "es",
	  "toolbar_bg": "#f1f3f6",
	  "enable_publishing": false,
	  "allow_symbol_change": true,
	  "container_id": "tradingview_aff49"
	}
	  );
	  </script>
	</div>
	<!-- TradingView Widget END -->
		`)

});