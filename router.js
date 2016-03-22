/* Fichier qui redirige les requete de l'utilisateur vers le traitement adapé */

"use strict";

function route(pathname, handle, response) {
	//on vérifie que handle[pathname] est bien une fonction pour ne pas lui passer de paramètre dans le cas contraire
 	if (typeof handle[pathname] === 'function') { 
		handle[pathname](response);  //s'il existe un traitement associé au chemin courant, on l'execute
	}else{
		console.log("Erreur 404 : la page " + pathname +" n'a pas été trouvée");
		response.writeHead(404, {"Content-Type": "text/plain"}); 
		response.write("Erreur 404 : la page n'a pas été trouvée");
		response.end();
	}	
}

exports.route = route;

