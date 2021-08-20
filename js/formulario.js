let listaCryptos = ["BTC", "ETH", "ADA", "LTC", "DOT", "MATIC", "NEO", "ATOM", "VET", "ICX"];
let seleccion= document.getElementById("cryptoSelect");

for (let coin of listaCryptos) {
	let opcion= document.createElement("option");
	opcion.value=coin;
	opcion.text=coin;
	seleccion.appendChild(opcion)
}
