   var cont=(function() {
        //Empieza a contar desde el 1
        var contadorInterno = 1;
        function cambia(val) {
          contadorInterno += val;
        }
        return {
          incrementa: function() {
            cambia(1);
          },
          value: function() {
            return contadorInterno;
          }
        }   
      })();
      
      //Llamadas
      cont.value();
      cont.incrementa();
