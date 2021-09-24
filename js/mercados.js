/* #################### Genero una grafica por cada criptomonedas que posee el usuario actual ####################### */

let usuarioActivo = JSON.parse(localStorage.getItem("usuario"));
let precioMoneda;
let tabla = document.getElementById("tableBody");

$(document).ready(function () {

	$.get("./data/cuentas.json", function (respuesta, estado) {
		if (estado === "success") {
			for (const user of respuesta) {
				if (user.usuario == usuarioActivo) {
					console.log(user);
					for (const moneda in user.wallet) {


						$("#tradingView").append(`
							<!-- TradingView Widget BEGIN -->
							<div class="tradingview-widget-container">
							  <div id="tradingview_aff49" class="tradingViewGrafico"></div>
							  <div class="tradingview-widget-copyright"><a href="https://es.tradingview.com/symbols/${moneda}USD/?exchange=COINBASE" rel="noopener" target="_blank"><span class="blue-text">Gráfico</span></a> por TradingView</div>
							  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
							  <script type="text/javascript">
							  new TradingView.widget(
							  {
							  "autosize": true,
							  "symbol": "COINBASE:${moneda}USD",
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
								`);


					}
				}

			}
		}

	});
});