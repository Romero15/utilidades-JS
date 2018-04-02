


<?php session_start();

$valor_sesion = $_SESSION["var_sesion"];
$valor_sesion = "lo que sea"; 
echo $valor_sesion; 
?>
<html lang="es">
<head>
  <meta charset="utf-8">  
  <!--Librerias propias -->
  <script type="text/javascript" src="./analizaTexto.js"></script>
  <script type="text/javascript" src="./gestionArchivos.js"></script>
 <!-- Librerias externas -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <title>Analiza script</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    #progress_bar {
      margin: 10px 0;
      padding: 3px;
      border: 1px solid #000;
      font-size: 14px;
      clear: both;
      opacity: 0;
      -moz-transition: opacity 1s linear;
      -o-transition: opacity 1s linear;
      -webkit-transition: opacity 1s linear;
    }
    #progress_bar.loading {
      opacity: 1.0;
    }
    #progress_bar .percent {
      background-color: #99ccff;
      height: auto;
      width: 0;
    }
  </style>

</head>
<body>
  <div class="container">
    <div class="row" id="cabecera">
      <h1>Busca afectadas:</h1>
    </div>
  </div>
  <div class="container">
    <div class="row">
    <br>
    <div class="col-lg-7">
      <div class="row">
          <h6>Texto a analizar:</h6>
          <textarea class="formControl" id="sentencia" rows="10" cols="60" ondrop="drop_handler2(event);" ondragover="dragover_handler(event);" onpaste="setTimeout(function(){pegado();}, 4)" style="resize:none;"></textarea>
      </div>
      <div class="row">
        <span id="error"></span>
        <output id="list"></output>
      </div>      
      <input type="hidden" id="tabSelect">
    </div>
    <div class="col-lg-5">
      <div class="panel panel-primary">
          <div class="panel-heading">
            <h6>Datos análisis:</h6>
          </div>
          <div class="panel-body">
            <p id="sentencias"></P>
            <p id="contadorTo"></P>
            <p id="contadorOk"></P>
            <p id="afectadas"></P>
            <p id="lista"></P>
            <P id="esquemas"></p>
            <p id="contador_errores"></P>
            <p id="errores"></p>
          </div>
          <div class="panel-footer">
            <!--Info para el piede del panel -->
          </div>
      </div>
    </div>
    <br>
  </div>
  </div>
  <div class="container" id="botonera">
      <div class="row" style="padding-top: 15px;padding-left: 15px;">
        <input type="button"  value="Analiza" onclick="comprueba(0)" disabled/>
        <input type="button" value="Analiza + Errores" onclick="comprueba(1)"/>
        <input type="button"  value="Saluda" onclick="saluda(1)"/>
        <input type="button"  value="Muestra cadena" onclick="alert('TabSelect = '+document.getElementById('tabSelect').value)"/>   
      </div>
      <div class="row">
        <div class="col-lg-6"style="padding-top: 15px;padding-left: 15px;">
          <div class="input-group">
              <div class="col-lg-3" style="padding-right: 0px;">
            <input type="text" id="nombre_archivo" class="form-control" placeholder="Escribe nombre para el archivo">
          </div>
          <div class="col-lg-9" style="padding-left: 0px;">
            <span class="input-group-btn">
              <button  type="button" onclick="document.getElementById('nombre_archivo').value ==='' ? alert('Nombre para fichero vacio') : generar_doc(1,document.getElementById('nombre_archivo').value);">Generar informe</button>
            </span>
            <span class="input-group-btn">
              <button  type="button" onclick="document.getElementById('nombre_archivo').value === '' ? alert('Nombre para sql vacio') : generar_doc(2,document.getElementById('nombre_archivo').value)">Generar SQL</button>
            </span>
          </div>
          </div>
        </div>
    </div>
  </div>
<div class="container" id="archivos">
  <div class="row"style="padding-top: 15px;padding-left: 15px;">
    <input type="file" id="files" accept=".sql, .txt" onchange="onChange(event,event.target.files[0])" name="file" />
    <button onclick="abortRead();">Cancelar lectura</button>
  </div>
  <div class="row" id="progress_bar">
      <div class="percent">0%</div>
  </div>
  
  <div class="row" id="mensajes">
      <span id="mensaje"></span>
  </div>
</div>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>