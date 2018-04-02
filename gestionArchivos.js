
//lectura y generación de archivos
var reader;
var progress = document.querySelector('.percent');

  function leerArchivo(event,file){
     // Reseteamos el  contador de progreso
     var progress = document.querySelector('.percent');
     progress.style.width = '0%';
     progress.textContent = '0%';   
     //var file = event.target.files[0];
     reader = new FileReader();
     reader.onerror = errorHandler;
     reader.onprogress = updateProgress(event);
     //Al abortar lectura
     reader.onabort = function(event) {
         alert('Cancelada lectura de archivo');
       };
     reader.onloadstart = function(event) {
         document.getElementById('progress_bar').className = 'loading';
       };
     //Al  terminar
     reader.onload = function(event) {
       // El texto del archivo se mostrará por consola aquí
       var leido=event.target.result;
       //console.log('Leido:');
       //console.log(leido);
       document.getElementById("sentencia").value = leido.toString();      
       // Ensure that the progress bar displays 100% at the end.
       progress.style.width = '100%';
       progress.textContent = '100%';
       setTimeout("document.getElementById('progress_bar').className='';", 2000);
     };
   
     reader.readAsText(file,"UTF-8");
  }

function abortRead() {
  reader.abort();
}

function errorHandler(evt) {
  switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('Archivo no encontrado!');
      break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('No es leible');
      break;
    case evt.target.error.ABORT_ERR:
      break; // noop
    default:
      alert('Ocurrió un leer mientras se leia el archivo.');
  };
}

function updateProgress(evt) {
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
        var progress = document.querySelector('.percent');
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';
    }
  }
}

//DRAG&DROp
  function dragover_handler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  function drop_handler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; 
    var file = files[0];
    var output = [];
      // files ->Objeto tipo FileList
    // 'files' es un FileList de objetos File. Listamos algunas propiedades.
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><b>', escape(f.name), '</b> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, última edición: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    leerArchivo(evt,file);
  }

//Genereación
//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(datos,opc) {
  /**TO DO
   * Agregar cabecera con firma
   */
    var texto = [];
    switch(opc)
    {
      case 1:
        texto.push('----------------------------------\n');
        texto.push('|     ANÁLISIS DE SCRIPT v1.0    |\n');
        texto.push('----------------------------------\n');
        texto.push('\n');
        texto.push('\n');
        texto.push('Resultados:\n');
        texto.push('---------------------\n');
        texto.push('\n');
        texto.push('nº  de sentencias detectadas: ');
        texto.push(datos.sentencias);
        texto.push('\n');
        texto.push('\n');
        texto.push('Total de coincidencias: ');
        texto.push(datos.total);
        texto.push('\n');
        texto.push('\n');
        texto.push('Esquemas afectados: ');
        texto.push(datos.esquemas);
        texto.push('\n');
        texto.push('\n');
        texto.push('Estructuras afectadas: ');
        texto.push(datos.ok);
        texto.push('\n');
        texto.push('\nListado');
        texto.push('\n');
        texto.push('---------\n');
        var lista=[];
        lista=datos.listaOk;
        for (var x=0;x<lista.length; x++){
            texto.push('- ');
            texto.push(lista[x]);
            texto.push('\n');
        }
        texto.push('-------------');
        texto.push('\n');
        texto.push('nº estructuras erroneas: ');
        texto.push(datos.ko);
        texto.push('\n');
        texto.push('Listado de erroneas: ');
        texto.push(datos.listaKo);
        texto.push('\n');
        texto.push('-------------');   
        texto.push('\n');
        texto.push('\n');
        texto.push('FIN DE ANÁLISIS');
        return new Blob(texto, {
              type: 'text/plain'
          });
        break;
      case 2:
        texto.push(datos);
        return new Blob(texto, {
          type: 'application/sql'
          });
      break;
  }

      }
    
  
  //Función de ayuda: reúne los datos a exportar en un solo objeto
  function obtenerDatos() {
    return {
        nombre: document.getElementById('textNombre').value,
        telefono: document.getElementById('textTelefono').value,
        fecha: (new Date()).toLocaleDateString()
    };
  }
  
  function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    //Creamos FileREader para leer el Blob
    var reader = new FileReader();
     //Definimos la función que manejará el archivo
    //una vez haya terminado de leerlo
    reader.onload = function (event) {
      //Usaremos un link para iniciar la descarga
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        //Truco: así le damos el nombre al archivo
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
      //Simulamos un clic del usuario
      //no es necesario agregar el link al DOM.
        save.dispatchEvent(clicEvent);
      //Y liberamos recursos...
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
    //Leemos el blob y esperamos a que dispare el evento "load"
    return true;
  }
  function pide_valor(opc){
    var valor;
    switch (opc){
      case 1:
        valor=prompt("Por favor indica un nombre para el informe a generar","AnalisisID : x");
        break;
      case 2:
        valor=prompt("Por favor indica un nombre para el script a generar","SolicitudID : x");
        break;
    }
    return valor;
  }
  
  function generar_doc(opc,nombre){
    var str=document.getElementById("sentencia").value;
    if(str){
    switch (opc){
      case 1:
        var test=new Validacion();
        test= analizaErrores(str);
        if(descargarArchivo(generarTexto(test,1), nombre)){
          document.getElementById("error").innerHTML = "Generado informe de análisis";
        }else{
          document.getElementById("error").innerHTML = "NO Generado txt";
        }
        break;
      case 2:
        if(descargarArchivo(generarTexto(str,2), nombre.concat('.sql'))){
            document.getElementById("error").innerHTML = "Generado .sql";
        }else{
            document.getElementById("error").innerHTML = "NO Generado .sql";
        }
        break;
    }
  }else{
    document.getElementById("error").innerHTML = "Campo de sentencia vacio";
  }
  }
 

