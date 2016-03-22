/* Fichier principal */

"use strict";

//charger les modules
var server = require('./server');
var router = require("./router");
var requestHandler = require("./requestHandler");

//tableau qui liste les sites Web surveillés par cette application
var websites = ["http://forum.ubuntu-fr.org/login.php", "http://www.clubic.com/", "http://elpais.com/", "http://stackoverflow.com/", "http://www.google.fr/", "http://www.wordreference.com/ende/", "http://www.lemonde.fr/sciences/", "http://elqui.fr/blog/"];

//le routage n'est pas vraiment nécessaire pour cette application car on n'a qu'une seule page
//table de couplage :  handle[chemin] = traitement à faire    
var handle = {};
handle["/"] = requestHandler.index;
handle["/index"] = requestHandler.index;

//on supprime le fichier de log précédent
server.deleteLog();

//on démarre le serveur
var io = server.start(router.route, handle);

//on initialise la tableau lastPageArray pour avoir l'état initial des sites Web surveillés
for (var i = 0; i < websites.length; i++) {
	server.initWebsites(websites, i);
}
console.log("Initialisation des sites web terminée.")

//fonction qui permet de vérifier pour chaque site s'il a été modifié
function loopCheckModifications() {
	for (var i = 0; i < websites.length; i++) {
		server.modification(websites, i, io);
	}
}

//on répête l'action régulièrement (une fois par minute)
var waitTime = 60000;
setInterval(loopCheckModifications, waitTime); 


