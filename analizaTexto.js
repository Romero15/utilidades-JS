window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "\o/";

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;                            //Webkit, Safari, Chrome
});


//Flujo
//Llega la llamada a comprueba>>analizaErrores>>resultado

//Objeto que contendrá todos la información de la validación
function Validacion(script,total,ok,ko,listaOk,listaKo,esquemas,sentencias) {
  //Contendrá el texto a analizar
  this.script = script;
  //Contador de coincidencias
  this.total = total;
  //Contador de afectadas(sin duplicados)
  this.ok = ok;
  //Contador de coincidencia con error
  this.ko = ko;
  //Listado de afectadas(sin duplicados)
  this.listaOk = listaOk;
  //Listado de coincidencia con error(sin duplicados)
  this.listaKo = listaKo;
  //Listado de esquemas afectados(sin duplicados)
  this.esquemas = esquemas;
  //Recuento de sentencias en script
  this.sentencias = sentencias;
}

function cuentaSentencias(str){
  var aux=str.trim();
  //Primer filtrado
  var sentenciasf1=aux.split('\n');
  var sentenciasf2=[];
  //segundo filtrado
  //console.log('Sin borrar comentarios'); 
  //console.log(sentenciasf1);
  var j=0;
  for(var i=0;i<sentenciasf1.length;i++){    
   aux= sentenciasf1[i].toString().replace(/\t+/g,"");
   var peso=aux.length;
   if(aux){
      if(peso=== 0 || (aux[0]=='-' && aux[1]=='-'))
      {      
       // console.log('Borrada');
      }else{
        sentenciasf2[j]=aux.toString().trim();
        j++;
      }
    }
   //var primera=sentenciasf2[i].trim().split(' ',1);
    //console.log("DETECTADO f2 ["+i+"] = "+primera);
  }
  //console.log('Comentarios borrados'); 
  //console.log(sentenciasf2); 
  return sentenciasf2;
}

function comprueba(param){
  
  var test=new Validacion();
  var str=document.getElementById("sentencia").value;
  if(str){
    console.time('*Tiempo total de análisis: ');
    if(param===1){
      console.log("Num de caracteres :"+str.length);
      test= analizaErrores(str);
      console.timeEnd('*Tiempo total de análisis: ');
      return resultado(test);
        }
    console.timeEnd('*Tiempo total de análisis: ');
  }else{
    document.getElementById("error").innerHTML = "No hay sentencia que analizar";
  }
  
}

function saluda(desde){
  if(desde ===1){
  console.log("Hola santi");
  }else{
      console.log("Analizando...");
    }
}

function resultado(test) {
  document.getElementById("sentencias").innerHTML = "<b>Nº de sentencias: </b>: "+test.sentencias;
  document.getElementById("contadorTo").innerHTML = "<b>Coincidencias</b>: "+test.total;
  document.getElementById("afectadas").innerHTML = "<b>Afectadas: </b> "+test.ok;
  document.getElementById("listaTablas").innerHTML="<div class='card' style='width: 18rem;'><div class='card-header'><b>Estructuras afectadas</b></div><ul class='list-group list-group-flush' id='lista'></ul></div>";
  var lista=[];
  lista=test.listaOk;
  for (var x=0;x<lista.length; x++){
    var tabla=document.createElement("LI");
    var valor = document.createTextNode(lista[x]);
    tabla.setAttribute('class','list-group-item');
    tabla.appendChild(valor);
    document.getElementById("lista").appendChild(tabla);   
  }
  document.getElementById("esquemas").innerHTML = "<b>Lista de esquemas: </b>"+test.esquemas;
  document.getElementById("contador_errores").innerHTML = "<b>Coincidencias con errores: </b>"+test.ko;
  document.getElementById("errores").innerHTML = "<b>Valida esquema: </b>"+test.listaKo; 
  document.getElementById("tabSelect").value= test.listaOk.join('&');
  return 1;
}

function analizaErrores(str)
{
//BUSCA ESQUEMAS Y TABLAS AFECTADAS:
//Detecta tablas o estructuras que sigan la nomenclatura estandar segun
//la expresión regular 'regex'
//la regex permite localizar nombres de tablas, aunque el nombre de la tabla
//no coincida con el esquema e: PVOL.TBAGV123_PRUEBA.
//Este tipo de error se filtra más adelante:
//-Si coincide el esquema con la tabla pasa a la lista de afectadas.
//-Si no coincide el esquema con la tabla pasa a la lista de errores.
saluda(2);
const regex = /[P]([A-Z]{3})[.](TB|SQ)[A-Z]{3}\w+/ig;
let m;
var listaTablas =[];
var listaTablasMal =[];  
var listaEsquemas =[];
console.time('*Contando sentencias: ');
var sentencias= cuentaSentencias(str);
console.timeEnd('*Contando sentencias: ');
//console.log("Sentencias detectadas: "+sentencias);
//Funcion para eliminar los duplicados de un array
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});
//Inicializamos los contadores
var acuTo=0;
var acuOk=0;
var acuKo=0;
console.time('*Buscando objetos afectados: ');
while ((m = regex.exec(sentencias)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      //El groupIndex es como ordena las reglas/coinicendencias
      //En este caso 0=Coincidencia de patron regex, 1=esquema bien nombrad0, 2=tipo(TB/SQ/VW)      
     // console.log(`Found match, group ${groupIndex}: ${match}`);
        if(groupIndex ===0){
          console.log(`Coincidencia encontrada: ${match}`);             
          var esquema=match.substring(0,4);
          var validaEsquema=esquema.substring(1,4).toUpperCase();
          var tabla=match;             
          var validaTabla=tabla.substring(7,10).toUpperCase();
          acuTo+=1;    
          if(validaEsquema == validaTabla){
            var x=acuOk.value;
              listaTablas.push(tabla.toUpperCase());
              listaEsquemas.push(esquema.toUpperCase());
              acuOk+=1;
          }else{                      
              listaTablasMal.push(tabla.toUpperCase());
              acuKo+=1; 
          };
        }     
    });
};
console.timeEnd('*Buscando objetos afectados: ')
var test =new Validacion(str,acuTo,listaTablas.unique().length,acuKo,listaTablas.unique(),listaTablasMal.unique(),listaEsquemas.unique(),sentencias.length);
//console.log(test);
return test;
}

function pegado(){
  alert("Pegado!! (análisis automatico OFF)");
  comprueba(1);
  //alert("Analizando script");
  //comprueba(1);
}


