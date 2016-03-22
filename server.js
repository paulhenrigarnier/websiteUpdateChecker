/* Fichier qui représente les actions du serveur */

"use strict";

//charger les modules
var http = require("http");
var url = require("url");
var fs = require("fs");

var port = 8888; //choix arbitraire
var lastPageArray = []; //tableau qui contiendra le code HTML body de la dernière version de chacun des sites Web surveillés

//on efface le fichier de log
function deleteLog() {
	fs.unlink("./modifications.log", function(error) {}); //si le fichier n'existe pas, ne rien faire
}

//création du serveur HTTP
function start(route, handle) {
	var server = http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;   //on parse l'url demandée par le client
		console.log("Le chemin : " + pathname + " a été demandé.");
		route(pathname, handle, response); // 
	})

	//on charge socket.io
	var io = require('socket.io').listen(server);

	//Si un client se connecte, on l'écrit dans la console
	io.sockets.on('connection', function (socket) {
		console.log('Un client vient de se connecter');
	});

	server.listen(port); //on écoute sur le port 8888

	return io;
}

//fonction qui initialise lastPageArray
function initWebsites(websitesArray, i) {
	var tempInit = "";
	var req = http.request(websitesArray[i], function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			tempInit += chunk.toString();
		});
		res.on("end", function () {
			lastPageArray[i] = tempInit;
		}); 
	}).on('error', function(error) {
		console.log("Attention, erreur : " + error.message);
		if (error) throw error;
	}).end();
}

//fonction qui vérifie s'il y a une modification et si oui le signale et l'écrit dans le log
function modification(websitesArray, i, io) {
	var temp = "";
	var req = http.request(websitesArray[i], function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) { //on ajoute les données au string temp petit à petit
			temp += chunk.toString();
		}); 
		res.on("end", function () { //quand toutes les données ont été envoyées, on compare avec le contenu de lagePageArray pour en déduire s'il y a eu une modification, et si oui on la traite 
			if (temp != lastPageArray[i]) {
				lastPageArray[i] = temp; //on met à jour lastPageArray[i]
				io.sockets.emit('message', 'la page ' + websitesArray[i] +' a été modifiée.'); //transmet le message au client
				writeLog(websitesArray, i); //écrit dans le log
				console.log('la page ' + websitesArray[i] +' a été modifiée.');
			}
		}); 
	}).on('error', function(error) {
		console.log("Attention, erreur : " + error.message);
		if (error) throw error;
	}).end();
}

function writeLog(websitesArray, i) {
	var log = fs.createWriteStream('modifications.log', {'flags': 'a'});  // on ouvre un stream pour pouvoir ajouter du texte à la fin du fichier de log
	log.write(websitesArray[i] + " : \n" + new Date().toISOString() + "\n\n");
	log.end();
}


//on exporte les fonctions de ce module 
exports.deleteLog = deleteLog;
exports.initWebsites = initWebsites;
exports.start = start;
exports.modification = modification;

