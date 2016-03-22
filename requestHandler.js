/* Fichier qui traite la réponse à envoyer au client en fonction de la page sur laquelle il est.
 * (dans cette petite application il n'y a que l'index)
 */

"use strict";

var fs = require("fs");

function index(response) {
	console.log("Chargement de index.html");
	fs.readFile('./index.html', 'utf-8', function(error, content) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(content);   //contenu de index.html
	});
}

exports.index = index;
