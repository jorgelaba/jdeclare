
/**
 * Configuracao dos diretorios bases do javascript
 **/
requirejs.config({
	urlArgs: "v=" + ((ENVIRONMENT != "dev") ? "1" : (new Date()).getTime()),
    appDir: "../",
    baseUrl: BASE_URL + 'js',
    paths: {
        app:  'app',
        lib:  'lib'
	}
});

/**
 * Carrega somente os pacotes necessarios para utilizacao do sistema
 **/
requirejs(["lib/loader"], function(Loader) {
	$(document).ready(function() {	
		try {
			Loader.init({});
		} catch(e) {
			console.log(e);
		}
	});
});	