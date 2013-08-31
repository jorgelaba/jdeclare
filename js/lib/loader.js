/**
 * Criada para realizar o parse das informacoes
 * e servir de base para construcao dos widgets / scripts.
 *
 * @author Jorge Laba
 */
var onInitConfig = {};

//IE 7/8 Fix object.create
if (!Object.create) {
    Object.create = function (o) {
    	if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        
        function F() {}
       
        F.prototype = o;
        
        return new F();
    };
}

define(function() {
	
	/**
	 *Class utilitaria responsavel por todas as acoes
	 *do modulo de jquery declarativo.
	 */
	var ProcessClass = function() {
				
		/*
		* Metodo responsavel por ler os a pagina html
		* buscando as anotacoes do plugin "data-onc-type" e chamando/instanciando
		* os modulos criados.
		*/
		this.processDeclarative = function() {
			var scriptsLoad = [];
			
			//Realiza o loop de todas as declaracoes
			$('[data-onc-type], [data-onc-script]').each(function() {
				var _dom = $(this);
				var _this = this;
				
				if(_dom.attr("data-onc-is-process") != 'true') {
					_dom.attr("data-onc-is-process", true);
					
					//Identifico o tipo a ser carregado
					var type = (_dom.attr("data-onc-type")) ? "data-onc-type" : "data-onc-script";
					
					//Objeto contem o tipo necessario para execucao.
					var typeValue = _dom.attr(type);
					
					//Verifico se o caminho realmente existe
					if(typeValue == null)
						throw "data-onc-type not especify";
					
					if(type == "data-onc-script") {
						var paths = typeValue.split(',');
						
						var i, n = paths.length;
						
						for(i = 0; i < n; i++) {
							var pathScript = $.trim(paths[i]);
							
							if(scriptsLoad.indexOf(pathScript) == -1) {
								scriptsLoad.push(pathScript);
								
								console.log(pathScript);
								
								require([pathScript], function(obj) {
									if(obj == undefined)
										console.log("Nao foi possivel carregar o script solicitado");
									else	
										obj.init();
								});
							}
						}
					} else {
						//Realiza a rquisicao do arquivo e executa o metodo init.
						require([typeValue], function(obj) {
							if(obj == undefined)
								console.log("Nao foi possivel carregar o widget solicitado");
							else	
								(new obj()).init(_this);
						});
					}
				}
			});
		},
		
		this.reload = function() {
			ProcessClass().processDeclarative();
		},
		
		/*
		 * Realiza a conversao da string "modulo/metodo".
		 * Ex: app/modulo/onSender/execute 
		 * Modulo "app/modulo/onSender" 
		 * Metodo "execute"
		 */
		this.processCalled = function(path) {
			var split = path.split("/");
			var objModule = path.substring(0, path.lastIndexOf("/"));
			
			return {
				module: objModule,
				method: split[split.length-1]
			};
		};
		
		/*
		 * Metodo facilita a leitura dos parametros declarativos
		 * definidos na classe.
		 */
		this.declarativeRead = function(obj, tag, defaultValue) {
			var value = $(obj).attr(tag);
			
			if(value == null || value == '')
				value = defaultValue;
						
			return value;
		};

		/*
		 * Metodo facilita a leitura de atributos do tipo Array declarativos
		 * definidos na classe.
		 */
		this.declarativeReadList = function(obj, tag, defaultValue) {
			var value = $(obj).attr(tag);
			var list = null;

			if(value == null || value == '') {
				list = defaultValue;
			} else {
				list = value.split(",");
			}

			return list;
		};
		
		/*
		 * Metodo facilita a leitura de atributos booleanos
		 * definidos na classe.
		 */
		this.declarativeReadBoolean = function(obj, tag, defaultValue) {
			var value = $(obj).attr(tag);
			
			if(value == null || value == '')
				value = defaultValue;
			
			if(value == null)
				return null;
			
			return (value == true || value == "true") ? true : false;;
		};
		
		return this;
	};
	
	var processClass = new ProcessClass();
	
	return {
		init: function(args) {        	
			onInitConfig = args;
        	processClass.processDeclarative();
        },
        
        reload: processClass.reload,
        
        getInitConfig: function() {
        	return onInitConfig;
        },
        
        processCalled: processClass.processCalled,
        
        attributeRead: processClass.declarativeRead,
        
        attributeReadBoolean: processClass.declarativeReadBoolean,

        attributeReadList: processClass.declarativeReadList
	};
});