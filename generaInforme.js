function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

//Función de ayuda: reúne los datos a exportar en un solo objeto
function obtenerDatos() {
    return {
        nombre: document.getElementById('textNombre').value,
        telefono: document.getElementById('textTelefono').value,
        fecha: (new Date()).toLocaleDateString()
    };
};

//Función de ayuda: "escapa" las entidades XML necesarias
//para los valores (y atributos) del archivo XML
function escaparXML(cadena) {
    if (typeof cadena !== 'string') {
        return '';
    };
    cadena = cadena.replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;');
    return cadena;
};

//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(datos) {
    var texto = [];
    texto.push('*******************\n');
    texto.push('****-ANALISIS-*****\n');
    texto.push('*******************\n');
    texto.push('\n');
    texto.push('Informacion del script:\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('-------------');
    texto.push('\n');
    texto.push('nº  de sentencias detectadas: ');
    texto.push(datos.sentencias);
    texto.push('\n');
    texto.push('-------------');
    texto.push('\n');
    texto.push('Total de coincidencias: ');
    texto.push(datos.total);
    texto.push('\n');
    texto.push('-------------');
    texto.push('\n');
    texto.push('Esquemas afectados: ');
    texto.push(datos.esquemas);
    texto.push('\n');
    texto.push('Estructuras afectadas: ');
    texto.push(datos.ok);
    texto.push('\n');
    texto.push('Listado: ');
    var lista=[]; 
    lista=datos.listaOk;
    for (var x=0;x<listaOk.length; x++){
        texto.push('- ');
        texto.push(lista[x]);
        texto.push('\n');
    }
    texto.push('\n');
    texto.push('-------------');
    texto.push('\n');
    texto.push('-------------');
    texto.push('nº estructuras erroneas: ');
    texto.push(datos.ko);
    texto.push('\n');
    texto.push('Listado: ');
    texto.push(datos.listaKo);
    texto.push('\n'); 
    texto.push('\n');
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};


//Genera un objeto Blob con los datos en un archivo XML
function generarXml(datos) {
    var texto = [];
    texto.push('<?xml version="1.0" encoding="UTF-8" ?>\n');
    texto.push('<datos>\n');
    texto.push('\t<nombre>');
    texto.push(escaparXML(datos.nombre));
    texto.push('</nombre>\n');
    texto.push('\t<telefono>');
    texto.push(escaparXML(datos.telefono));
    texto.push('</telefono>\n');
    texto.push('\t<fecha>');
    texto.push(escaparXML(datos.fecha));
    texto.push('</fecha>\n');
    texto.push('</datos>');
    //No olvidemos especificar el tipo MIME correcto :)
    return new Blob(texto, {
        type: 'application/xml'
    });
};
